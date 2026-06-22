#!/usr/bin/env bash
# =============================================================================
# create-lxc.sh — Provision a cloud-init Claude Code dev workstation as a
#                 Proxmox VE LXC container (Ubuntu 24.04 LTS).
#
# Run this ON THE PROXMOX HOST as root. It renders cloud-init/user-data with
# your settings, creates the container, seeds it via the NoCloud datasource,
# and reboots so cloud-init provisions XFCE+VNC, Claude Code, Docker, kubectl,
# Helm and Terraform.
#
# Usage:
#   ./create-lxc.sh                # uses the defaults / env vars below
#   VMID=9001 DEV_USER=aaron ./create-lxc.sh
# =============================================================================
set -euo pipefail

# ----------------------------- Configuration --------------------------------
VMID="${VMID:-9001}"                       # Proxmox container ID
HOSTNAME="${HOSTNAME:-claude-dev}"
DEV_USER="${DEV_USER:-developer}"          # login + VNC + Claude Code user

# Resources
CORES="${CORES:-4}"
MEMORY_MB="${MEMORY_MB:-8192}"
SWAP_MB="${SWAP_MB:-2048}"
DISK_GB="${DISK_GB:-32}"

# Storage / network
STORAGE="${STORAGE:-local-lvm}"            # rootfs storage pool
TEMPLATE_STORAGE="${TEMPLATE_STORAGE:-local}"
BRIDGE="${BRIDGE:-vmbr0}"
NET_IP="${NET_IP:-dhcp}"                    # dhcp, or e.g. 192.168.1.50/24
NET_GW="${NET_GW:-}"                        # gateway when using a static IP

# Container template (Ubuntu 24.04 standard)
TEMPLATE_NAME="${TEMPLATE_NAME:-ubuntu-24.04-standard_24.04-2_amd64.tar.zst}"

# Credentials / identity (CHANGE THESE)
VNC_PASSWORD="${VNC_PASSWORD:-changeme}"    # max 8 chars used by VNC auth
LOGIN_PASSWORD="${LOGIN_PASSWORD:-${VNC_PASSWORD}}"
SSH_PUBKEY="${SSH_PUBKEY:-$(cat ~/.ssh/id_ed25519.pub 2>/dev/null || cat ~/.ssh/id_rsa.pub 2>/dev/null || echo '')}"
GIT_NAME="${GIT_NAME:-Aaron Archer}"
GIT_EMAIL="${GIT_EMAIL:-aaron.archer.emt@gmail.com}"

# Privileged container? Unprivileged is safer; Docker-in-LXC needs nesting.
UNPRIVILEGED="${UNPRIVILEGED:-1}"
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLOUD_INIT_DIR="${SCRIPT_DIR}/cloud-init"

die() { echo "ERROR: $*" >&2; exit 1; }
log() { echo ">>> $*"; }

[ "$(id -u)" -eq 0 ] || die "Run as root on the Proxmox host."
command -v pct >/dev/null || die "pct not found — this must run on a Proxmox VE host."
[ -n "${SSH_PUBKEY}" ] || die "No SSH public key found. Set SSH_PUBKEY or create ~/.ssh/id_ed25519.pub."

# --- 1. Ensure the template is available -------------------------------------
TEMPLATE_REF="${TEMPLATE_STORAGE}:vztmpl/${TEMPLATE_NAME}"
if ! pveam list "${TEMPLATE_STORAGE}" 2>/dev/null | grep -q "${TEMPLATE_NAME}"; then
  log "Template ${TEMPLATE_NAME} not present; updating index and downloading"
  pveam update
  pveam download "${TEMPLATE_STORAGE}" "${TEMPLATE_NAME}"
fi

# --- 2. Render cloud-init user-data ------------------------------------------
log "Rendering cloud-init user-data"
LOGIN_PASSWORD_HASH="$(openssl passwd -6 "${LOGIN_PASSWORD}")"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "${WORKDIR}"' EXIT

# Escape characters that would break sed replacement.
esc() { printf '%s' "$1" | sed -e 's/[&|\\]/\\&/g'; }

sed \
  -e "s|__DEV_USER__|$(esc "${DEV_USER}")|g" \
  -e "s|__VNC_PASSWORD__|$(esc "${VNC_PASSWORD}")|g" \
  -e "s|__LOGIN_PASSWORD_HASH__|$(esc "${LOGIN_PASSWORD_HASH}")|g" \
  -e "s|__SSH_PUBKEY__|$(esc "${SSH_PUBKEY}")|g" \
  -e "s|__GIT_NAME__|$(esc "${GIT_NAME}")|g" \
  -e "s|__GIT_EMAIL__|$(esc "${GIT_EMAIL}")|g" \
  "${CLOUD_INIT_DIR}/user-data" > "${WORKDIR}/user-data"

sed -e "s|claude-dev|$(esc "${HOSTNAME}")|g" \
  "${CLOUD_INIT_DIR}/meta-data" > "${WORKDIR}/meta-data"

# --- 3. Create the container -------------------------------------------------
if [ "${NET_IP}" = "dhcp" ]; then
  NET_CONF="name=eth0,bridge=${BRIDGE},ip=dhcp"
else
  [ -n "${NET_GW}" ] || die "NET_GW is required when NET_IP is static."
  NET_CONF="name=eth0,bridge=${BRIDGE},ip=${NET_IP},gw=${NET_GW}"
fi

log "Creating LXC ${VMID} (${HOSTNAME})"
pct create "${VMID}" "${TEMPLATE_REF}" \
  --hostname "${HOSTNAME}" \
  --cores "${CORES}" \
  --memory "${MEMORY_MB}" \
  --swap "${SWAP_MB}" \
  --rootfs "${STORAGE}:${DISK_GB}" \
  --net0 "${NET_CONF}" \
  --features "nesting=1,keyctl=1" \
  --unprivileged "${UNPRIVILEGED}" \
  --ostype ubuntu \
  --onboot 1 \
  --start 1

log "Waiting for container network"
for _ in $(seq 1 30); do
  pct exec "${VMID}" -- getent hosts deb.nodesource.com >/dev/null 2>&1 && break
  sleep 2
done

# --- 4. Seed cloud-init (NoCloud datasource) ---------------------------------
log "Ensuring cloud-init is installed in the container"
pct exec "${VMID}" -- bash -lc 'export DEBIAN_FRONTEND=noninteractive; \
  command -v cloud-init >/dev/null || { apt-get update && apt-get install -y cloud-init; }'

log "Injecting NoCloud seed"
pct exec "${VMID}" -- mkdir -p /var/lib/cloud/seed/nocloud-net
pct push "${VMID}" "${WORKDIR}/user-data" /var/lib/cloud/seed/nocloud-net/user-data
pct push "${VMID}" "${WORKDIR}/meta-data" /var/lib/cloud/seed/nocloud-net/meta-data

log "Resetting cloud-init state so the seed runs on next boot"
pct exec "${VMID}" -- cloud-init clean --logs

# --- 5. Reboot to provision --------------------------------------------------
log "Rebooting to run cloud-init provisioning"
pct reboot "${VMID}"

cat <<EOF

============================================================================
 Container ${VMID} (${HOSTNAME}) is provisioning via cloud-init.

 Watch progress:
   pct exec ${VMID} -- cloud-init status --wait
   pct exec ${VMID} -- tail -f /var/log/provision-dev.log

 When done, connect the desktop over an SSH tunnel (VNC is localhost-only):
   ssh -N -L 5901:127.0.0.1:5901 ${DEV_USER}@<container-ip>
   # then point a VNC viewer at localhost:5901   (password: VNC_PASSWORD)

 Start Claude Code:
   ssh ${DEV_USER}@<container-ip>
   claude            # or:  export ANTHROPIC_API_KEY=... ; claude
============================================================================
EOF
