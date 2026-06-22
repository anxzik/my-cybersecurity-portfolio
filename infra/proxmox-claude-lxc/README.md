# Claude Code Dev Workstation — Proxmox LXC

A reproducible, **cloud-init–provisioned** Proxmox VE LXC container that serves
as a remote development workstation for running **Claude Code**. It ships an
XFCE desktop over TigerVNC and is pre-wired to the dev platform hosts used in
this lab.

## What you get

| Layer | Components |
|-------|-----------|
| Base | Ubuntu 24.04 LTS (unprivileged LXC, `nesting` + `keyctl` enabled) |
| Desktop | XFCE4 + TigerVNC (`:1`, port `5901`, **localhost-only**) |
| AI tooling | Node.js 20 LTS + `@anthropic-ai/claude-code` |
| Containers | Docker Engine + Buildx + Compose plugin |
| Kubernetes | `kubectl` + `helm` |
| IaC | `terraform` |
| Platform trust | `known_hosts` pre-seeded for **GitLab**, GitHub, Bitbucket, Azure DevOps; git identity configured |

## Files

```
infra/proxmox-claude-lxc/
├── create-lxc.sh            # run on the Proxmox host — builds + seeds the LXC
├── cloud-init/
│   ├── user-data            # cloud-init config (tokenized, rendered by the script)
│   └── meta-data            # instance id / hostname
└── README.md
```

## Prerequisites

- Proxmox VE 8.x host, root shell access.
- An SSH public key on the host (`~/.ssh/id_ed25519.pub`) or set `SSH_PUBKEY`.
- Outbound internet from the container (package + tool downloads).

## Quick start

From the Proxmox host:

```bash
git clone <this-repo> && cd infra/proxmox-claude-lxc

# Set at minimum a real VNC/login password and confirm storage/bridge names.
VMID=9001 \
STORAGE=local-lvm \
BRIDGE=vmbr0 \
DEV_USER=aaron \
VNC_PASSWORD='S3cret!' \
GIT_NAME='Aaron Archer' \
GIT_EMAIL='aaron.archer.emt@gmail.com' \
./create-lxc.sh
```

The script:

1. Downloads the Ubuntu 24.04 template if missing.
2. Renders `cloud-init/user-data` tokens (`__DEV_USER__`, `__VNC_PASSWORD__`, …).
3. Creates the LXC with Docker-friendly features (`nesting=1,keyctl=1`).
4. Installs `cloud-init`, drops a **NoCloud** seed into
   `/var/lib/cloud/seed/nocloud-net/`, runs `cloud-init clean`, and reboots so
   provisioning runs as a normal first-boot.

## Configuration reference

All values are environment variables read by `create-lxc.sh`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VMID` | `9001` | Proxmox container ID |
| `HOSTNAME` | `claude-dev` | Container hostname |
| `DEV_USER` | `developer` | Login / VNC / Claude Code user |
| `CORES` / `MEMORY_MB` / `SWAP_MB` / `DISK_GB` | `4` / `8192` / `2048` / `32` | Resources |
| `STORAGE` | `local-lvm` | rootfs storage pool |
| `TEMPLATE_STORAGE` | `local` | Where templates live |
| `BRIDGE` | `vmbr0` | Network bridge |
| `NET_IP` | `dhcp` | `dhcp` or static `CIDR` (then set `NET_GW`) |
| `VNC_PASSWORD` | `changeme` | VNC auth (max 8 chars used) |
| `LOGIN_PASSWORD` | = `VNC_PASSWORD` | Console/sudo password (hashed) |
| `SSH_PUBKEY` | auto-detected | Key authorized for `DEV_USER` |
| `GIT_NAME` / `GIT_EMAIL` | Aaron Archer / email | Global git identity |
| `UNPRIVILEGED` | `1` | Set `0` only if Docker misbehaves |

## Connecting

VNC is bound to `localhost` inside the container — **always tunnel over SSH**:

```bash
ssh -N -L 5901:127.0.0.1:5901 <DEV_USER>@<container-ip>
# then connect a VNC viewer to  localhost:5901
```

Watch provisioning:

```bash
pct exec <VMID> -- cloud-init status --wait
pct exec <VMID> -- tail -f /var/log/provision-dev.log
```

## Using Claude Code

```bash
ssh <DEV_USER>@<container-ip>
claude          # first run prompts for login
# or non-interactive auth:
export ANTHROPIC_API_KEY="sk-ant-..."
claude
```

For GitLab pushes, add your SSH key to GitLab and confirm connectivity — the
host key is already trusted:

```bash
ssh -T git@gitlab.com
```

## Security notes

- **Change `VNC_PASSWORD`/`LOGIN_PASSWORD`** before deploying; the defaults are
  placeholders. The login password is stored only as a SHA-512 hash in the seed.
- VNC never listens on the network directly — access is SSH-tunnelled.
- Docker-in-LXC relies on `nesting`/`keyctl`; if you need fully isolated
  Docker, run with `UNPRIVILEGED=0` (less secure) or use a VM.
- Do not commit real secrets (`ANTHROPIC_API_KEY`, VNC passwords) to git.

## Teardown

```bash
pct stop <VMID> && pct destroy <VMID>
```
