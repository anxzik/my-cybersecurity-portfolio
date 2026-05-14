/* ============================================================
   App — top-level: boot terminal, tweaks, main sections
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1fc8c8",
  "showMatrix": true,
  "showScanlines": true,
  "showGrid": true,
  "matrixDensity": 1,
  "bootMode": "auto",
  "heroLayout": "split"
}/*EDITMODE-END*/;

const BOOT_SEQ = [
  { kind: "out", tone: "dim",   text: "ARCHITSEC Secure Shell · openssh_9.6p1 · TLS 1.3 / ChaCha20-Poly1305" },
  { kind: "out", tone: "dim",   text: "Establishing encrypted channel..." },
  { kind: "wait", ms: 280 },
  { kind: "progress", label: "key-exchange   ", steps: 14 },
  { kind: "out", tone: "ok",    text: "✓ host fingerprint verified · SHA256:A1B2…7890" },
  { kind: "out", tone: "ok",    text: "✓ session established · user authenticated via YubiKey" },
  { kind: "wait", ms: 200 },
  { kind: "cmd", text: "whoami" },
  { kind: "out", tone: "info",  text: "aaron_archer" },
  { kind: "cmd", text: "uname -a" },
  { kind: "out", tone: "info",  text: "Linux architsec 6.8.0-hardened #1 SMP x86_64 GNU/Linux" },
  { kind: "cmd", text: "./initialize_portfolio.sh --secure --animated" },
  { kind: "out", tone: "warn",  text: "[*] loading identity matrix..." },
  { kind: "out", tone: "warn",  text: "[*] decrypting project archive (AES-256-GCM)..." },
  { kind: "out", tone: "warn",  text: "[*] verifying credentials against trusted root..." },
  { kind: "progress", label: "boot-sequence ", steps: 16 },
  { kind: "out", tone: "ok",    text: "✓ 8 modules loaded · 22 courses indexed · 8 certifications verified" },
  { kind: "out", tone: "ok",    text: "✓ all green · launching interface" },
  { kind: "wait", ms: 220 },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [booted, setBooted] = useState(localStorage.getItem("portfolio_booted") === "1");

  useEffect(() => {
    // Apply accent CSS var override
    document.documentElement.style.setProperty("--accent-override", t.accent);
    const style = document.getElementById("accent-override-style") || (() => {
      const s = document.createElement("style"); s.id = "accent-override-style"; document.head.appendChild(s); return s;
    })();
    style.textContent = `
      :root {
        --color-teal-400: ${t.accent} !important;
      }
    `;
  }, [t.accent]);

  const finishBoot = () => {
    setBooted(true);
    localStorage.setItem("portfolio_booted", "1");
  };

  const skipBoot = !booted && t.bootMode === "skip";
  useEffect(() => {
    if (skipBoot) finishBoot();
  }, [skipBoot]);

  return (
    <React.Fragment>
      {t.showGrid && <div className="grid-bg"></div>}
      <MatrixRain enabled={t.showMatrix} density={t.matrixDensity} color={t.accent} />
      {t.showScanlines && <div className="scanlines" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:2}}></div>}

      {!booted && t.bootMode !== "skip" && (
        <BootTerminal onDone={finishBoot} sequence={BOOT_SEQ} />
      )}

      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Education />
        <HomeLab />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Visual FX" />
        <TweakColor label="Accent" value={t.accent}
          options={["#1fc8c8", "#c9a84c", "#8b5cf6", "#c0392b"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Matrix rain"
          value={t.showMatrix} onChange={(v) => setTweak("showMatrix", v)} />
        <TweakToggle label="Scanlines"
          value={t.showScanlines} onChange={(v) => setTweak("showScanlines", v)} />
        <TweakToggle label="Grid overlay"
          value={t.showGrid} onChange={(v) => setTweak("showGrid", v)} />
        <TweakSlider label="Matrix density" value={t.matrixDensity}
          min={0.3} max={2.5} step={0.1}
          onChange={(v) => setTweak("matrixDensity", v)} />
        <TweakSection label="Intro" />
        <TweakRadio label="Boot terminal" value={t.bootMode}
          options={["auto","skip"]}
          onChange={(v) => { setTweak("bootMode", v); if (v === "auto") { localStorage.removeItem("portfolio_booted"); setBooted(false); } }} />
        <TweakButton onClick={() => { localStorage.removeItem("portfolio_booted"); setBooted(false); }}>
          ▶ Replay Boot Sequence
        </TweakButton>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
