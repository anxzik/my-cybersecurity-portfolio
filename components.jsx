/* ============================================================
   Sections — Portfolio
   Exports: Header, Hero, About, Skills, Projects, Achievements,
            Education, Contact, Footer, HeroVisual, MatrixRain
   ============================================================ */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ── Reusable: reveal-on-scroll wrapper ──────────────────────── */
function useReveal(ref, opts = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: opts.threshold ?? 0.15, rootMargin: opts.rootMargin ?? "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
}

function Reveal({ children, as: Tag = "div", className = "", stagger = false, ...rest }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <Tag ref={ref} className={`${stagger ? "reveal-stagger" : "reveal"} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ── Header ─────────────────────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = PORTFOLIO.navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
      const y = window.scrollY + window.innerHeight * 0.3;
      let cur = sections[0]?.id || "home";
      for (const s of sections) {
        if (s.offsetTop <= y) cur = s.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <a href="#home" className="brand" onClick={() => setOpen(false)}>
        <img src="assets/architsec-logo.png" alt="" className="brand-logo" />
        <span>{PORTFOLIO.identity.handle}</span>
        <span className="brand-tag">v2.6</span>
      </a>
      <button className="nav-mobile-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
        <i className={`bi bi-${open ? "x" : "list"}`}></i>
      </button>
      <ul className={`nav-links ${open ? "open" : ""}`}>
        {PORTFOLIO.navLinks.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={active === l.id ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  const { identity, rotatingRoles, stats } = PORTFOLIO;
  const [typed, setTyped] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const role = rotatingRoles[roleIdx];
    let i = 0;
    let dir = 1;
    let hold = 0;
    const tick = () => {
      if (dir === 1) {
        if (i <= role.length) {
          setTyped(role.slice(0, i));
          i++;
        } else if (hold < 22) {
          hold++;
        } else {
          dir = -1;
        }
      } else {
        if (i > 0) {
          i--;
          setTyped(role.slice(0, i));
        } else {
          setRoleIdx((r) => (r + 1) % rotatingRoles.length);
        }
      }
    };
    const id = setInterval(tick, 70);
    return () => clearInterval(id);
  }, [roleIdx]);

  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <div>
          <Reveal as="div" className="hero-overline">
            <span className="dot"></span>
            <span>{identity.status}</span>
          </Reveal>

          <Reveal as="h1" className="hero-title">
            <span className="glitch">{identity.name.split(" ")[0]}</span>{" "}
            <span className="accent">{identity.name.split(" ").slice(1).join(" ")}</span>
          </Reveal>

          <Reveal as="div" className="hero-typer">
            <span className="prefix">$ role --display</span>
            <span className="text">{typed}</span>
            <span className="pipe"></span>
          </Reveal>

          <Reveal as="p" className="hero-bio">{identity.tagline}</Reveal>

          <Reveal as="div" className="hero-ctas">
            <a href="#projects" className="btn btn-primary">
              <i className="bi bi-terminal"></i> View Projects
            </a>
            <a href="#contact" className="btn btn-ghost">
              <i className="bi bi-shield-lock"></i> Start Engagement
            </a>
            <a href="#" className="btn btn-gold" onClick={(e)=>{e.preventDefault(); alert('Resume export would download here.');}}>
              <i className="bi bi-file-earmark-arrow-down"></i> Resume.pdf
            </a>
          </Reveal>

          <Reveal as="div" className="hero-stats reveal-stagger">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-value">
                  {s.value}<span className="unit">{s.unit}</span>
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal as="div" className="hero-visual">
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Hero hex + orbital network SVG ──────────────────────────── */
function HeroVisual() {
  return (
    <React.Fragment>
      <div className="core"></div>
      <svg viewBox="-200 -200 400 400" fill="none">
        <defs>
          <radialGradient id="hexGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(31,200,200,0.4)" />
            <stop offset="100%" stopColor="rgba(31,200,200,0)" />
          </radialGradient>
        </defs>
        {/* Outer hexagon */}
        <g className="spin-slow" opacity="0.9">
          <polygon points="180,0 90,156 -90,156 -180,0 -90,-156 90,-156"
                   stroke="rgba(31,200,200,0.5)" strokeWidth="1" fill="none" />
          <polygon points="180,0 90,156 -90,156 -180,0 -90,-156 90,-156"
                   stroke="rgba(31,200,200,0.15)" strokeWidth="0.5" fill="none"
                   transform="rotate(30)" />
          {/* Vertex nodes */}
          {[[180,0],[90,156],[-90,156],[-180,0],[-90,-156],[90,-156]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="6" fill="#1fc8c8" opacity="0.9"/>
          ))}
        </g>
        {/* Middle ring */}
        <g className="spin-rev" opacity="0.85">
          <circle r="115" stroke="rgba(201,168,76,0.35)" strokeWidth="1" strokeDasharray="4 6" fill="none" />
          <circle cx="115" cy="0" r="5" fill="#c9a84c" />
          <circle cx="-81" cy="81" r="4" fill="#c9a84c" opacity="0.7" />
          <circle cx="0" cy="-115" r="4" fill="#c9a84c" opacity="0.7" />
          <circle cx="81" cy="81" r="3" fill="#c9a84c" opacity="0.6" />
        </g>
        {/* Inner ring */}
        <g className="spin-slow" opacity="0.95">
          <circle r="70" stroke="rgba(31,200,200,0.55)" strokeWidth="1" fill="none" />
          <circle cx="70" cy="0" r="4" fill="#3dd9d9" />
          <circle cx="-70" cy="0" r="4" fill="#3dd9d9" />
          <circle cx="0" cy="70" r="3" fill="#3dd9d9" opacity="0.8" />
          <circle cx="0" cy="-70" r="3" fill="#3dd9d9" opacity="0.8" />
        </g>
        {/* Center shield icon */}
        <g>
          <circle r="34" fill="rgba(2,6,15,0.85)" stroke="rgba(31,200,200,0.5)" strokeWidth="1"/>
          <path d="M0,-22 L18,-14 L18,4 C18,16 10,22 0,26 C-10,22 -18,16 -18,4 L-18,-14 Z"
                stroke="#1fc8c8" strokeWidth="1.6" fill="rgba(31,200,200,0.08)" />
          <path d="M-6,2 L-2,8 L8,-6" stroke="#1fc8c8" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
        {/* Crosshair ticks */}
        {[0,90,180,270].map((deg)=>(
          <line key={deg}
                x1="0" y1="-190" x2="0" y2="-176"
                stroke="rgba(31,200,200,0.6)" strokeWidth="2"
                transform={`rotate(${deg})`} />
        ))}
      </svg>
    </React.Fragment>
  );
}

/* ── About ─────────────────────────────────────────────────── */
function About() {
  const { identity, contact } = PORTFOLIO;
  return (
    <section id="about">
      <Reveal as="div" className="section-label">
        <span><span className="num">01</span> // about</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Engineering <span className="accent">trust</span> at every layer.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        A decade in the trenches of cybersecurity — from offensive research to production-grade
        secure software. Below is the operator profile.
      </Reveal>

      <div className="about-grid">
        <Reveal as="div" className="about-body">
          <p>{identity.bio}</p>
          <p>
            I'm a builder before I'm a breaker — every offensive engagement informs the defensive
            systems I help engineering teams ship. My work sits at the intersection of <strong>red
            teaming</strong>, <strong>secure-by-default architecture</strong>, and
            <strong> automated assurance</strong> in CI/CD.
          </p>
          <p>
            Outside engagements, I publish CVE research, maintain open-source tooling on the
            supply-chain integrity stack, and mentor junior engineers transitioning into security.
          </p>
        </Reveal>

        <Reveal as="aside" className="info-card">
          <div className="info-row">
            <div className="k">handle</div>
            <div className="v"><span className="accent">@</span>{identity.handle}</div>
          </div>
          <div className="info-row">
            <div className="k">role</div>
            <div className="v">{identity.title}</div>
          </div>
          <div className="info-row">
            <div className="k">location</div>
            <div className="v">{identity.location}</div>
          </div>
          <div className="info-row">
            <div className="k">experience</div>
            <div className="v">{identity.yearsExperience} years · 47+ engagements</div>
          </div>
          <div className="info-row">
            <div className="k">status</div>
            <div className="v"><span style={{color:'#27c93f'}}>● </span>{identity.status}</div>
          </div>
          <div className="info-row">
            <div className="k">stack</div>
            <div className="v">Python · Go · Rust · K8s · AWS · Terraform</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Skills ────────────────────────────────────────────────── */
function SkillCard({ s }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <div ref={ref} className="skill-card reveal">
      <div className="skill-card-head">
        <div className="skill-card-icon"><i className={`bi bi-${s.icon}`}></i></div>
        <div>
          <h4 className="skill-card-title">{s.title}</h4>
          <div className="skill-card-sub">{s.sub}</div>
        </div>
      </div>
      <div>
        {s.items.map((it) => (
          <div className="skill-item" key={it.name}>
            <div className="skill-item-head">
              <span>{it.name}</span>
              <span className="lvl">{it.level}</span>
            </div>
            <div className="skill-bar">
              <div className="skill-bar-fill" style={{ "--lvl": `${it.level}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="skill-tags" style={{ marginTop: 18 }}>
        {s.tags.map((t) => (<span className="skill-tag" key={t}>{t}</span>))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills">
      <Reveal as="div" className="section-label">
        <span><span className="num">02</span> // capabilities</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Stack & <span className="accent">arsenal</span>.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        The tools, frameworks, and disciplines that drive each engagement.
      </Reveal>

      <div className="skills-grid">
        {PORTFOLIO.skills.map((s) => (<SkillCard s={s} key={s.title} />))}
      </div>
    </section>
  );
}

/* ── Projects ──────────────────────────────────────────────── */
function Projects() {
  const [filter, setFilter] = useState("all");
  const categories = useMemo(() => {
    const cats = [
      { id: "all",       label: "all" },
      { id: "homelab",   label: "homelab" },
      { id: "offsec",    label: "offsec" },
      { id: "secdev",    label: "secdev" },
      { id: "devsecops", label: "devsecops" },
      { id: "cloud",     label: "cloud" },
      { id: "comms",     label: "comms" },
    ];
    return cats;
  }, []);

  return (
    <section id="projects">
      <Reveal as="div" className="section-label">
        <span><span className="num">03</span> // engagements</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Selected <span className="accent">work</span>.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        Production deployments, open-source projects, and disclosure research.
      </Reveal>

      <Reveal as="div" className="project-filters">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`filter-btn ${filter === c.id ? "active" : ""}`}
            onClick={() => setFilter(c.id)}
          >{c.label}</button>
        ))}
      </Reveal>

      <div className="projects-grid">
        {PORTFOLIO.projects.map((p) => {
          const hidden = filter !== "all" && p.category !== filter;
          return (
            <div
              key={p.name}
              className={`project-card reveal ${hidden ? "hidden" : ""}`}
              ref={(el) => { if (el && !el.dataset.obs) { el.dataset.obs = "1";
                const io = new IntersectionObserver((es) => {
                  es.forEach(e => { if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); } });
                }, { threshold: 0.15 });
                io.observe(el);
              } }}
            >
              <div className="project-meta">
                <span>{p.year} · {p.category}</span>
                <span className={`status ${p.status}`}>{p.status}</span>
              </div>
              <h3 className="project-title">{p.name}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="project-tags">
                {p.tags.map((t) => (<span className="skill-tag" key={t}>{t}</span>))}
              </div>
              <div className="project-links">
                {p.links.map((l) => (
                  <a key={l.label} href={l.href} className="project-link">
                    <i className="bi bi-arrow-up-right"></i> {l.label}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Achievements / Certifications ───────────────────────────── */
function Achievements() {
  return (
    <section id="achievements">
      <Reveal as="div" className="section-label">
        <span><span className="num">04</span> // credentials</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Achievements & <span className="accent">certifications</span>.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        Verified industry credentials and notable highlights from the field.
      </Reveal>

      <Reveal as="div" className="cert-grid reveal-stagger">
        {PORTFOLIO.certifications.map((c) => (
          <div className="cert" key={c.name}>
            <div className="cert-icon"><i className={`bi bi-${c.icon}`}></i></div>
            <div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-org">{c.org}</div>
              <div className="cert-year">Issued {c.year}</div>
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal as="div" style={{ marginTop: 48 }}>
        <h4 style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.24em',
          textTransform: 'uppercase', color: 'var(--color-teal-400)', marginBottom: 18
        }}>// notable highlights</h4>
        <ul style={{
          listStyle: 'none', padding: 0, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12
        }}>
          {PORTFOLIO.achievements.map((a) => (
            <li key={a} style={{
              fontFamily: 'var(--font-mono)', fontSize: 13.5,
              padding: '12px 14px', background: 'rgba(31,200,200,0.04)',
              border: '1px solid rgba(31,200,200,0.12)', borderRadius: 'var(--radius-sm)',
              color: 'var(--fg-secondary)'
            }}>
              <span style={{color:'var(--color-teal-400)', marginRight: 8}}>▸</span>{a}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ── Education + Courses ───────────────────────────────────── */
function Education() {
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState("");
  const filtered = PORTFOLIO.courses.filter((c) => {
    if (!q) return true;
    const t = (c.name + " " + c.platform).toLowerCase();
    return t.includes(q.toLowerCase());
  });

  return (
    <section id="education">
      <Reveal as="div" className="section-label">
        <span><span className="num">05</span> // education</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Educational <span className="accent">path</span>.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        Formal degrees, intensive trainings, and a continuously expanding catalogue of courses.
      </Reveal>

      <Reveal as="div" className="timeline">
        {PORTFOLIO.education.map((e, i) => (
          <div className={`tl-item ${e.kind}`} key={i}>
            <div className="tl-date">{e.date}</div>
            <h4 className="tl-title">{e.title}</h4>
            <div className="tl-org">{e.org}</div>
            <p className="tl-detail">{e.detail}</p>
          </div>
        ))}
      </Reveal>

      <Reveal as="div" className={`courses-wrap ${open ? "open" : ""}`}>
        <div className="courses-head" onClick={() => setOpen((v) => !v)}>
          <h3>// Courses Completed — Continuous Learning Log</h3>
          <span className="toggle">+</span>
        </div>
        {open && (
          <div className="courses-search">
            <i className="bi bi-search" style={{color:'var(--color-teal-400)'}}></i>
            <input
              placeholder="$ grep -i 'kubernetes|crypto|aws' courses.log"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="count">[ {filtered.length} / {PORTFOLIO.courses.length} ]</span>
          </div>
        )}
        <div className="courses-list">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course</th>
                <th className="col-platform">Platform</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name}>
                  <td className="course-name">{c.name}</td>
                  <td className="course-platform col-platform">{c.platform}</td>
                  <td>{c.year}</td>
                  <td>
                    <span className={`course-status ${c.status}`}>
                      {c.status === "done" ? "completed" : "in progress"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="4" style={{padding:'24px', textAlign:'center', color:'var(--fg-muted)'}}>
                  // no records match query
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [status, setStatus] = useState({ kind: "", text: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) {
      setStatus({ kind: "err", text: "$ ERROR: all fields required." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ kind: "err", text: "$ ERROR: invalid email signature." });
      return;
    }
    setStatus({ kind: "ok", text: "$ encrypted_packet sent — response within 24h." });
    setForm({ name: "", email: "", msg: "" });
  };

  return (
    <section id="contact">
      <Reveal as="div" className="section-label">
        <span><span className="num">06</span> // contact</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Initiate <span className="accent">secure</span> channel.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        For engagements, advisory work, or disclosure coordination — choose your channel.
        PGP-signed messages preferred.
      </Reveal>

      <div className="contact-wrap">
        <Reveal as="div" className="contact-card">
          {PORTFOLIO.contact.map((c) => (
            <div className="contact-row" key={c.label}>
              <div className="ico"><i className={`bi bi-${c.icon}`}></i></div>
              <div style={{flex:1}}>
                <div style={{fontSize:11, letterSpacing:'0.2em', color:'var(--fg-muted)', textTransform:'uppercase'}}>{c.label}</div>
                <a href={c.href} target="_blank" rel="noreferrer">{c.value}</a>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal as="form" className="contact-form contact-card" onSubmit={onSubmit}>
          <div className="form-row">
            <label>// handle</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="enter your handle" />
          </div>
          <div className="form-row">
            <label>// callback channel</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@domain.tld" />
          </div>
          <div className="form-row">
            <label>// payload</label>
            <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="brief on engagement scope..."></textarea>
          </div>
          <button className="btn btn-primary" type="submit">
            <i className="bi bi-send"></i> Transmit
          </button>
          <div className={`form-status ${status.kind}`}>{status.text}</div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <span className="accent">{PORTFOLIO.identity.handle}</span>@architsec:~$ uptime —
        © {new Date().getFullYear()} {PORTFOLIO.identity.name}. All systems nominal.
      </div>
      <div className="signoff">
        // built with paranoia &amp; precision · no trackers · no cookies
      </div>
    </footer>
  );
}

/* ── Matrix Rain ───────────────────────────────────────────── */
function MatrixRain({ enabled = true, density = 1, color = "#1fc8c8" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf = 0;
    let cols = 0;
    let drops = [];
    const chars = "01アイウエオカキクケコサシスセソタチツテト░▒▓<>{}#$%&*+-=01ABCDEF";

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      cols = Math.floor(c.width / 18);
      drops = new Array(cols).fill(0).map(() => Math.random() * -c.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const speed = 50 / density; // ms per frame
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (t - last < speed) return;
      last = t;
      ctx.fillStyle = "rgba(2, 6, 15, 0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = "14px 'Share Tech Mono', monospace";
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 18;
        const y = drops[i] * 18;
        ctx.fillStyle = Math.random() < 0.02 ? "#3dd9d9" : color;
        ctx.fillText(ch, x, y);
        if (y > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, density, color]);

  if (!enabled) return null;
  return <canvas id="matrix-canvas" ref={canvasRef}></canvas>;
}

/* ── Terminal Boot Sequence ──────────────────────────────────── */
function BootTerminal({ onDone, sequence }) {
  const [lines, setLines] = useState([]);
  const [showCaret, setShowCaret] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const bodyRef = useRef(null);
  const cancelRef = useRef(false);

  const handleDone = useCallback(() => {
    setDismissed(true);
    setTimeout(() => onDone && onDone(), 650);
  }, [onDone]);

  useEffect(() => {
    let i = 0;
    let buffer = [];
    const push = (line) => {
      buffer = [...buffer, line];
      setLines([...buffer]);
      requestAnimationFrame(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      });
    };

    const run = async () => {
      for (const step of sequence) {
        if (cancelRef.current) return;
        if (step.kind === "cmd") {
          // Type a command character-by-character
          const prefix = step.prompt || prompt();
          let typed = "";
          for (let k = 0; k <= step.text.length; k++) {
            if (cancelRef.current) return;
            typed = step.text.slice(0, k);
            buffer = buffer.slice(0, buffer.length); // no-op
            const ln = { kind: "cmd-typing", prefix, text: typed };
            // replace last 'cmd-typing' or push
            const last = buffer[buffer.length - 1];
            if (last && last.kind === "cmd-typing") buffer[buffer.length - 1] = ln;
            else buffer.push(ln);
            setLines([...buffer]);
            await wait(28);
          }
          // finalize
          buffer[buffer.length - 1] = { kind: "cmd", prefix, text: step.text };
          setLines([...buffer]);
          await wait(step.afterMs ?? 220);
        } else if (step.kind === "out") {
          push({ kind: "out", text: step.text, tone: step.tone });
          await wait(step.afterMs ?? 90);
        } else if (step.kind === "wait") {
          await wait(step.ms);
        } else if (step.kind === "progress") {
          const total = step.steps ?? 18;
          for (let k = 0; k <= total; k++) {
            if (cancelRef.current) return;
            const pct = Math.round((k / total) * 100);
            const filled = "█".repeat(k);
            const empty  = "░".repeat(total - k);
            const ln = { kind: "out", tone: "info", text: `${step.label} [${filled}${empty}] ${pct}%` };
            const last = buffer[buffer.length - 1];
            if (last && last.kind === "out" && last._progress === step.label) {
              buffer[buffer.length - 1] = { ...ln, _progress: step.label };
            } else {
              buffer.push({ ...ln, _progress: step.label });
            }
            setLines([...buffer]);
            await wait(45);
          }
        }
      }
      // final pause then exit
      await wait(600);
      if (!cancelRef.current) handleDone();
    };

    function prompt() {
      return null; // styled separately
    }

    run();
    return () => { cancelRef.current = true; };
  }, []);

  const renderPrompt = () => (
    <React.Fragment>
      <span className="prompt-user">{PORTFOLIO.identity.handle}</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">{PORTFOLIO.identity.host}</span>
      <span className="prompt-at">:</span>
      <span className="prompt-path">~</span>
      <span className="prompt-sym"> $ </span>
    </React.Fragment>
  );

  return (
    <div className={`boot-overlay ${dismissed ? "dismissed" : ""}`}>
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <span className="terminal-dots"><span></span><span></span><span></span></span>
          <span className="terminal-title">{PORTFOLIO.identity.handle}@{PORTFOLIO.identity.host}: secure-shell — 80×24</span>
          <span style={{fontFamily:'var(--font-mono)', fontSize: 11}}>● tls 1.3</span>
        </div>
        <div className="terminal-body" ref={bodyRef}>
          {lines.map((l, idx) => {
            if (l.kind === "cmd" || l.kind === "cmd-typing") {
              return (
                <div className="line" key={idx}>
                  {renderPrompt()}
                  <span className="cmd">{l.text}</span>
                  {l.kind === "cmd-typing" && <span className="caret" />}
                </div>
              );
            }
            return (
              <div className={`line ${l.tone || "info"}`} key={idx}>{l.text}</div>
            );
          })}
        </div>
      </div>
      <button className="boot-skip" onClick={handleDone}>[ skip → enter ]</button>
    </div>
  );
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ══════════════════════════════════════════════════════════════
   HomeLab — topology, hardware, services, pipeline, build log
   ══════════════════════════════════════════════════════════════ */

/* SVG helpers */
const HL_TEAL   = "rgba(31,200,200,";
const HL_GREEN  = "rgba(0,255,136,";
const HL_ORANGE = "rgba(255,107,53,";
const HL_YELLOW = "rgba(255,215,0,";
const HL_PINK   = "rgba(255,51,102,";
const HL_CYAN   = "rgba(0,255,204,";
const HL_SLATE  = "rgba(122,155,181,";

/* ── Physical Topology ──────────────────────────────────────── */
function HLPhysTopo() {
  return (
    <div className="hl-topo-wrap">
      <svg viewBox="0 0 960 430" className="hl-topo-svg">
        <defs>
          <marker id="pa" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={HL_TEAL+"0.55)"}/>
          </marker>
          <marker id="pa2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={HL_TEAL+"0.22)"}/>
          </marker>
          <filter id="pg">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0L0 0 0 40" fill="none" stroke={HL_TEAL+"0.035)"} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="960" height="430" fill="#050910"/>
        <rect width="960" height="430" fill="url(#pgrid)"/>

        {/* Internet */}
        <rect x="330" y="12" width="300" height="30" rx="4" fill={HL_ORANGE+"0.07)"} stroke={HL_ORANGE+"0.3)"} strokeWidth="1"/>
        <text x="480" y="32" fill={HL_ORANGE+"0.85)"} fontSize="10" textAnchor="middle" fontFamily="'Share Tech Mono'" letterSpacing="3">INTERNET</text>

        {/* Cloudflare */}
        <rect x="140" y="54" width="680" height="26" rx="4" fill={HL_ORANGE+"0.04)"} stroke={HL_ORANGE+"0.16)"} strokeWidth="1" strokeDasharray="4,3"/>
        <text x="480" y="71" fill={HL_ORANGE+"0.55)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" letterSpacing="2">CLOUDFLARE ZERO TRUST — tunnels: git · chat · portal · auth</text>
        <line x1="480" y1="42" x2="480" y2="54" stroke={HL_ORANGE+"0.25)"} strokeWidth="1"/>

        {/* OCI VPS — top right */}
        <rect x="780" y="54" width="166" height="52" rx="6" fill={HL_PINK+"0.06)"} stroke={HL_PINK+"0.25)"} strokeWidth="1" strokeDasharray="4,3"/>
        <text x="863" y="74" fill={HL_PINK+"0.8)"} fontSize="9" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">OCI CLOUD VPS</text>
        <text x="863" y="87" fill={HL_PINK+"0.55)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">WireGuard Relay · Oracle Free</text>
        <text x="863" y="98" fill={HL_PINK+"0.4)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">CGNAT bypass · us-sanjose-1</text>

        {/* WG tunnel dashed line to edge1 */}
        <path d="M 780 80 Q 660 80 620 116" fill="none" stroke={HL_SLATE+"0.25)"} strokeWidth="1" strokeDasharray="5,3"/>
        <text x="704" y="74" fill={HL_SLATE+"0.45)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontStyle="italic">WireGuard tunnel</text>

        {/* FreshTomato */}
        <rect x="355" y="104" width="250" height="48" rx="6" fill={HL_TEAL+"0.07)"} stroke={HL_TEAL+"0.35)"} strokeWidth="1" filter="url(#pg)"/>
        <text x="480" y="122" fill={HL_TEAL+"0.92)"} fontSize="10.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold" letterSpacing="1">EDGE1 — FRESHTOMATO</text>
        <text x="480" y="136" fill={HL_TEAL+"0.58)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Netgear R6700v3 · FreshTomato 2026.1 · WireGuard · NAT · Firewall</text>
        <line x1="480" y1="80" x2="480" y2="104" stroke={HL_TEAL+"0.3)"} strokeWidth="1.5" markerEnd="url(#pa)"/>

        {/* Cisco 3560 */}
        <rect x="340" y="178" width="280" height="48" rx="6" fill={HL_TEAL+"0.06)"} stroke={HL_TEAL+"0.28)"} strokeWidth="1" filter="url(#pg)"/>
        <text x="480" y="197" fill={HL_TEAL+"0.88)"} fontSize="10.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold" letterSpacing="1">SWR1 — CISCO 3560-24P</text>
        <text x="480" y="211" fill={HL_TEAL+"0.52)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Layer 3 Core · IOS 15.0(2)SE11 · 8 VLANs · STP Root · DHCP Helper</text>
        <line x1="480" y1="152" x2="480" y2="178" stroke={HL_TEAL+"0.32)"} strokeWidth="1.5" markerEnd="url(#pa)"/>

        {/* DC1 */}
        <line x1="420" y1="226" x2="120" y2="286" stroke={HL_GREEN+"0.2)"} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#pa2)"/>
        <rect x="20" y="286" width="200" height="80" rx="6" fill={HL_GREEN+"0.05)"} stroke={HL_GREEN+"0.22)"} strokeWidth="1"/>
        <text x="120" y="306" fill={HL_GREEN+"0.88)"} fontSize="10" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">DC1 — DELL R420</text>
        <text x="120" y="320" fill={HL_GREEN+"0.62)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Win Server 2019</text>
        <text x="120" y="334" fill={HL_GREEN+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">PDC · DNS · DHCP · KDC</text>
        <text x="120" y="348" fill={HL_GREEN+"0.45)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">All 5 FSMO Roles</text>
        <text x="120" y="360" fill={HL_GREEN+"0.35)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">VLAN 20 · INFRA</text>

        {/* DC3 */}
        <line x1="445" y1="226" x2="315" y2="286" stroke={HL_GREEN+"0.15)"} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#pa2)"/>
        <rect x="240" y="286" width="160" height="80" rx="6" fill={HL_GREEN+"0.04)"} stroke={HL_GREEN+"0.17)"} strokeWidth="1"/>
        <text x="320" y="306" fill={HL_GREEN+"0.8)"} fontSize="9.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">DC3 — IBM X3250 M4</text>
        <text x="320" y="320" fill={HL_GREEN+"0.58)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Win Server 2022</text>
        <text x="320" y="334" fill={HL_GREEN+"0.48)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Backup DC · DNS · KDC</text>
        <text x="320" y="348" fill={HL_GREEN+"0.38)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">AD Replication: 5/5 ✓</text>
        <text x="320" y="360" fill={HL_GREEN+"0.3)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">VLAN 20 · INFRA</text>

        {/* Proxmox */}
        <line x1="480" y1="226" x2="480" y2="286" stroke={HL_TEAL+"0.38)"} strokeWidth="2" markerEnd="url(#pa)"/>
        <rect x="415" y="286" width="130" height="110" rx="6" fill={HL_TEAL+"0.06)"} stroke={HL_TEAL+"0.32)"} strokeWidth="1" filter="url(#pg)"/>
        <text x="480" y="306" fill={HL_TEAL+"0.92)"} fontSize="9.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">PROX — DELL R630</text>
        <text x="480" y="320" fill={HL_TEAL+"0.68)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Proxmox VE 9.1.4</text>
        <text x="480" y="333" fill={HL_TEAL+"0.55)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">40 vCPU · 125 GB RAM</text>
        <text x="480" y="346" fill={HL_TEAL+"0.48)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">8 VMs · 8 LXCs</text>
        <text x="480" y="359" fill={HL_CYAN+"0.62)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">K3s 3-node cluster</text>
        <text x="480" y="372" fill={HL_TEAL+"0.32)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">VLAN 30 · trunk →40/50/60</text>

        {/* IoT/OOB */}
        <line x1="530" y1="226" x2="700" y2="286" stroke={HL_PINK+"0.17)"} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#pa2)"/>
        <rect x="640" y="286" width="180" height="80" rx="6" fill={HL_PINK+"0.04)"} stroke={HL_PINK+"0.18)"} strokeWidth="1"/>
        <text x="730" y="306" fill={HL_PINK+"0.78)"} fontSize="9.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">IoT / OOB MGMT</text>
        <text x="730" y="320" fill={HL_PINK+"0.52)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">VLAN 70 · VLAN 99</text>
        <text x="730" y="334" fill={HL_PINK+"0.42)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">IP Camera · iDRAC OOB</text>
        <text x="730" y="348" fill={HL_PINK+"0.35)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">ACL isolated from LAN</text>

        {/* Legend */}
        <rect x="20" y="385" width="680" height="36" rx="4" fill="rgba(0,0,0,0.35)" stroke={HL_TEAL+"0.08)"} strokeWidth="1"/>
        <text x="36" y="399" fill={HL_SLATE+"0.55)"} fontSize="7.5" fontFamily="'Share Tech Mono'" letterSpacing="2">LEGEND</text>
        <rect x="100" y="392" width="10" height="8" rx="1" fill={HL_GREEN+"0.12)"} stroke={HL_GREEN+"0.35)"}/>
        <text x="116" y="399" fill={HL_SLATE+"0.6)"} fontSize="7.5" fontFamily="'Share Tech Mono'">Infra / Active Directory</text>
        <rect x="275" y="392" width="10" height="8" rx="1" fill={HL_TEAL+"0.12)"} stroke={HL_TEAL+"0.35)"}/>
        <text x="291" y="399" fill={HL_SLATE+"0.6)"} fontSize="7.5" fontFamily="'Share Tech Mono'">Network / Hypervisor</text>
        <rect x="440" y="392" width="10" height="8" rx="1" fill={HL_PINK+"0.1)"} stroke={HL_PINK+"0.28)"}/>
        <text x="456" y="399" fill={HL_SLATE+"0.6)"} fontSize="7.5" fontFamily="'Share Tech Mono'">IoT / OCI Cloud / OOB</text>
        <text x="36" y="414" fill={HL_SLATE+"0.38)"} fontSize="7.5" fontFamily="'Share Tech Mono'">── solid = primary link  - - - = segmented / tunnel path</text>
      </svg>
    </div>
  );
}

/* ── Logical / VLAN Topology ────────────────────────────────── */
function HLLogicTopo() {
  const vlans = [
    { id:"1",  name:"LEGACY",    subnet:"172.16.0.0/24",  col:HL_SLATE,  note:"phasing out" },
    { id:"10", name:"MGMT",      subnet:"172.16.10.0/24", col:HL_TEAL,   note:"switch mgmt" },
    { id:"20", name:"INFRA",     subnet:"172.16.20.0/24", col:HL_GREEN,  note:"domain controllers" },
    { id:"30", name:"PROXMOX",   subnet:"172.16.30.0/24", col:HL_TEAL,   note:"hypervisor" },
    { id:"40", name:"VM-PROD",   subnet:"172.16.40.0/24", col:HL_ORANGE, note:"VMs · K3s cluster" },
    { id:"50", name:"CONTAINERS",subnet:"172.16.50.0/24", col:HL_CYAN,   note:"LXC containers" },
    { id:"60", name:"DMZ",       subnet:"172.16.60.0/24", col:HL_YELLOW, note:"security services" },
    { id:"70", name:"IoT",       subnet:"172.16.70.0/24", col:HL_PINK,   note:"isolated · ACL deny" },
    { id:"99", name:"OOB-MGMT",  subnet:"172.16.99.0/24", col:HL_SLATE,  note:"iDRAC out-of-band" },
  ];

  return (
    <div className="hl-topo-wrap">
      <svg viewBox="0 0 1120 560" className="hl-topo-svg">
        <defs>
          <marker id="la" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={HL_TEAL+"0.45)"}/>
          </marker>
          <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0L0 0 0 40" fill="none" stroke={HL_TEAL+"0.03)"} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="1120" height="560" fill="#050910"/>
        <rect width="1120" height="560" fill="url(#lgrid)"/>

        {/* Internet + Cloudflare */}
        <rect x="380" y="10" width="280" height="28" rx="4" fill={HL_ORANGE+"0.07)"} stroke={HL_ORANGE+"0.28)"} strokeWidth="1"/>
        <text x="520" y="29" fill={HL_ORANGE+"0.82)"} fontSize="10" textAnchor="middle" fontFamily="'Share Tech Mono'" letterSpacing="3">INTERNET</text>
        <rect x="160" y="50" width="720" height="24" rx="4" fill={HL_ORANGE+"0.04)"} stroke={HL_ORANGE+"0.14)"} strokeWidth="1" strokeDasharray="4,3"/>
        <text x="520" y="66" fill={HL_ORANGE+"0.52)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'" letterSpacing="2">CLOUDFLARE ZERO TRUST — git · chat · portal · auth (zero-config public tunnels)</text>
        <line x1="520" y1="38" x2="520" y2="50" stroke={HL_ORANGE+"0.22)"} strokeWidth="1"/>

        {/* OCI relay */}
        <rect x="920" y="50" width="184" height="24" rx="4" fill={HL_PINK+"0.06)"} stroke={HL_PINK+"0.22)"} strokeWidth="1" strokeDasharray="3,3"/>
        <text x="1012" y="66" fill={HL_PINK+"0.68)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">OCI VPS · WireGuard Relay</text>

        {/* Edge router */}
        <rect x="380" y="88" width="280" height="38" rx="6" fill={HL_TEAL+"0.07)"} stroke={HL_TEAL+"0.32)"} strokeWidth="1"/>
        <text x="520" y="106" fill={HL_TEAL+"0.9)"} fontSize="10" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">EDGE1 · FRESHTOMATO</text>
        <text x="520" y="119" fill={HL_TEAL+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.0.1 · NAT · WireGuard server · DDNS · Firewall</text>
        <line x1="520" y1="74" x2="520" y2="88" stroke={HL_ORANGE+"0.25)"} strokeWidth="1"/>
        <path d="M 920 62 Q 800 70 660 107" fill="none" stroke={HL_PINK+"0.22)"} strokeWidth="1" strokeDasharray="4,3"/>

        {/* Core switch */}
        <rect x="360" y="150" width="320" height="38" rx="6" fill={HL_TEAL+"0.06)"} stroke={HL_TEAL+"0.26)"} strokeWidth="1"/>
        <text x="520" y="168" fill={HL_TEAL+"0.85)"} fontSize="10" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">SWR1 · CISCO 3560-24P · L3 CORE</text>
        <text x="520" y="181" fill={HL_TEAL+"0.48)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.0.4 · Rapid-PVST STP Root · 24 ports · DHCP helper · ACLs</text>
        <line x1="520" y1="126" x2="520" y2="150" stroke={HL_TEAL+"0.32)"} strokeWidth="1.5" markerEnd="url(#la)"/>

        {/* ── VLAN zones ── */}
        {/* VLAN 20 INFRA */}
        <line x1="435" y1="188" x2="105" y2="226" stroke={HL_GREEN+"0.18)"} strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#la)"/>
        <rect x="10" y="226" width="190" height="110" rx="6" fill={HL_GREEN+"0.04)"} stroke={HL_GREEN+"0.2)"} strokeWidth="1"/>
        <text x="105" y="244" fill={HL_GREEN+"0.82)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">VLAN 20 · INFRA</text>
        <text x="105" y="257" fill={HL_GREEN+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.20.0/24</text>
        <text x="105" y="272" fill={HL_GREEN+"0.64)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">DC1 · Dell R420</text>
        <text x="105" y="285" fill={HL_GREEN+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">PDC · DNS · DHCP · KDC</text>
        <text x="105" y="298" fill={HL_GREEN+"0.44)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">DC3 · IBM X3250 M4</text>
        <text x="105" y="311" fill={HL_GREEN+"0.38)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">Backup DC · 5/5 partitions ✓</text>
        <text x="105" y="327" fill={HL_GREEN+"0.3)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">VLAN 20</text>

        {/* VLAN 30 PROXMOX */}
        <line x1="470" y1="188" x2="305" y2="226" stroke={HL_TEAL+"0.22)"} strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#la)"/>
        <rect x="215" y="226" width="180" height="90" rx="6" fill={HL_TEAL+"0.05)"} stroke={HL_TEAL+"0.2)"} strokeWidth="1"/>
        <text x="305" y="244" fill={HL_TEAL+"0.82)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">VLAN 30 · PROXMOX</text>
        <text x="305" y="257" fill={HL_TEAL+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.30.0/24</text>
        <text x="305" y="272" fill={HL_TEAL+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Dell R630 · PVE 9.1.4</text>
        <text x="305" y="285" fill={HL_TEAL+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">40 vCPU · 125 GB RAM</text>
        <text x="305" y="298" fill={HL_TEAL+"0.4)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">Trunk: VLANs 1,40,50,60,70,99</text>
        <text x="305" y="309" fill={HL_TEAL+"0.3)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">8 VMs · 8 LXCs hosted</text>

        {/* VLAN 40 VM-PROD */}
        <line x1="510" y1="188" x2="510" y2="226" stroke={HL_ORANGE+"0.22)"} strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#la)"/>
        <rect x="415" y="226" width="195" height="110" rx="6" fill={HL_ORANGE+"0.04)"} stroke={HL_ORANGE+"0.18)"} strokeWidth="1"/>
        <text x="512" y="244" fill={HL_ORANGE+"0.82)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">VLAN 40 · VM-PROD</text>
        <text x="512" y="257" fill={HL_ORANGE+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.40.0/24</text>
        <text x="512" y="272" fill={HL_ORANGE+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">GitLab · Mattermost</text>
        <text x="512" y="285" fill={HL_ORANGE+"0.58)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Wazuh SIEM · RD Gateway</text>
        <text x="512" y="298" fill={HL_CYAN+"0.62)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">K3s ctrl · w1 · w2</text>
        <text x="512" y="311" fill={HL_CYAN+"0.48)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">NATS JetStream 3-pod</text>
        <text x="512" y="327" fill={HL_ORANGE+"0.3)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">8 VMs (VMID 105–213)</text>

        {/* VLAN 60 DMZ */}
        <line x1="570" y1="188" x2="750" y2="226" stroke={HL_YELLOW+"0.18)"} strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#la)"/>
        <rect x="625" y="226" width="200" height="110" rx="6" fill={HL_YELLOW+"0.03)"} stroke={HL_YELLOW+"0.17)"} strokeWidth="1"/>
        <text x="725" y="244" fill={HL_YELLOW+"0.82)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">VLAN 60 · DMZ</text>
        <text x="725" y="257" fill={HL_YELLOW+"0.5)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.60.0/24</text>
        <text x="725" y="272" fill={HL_YELLOW+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'">Keycloak SSO · Vault</text>
        <text x="725" y="285" fill={HL_YELLOW+"0.58)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Harbor · Nexus OSS</text>
        <text x="725" y="298" fill={HL_YELLOW+"0.55)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Guacamole · Portal</text>
        <text x="725" y="311" fill={HL_YELLOW+"0.45)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">PostgreSQL · WG LXC</text>
        <text x="725" y="327" fill={HL_YELLOW+"0.3)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">ACL: DMZ→INFRA DENY</text>

        {/* VLAN 70/99 IoT/OOB */}
        <line x1="605" y1="188" x2="930" y2="226" stroke={HL_PINK+"0.15)"} strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#la)"/>
        <rect x="843" y="226" width="180" height="90" rx="6" fill={HL_PINK+"0.03)"} stroke={HL_PINK+"0.16)"} strokeWidth="1"/>
        <text x="933" y="244" fill={HL_PINK+"0.75)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">VLAN 70 + 99</text>
        <text x="933" y="257" fill={HL_PINK+"0.48)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">IoT · OOB-MGMT</text>
        <text x="933" y="272" fill={HL_PINK+"0.42)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.70.0/24 (IoT)</text>
        <text x="933" y="285" fill={HL_PINK+"0.38)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">172.16.99.0/24 (iDRAC)</text>
        <text x="933" y="298" fill={HL_PINK+"0.32)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">Camera · iDRAC OOB</text>
        <text x="933" y="309" fill={HL_PINK+"0.28)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">ACL: IoT→LAN DENY</text>

        {/* K3s cluster detail */}
        <rect x="415" y="360" width="195" height="88" rx="6" fill={HL_CYAN+"0.04)"} stroke={HL_CYAN+"0.18)"} strokeWidth="1"/>
        <text x="512" y="377" fill={HL_CYAN+"0.82)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">K3s CLUSTER</text>
        <text x="467" y="394" fill={HL_CYAN+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">ctrl</text>
        <text x="467" y="406" fill={HL_CYAN+"0.48)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">.30 · 4vCPU 8G</text>
        <text x="512" y="394" fill={HL_CYAN+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">w1</text>
        <text x="512" y="406" fill={HL_CYAN+"0.48)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">.31 · 2vCPU 20G</text>
        <text x="557" y="394" fill={HL_CYAN+"0.65)"} fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">w2</text>
        <text x="557" y="406" fill={HL_CYAN+"0.48)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">.32 · 2vCPU 20G</text>
        <text x="512" y="422" fill={HL_CYAN+"0.35)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">k3s v1.35.4 · containerd · GitLab Runner</text>
        <text x="512" y="434" fill={HL_CYAN+"0.28)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">NATS JetStream · redline namespace</text>
        <line x1="512" y1="336" x2="512" y2="360" stroke={HL_CYAN+"0.18)"} strokeWidth="1" strokeDasharray="3,3"/>

        {/* VPN zone */}
        <rect x="10" y="360" width="190" height="90" rx="6" fill={HL_SLATE+"0.04)"} stroke={HL_SLATE+"0.16)"} strokeWidth="1"/>
        <text x="105" y="378" fill={HL_SLATE+"0.72)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">WIREGUARD VPN</text>
        <text x="105" y="393" fill={HL_SLATE+"0.55)"} fontSize="7.5" textAnchor="middle" fontFamily="'Share Tech Mono'">Multi-hop: Client → OCI → edge1</text>
        <text x="105" y="406" fill={HL_SLATE+"0.48)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">AllowedIPs: 172.16.0.0/16</text>
        <text x="105" y="419" fill={HL_SLATE+"0.42)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">DNS: DC1 · DC3 (corp domain)</text>
        <text x="105" y="432" fill={HL_SLATE+"0.35)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">RTT: ~95–110ms (CGNAT bypass)</text>
        <text x="105" y="445" fill={HL_SLATE+"0.28)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">Parrot client: 10.20.0.0/24</text>

        {/* VLAN table */}
        <rect x="628" y="360" width="480" height="188" rx="6" fill="rgba(8,12,18,0.75)" stroke={HL_TEAL+"0.12)"} strokeWidth="1"/>
        <text x="868" y="380" fill={HL_TEAL+"0.65)"} fontSize="8.5" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold" letterSpacing="2">VLAN REFERENCE</text>
        <line x1="640" y1="386" x2="1098" y2="386" stroke={HL_TEAL+"0.1)"} strokeWidth="0.5"/>
        <text x="648" y="397" fill={HL_TEAL+"0.45)"} fontSize="7.5" fontFamily="'Share Tech Mono'" fontWeight="bold">ID</text>
        <text x="675" y="397" fill={HL_TEAL+"0.45)"} fontSize="7.5" fontFamily="'Share Tech Mono'" fontWeight="bold">NAME</text>
        <text x="785" y="397" fill={HL_TEAL+"0.45)"} fontSize="7.5" fontFamily="'Share Tech Mono'" fontWeight="bold">SUBNET</text>
        <text x="920" y="397" fill={HL_TEAL+"0.45)"} fontSize="7.5" fontFamily="'Share Tech Mono'" fontWeight="bold">PURPOSE</text>
        {vlans.map((v, i) => (
          <g key={v.id}>
            <text x="652" y={415+i*17} fill={v.col+"0.65)"} fontSize="7.5" fontFamily="'Share Tech Mono'">{v.id}</text>
            <rect x="672" y={406+i*17} width="48" height="11" rx="2" fill={v.col+"0.08)"} stroke={v.col+"0.22)"} strokeWidth="0.7"/>
            <text x="696" y={415+i*17} fill={v.col+"0.78)"} fontSize="7" textAnchor="middle" fontFamily="'Share Tech Mono'">{v.name}</text>
            <text x="728" y={415+i*17} fill={HL_SLATE+"0.6)"} fontSize="7.5" fontFamily="'Share Tech Mono'">{v.subnet}</text>
            <text x="920" y={415+i*17} fill={HL_SLATE+"0.48)"} fontSize="7" fontFamily="'Share Tech Mono'">{v.note}</text>
          </g>
        ))}
        <text x="648" y="542" fill={HL_SLATE+"0.35)"} fontSize="7" fontFamily="'Share Tech Mono'">Firewall ACLs: IoT→LAN DENY · DMZ→INFRA DENY · OOB unrestricted</text>

        {/* Watermark */}
        <text x="560" y="548" fill={HL_TEAL+"0.06)"} fontSize="46" textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold" letterSpacing="8">ARCHITSEC</text>
      </svg>
    </div>
  );
}

/* ── Hardware Panel ─────────────────────────────────────────── */
function HLHardware() {
  const hw = [
    {
      icon: "🌐", title: "edge1 — FreshTomato", sub: "Netgear Nighthawk R6700v3",
      col: HL_TEAL, items: [
        { k: "OS",       v: "FreshTomato 2026.1" },
        { k: "LAN",      v: "172.16.0.1",     t: "teal" },
        { k: "VLAN1",    v: "172.16.0.1 (VLAN 1 GW)" },
        { k: "WAN",      v: "CGNAT (ISP)" },
        { k: "Role",     v: "Edge router · NAT · WireGuard server · DDNS · Firewall" },
        { k: "WG iface", v: "wg0 · 10.10.0.1/24" },
      ]
    },
    {
      icon: "🔀", title: "swr1 — Cisco 3560-24P", sub: "Catalyst 3560 PoE",
      col: HL_TEAL, items: [
        { k: "IOS",     v: "15.0(2)SE11" },
        { k: "VLAN1 IP",v: "172.16.0.4",      t: "teal" },
        { k: "MGMT IP", v: "172.16.10.1 (SVI)", t: "teal" },
        { k: "STP",     v: "Rapid-PVST · priority 4096" },
        { k: "SDM",     v: "desktop default (L3 enabled)" },
        { k: "Role",     v: "L3 Core Switch · 9 VLANs · DHCP helper · ACLs" },
      ]
    },
    {
      icon: "⚡", title: "prox — Dell R630", sub: "Proxmox VE 9.1.4",
      col: HL_TEAL, items: [
        { k: "IP",      v: "172.16.30.25 (VLAN 30)", t: "teal" },
        { k: "CPU",     v: "40 cores" },
        { k: "RAM",     v: "125 GB" },
        { k: "Storage", v: "BaseStore 916 GB + local-lvm 141 GB" },
        { k: "NIC",     v: "vmbr0 (trunk Gi0/20) + vmbr1 (VLAN30 Gi0/23)" },
        { k: "Workload",v: "8 VMs · 8 LXCs · K3s 3-node cluster" },
      ]
    },
    {
      icon: "🖥️", title: "DC1 — Dell PowerEdge R420", sub: "Primary Domain Controller",
      col: HL_GREEN, items: [
        { k: "OS",    v: "Windows Server 2019" },
        { k: "IP",    v: "172.16.20.8 (VLAN 20)", t: "teal" },
        { k: "Roles", v: "PDC · DNS · DHCP · KDC · ADWS · Netlogon" },
        { k: "FSMO",  v: "All 5 FSMO roles" },
        { k: "iDRAC", v: "VLAN 99 (OOB)" },
        { k: "Port",  v: "Gi0/6 (VLAN 20)" },
      ]
    },
    {
      icon: "🖥️", title: "DC3 — IBM X3250 M4", sub: "Backup Domain Controller",
      col: HL_GREEN, items: [
        { k: "OS",    v: "Windows Server 2022" },
        { k: "IP",    v: "172.16.20.5 (VLAN 20)", t: "teal" },
        { k: "Roles", v: "Backup DC · DNS · KDC · Netlogon" },
        { k: "AD Repl",v: "5/5 partitions ✓",     t: "green" },
        { k: "Port",  v: "Gi0/11 (VLAN 20)" },
        { k: "Note",  v: "Repaired after 1,029 failures" },
      ]
    },
    {
      icon: "☁️", title: "OCI VPS — WireGuard Relay", sub: "Oracle Cloud Always Free",
      col: HL_PINK, items: [
        { k: "Provider", v: "Oracle Cloud Infrastructure" },
        { k: "Region",   v: "us-sanjose-1" },
        { k: "OS",       v: "Ubuntu 22.04 LTS" },
        { k: "Role",     v: "WireGuard relay · CGNAT bypass" },
        { k: "Tunnel IP",v: "10.20.0.1/24 (wg0)" },
        { k: "Compartment",v: "architsec-devops" },
      ]
    },
  ];

  return (
    <Reveal as="div" className="hl-hw-grid">
      {hw.map(h => (
        <div className="hl-card" key={h.title}>
          <div className="hl-card-head">
            <div className="hl-card-icon" style={{ background: h.col+"0.12)", border: `1px solid ${h.col}0.28)` }}>
              {h.icon}
            </div>
            <div>
              <div className="hl-card-title">{h.title}</div>
              <div className="hl-card-sub">{h.sub}</div>
            </div>
          </div>
          {h.items.map(it => (
            <div className="hl-kv" key={it.k}>
              <span className="hl-kv-k">{it.k}</span>
              <span className={`hl-kv-v${it.t ? " " + it.t : ""}`}>{it.v}</span>
            </div>
          ))}
        </div>
      ))}
    </Reveal>
  );
}

/* ── Services Panel ─────────────────────────────────────────── */
function HLServices() {
  const tiers = [
    {
      label: "// networking",
      services: [
        { icon: "🌐", name: "FreshTomato",    role: "Edge router · NAT · WireGuard server · DDNS · Firewall rules",        badges: [["running","green"],["WireGuard","teal"],["DDNS","blue"]] },
        { icon: "🔀", name: "Cisco 3560-24P", role: "Layer 3 core switch · 9 VLANs · Rapid-PVST STP root · DHCP relay",    badges: [["running","green"],["L3 Switch","teal"],["PoE","blue"]] },
        { icon: "🔒", name: "WireGuard VPN",  role: "Multi-hop tunnel via OCI VPS relay — CGNAT bypass to homelab LAN",     badges: [["active","green"],["OCI relay","orange"],["UDP 51820","blue"]] },
        { icon: "🌩️", name: "Cloudflare Tunnel","role": "Zero-trust tunnels — exposes git, chat, portal, auth publicly without open ports", badges: [["running","green"],["Zero Trust","orange"],["4 tunnels","blue"]] },
      ]
    },
    {
      label: "// identity & auth",
      services: [
        { icon: "🏛️", name: "Active Directory", role: "corp.architsec.com domain · DC1 (PDC, all FSMO) + DC3 (Backup DC) · Proxmox AD realm", badges: [["running","green"],["FSMO ×5","teal"],["Kerberos","blue"]] },
        { icon: "🔑", name: "Keycloak SSO",     role: "OpenID Connect SSO for Cloudflare Access · architsec realm · OIDC provider for portal", badges: [["running","green"],["OIDC","teal"],["LXC 202","blue"]] },
        { icon: "🛡️", name: "HashiCorp Vault",  role: "KV v2 secrets · PKI engine · audit logging · NATS credentials · redline/ path mount", badges: [["running","green"],["KV v2","teal"],["PKI","purple"],["LXC 203","blue"]] },
        { icon: "🖥️", name: "Guacamole",        role: "Browser-based remote desktop (RDP/SSH/VNC) — DMZ-hosted, VPN-protected", badges: [["running","green"],["HTML5","orange"],["LXC 201","blue"]] },
      ]
    },
    {
      label: "// security stack",
      services: [
        { icon: "👁️", name: "Wazuh SIEM",    role: "Wazuh Manager + OpenSearch Dashboard · log ingestion, file integrity monitoring, threat detection", badges: [["running","green"],["XDR","orange"],["VM 210","blue"]] },
        { icon: "🛂", name: "RD Gateway",    role: "Windows Server 2022 Remote Desktop Gateway — secure RDP broker for Windows systems", badges: [["running","green"],["RDP","teal"],["VM 105","blue"]] },
      ]
    },
    {
      label: "// devops platform",
      services: [
        { icon: "🦊", name: "GitLab",       role: "Self-hosted SCM · GitLab CI/CD · GitHub mirror · AD SSO · Cloudflare tunnel", badges: [["running","green"],["CI/CD","teal"],["VM 109","blue"]] },
        { icon: "⚓", name: "Harbor",       role: "Private container registry · image vulnerability scanning · K3s registry mirror", badges: [["running","green"],["OCI registry","teal"],["LXC 207","blue"]] },
        { icon: "📦", name: "Nexus OSS",    role: "Artifact repository — Maven, npm, raw artifact proxy and hosted repos", badges: [["running","green"],["Maven","orange"],["LXC 206","blue"]] },
        { icon: "💬", name: "Mattermost",   role: "Self-hosted team chat — AD SSO integration · Cloudflare tunnel for public access", badges: [["running","green"],["LDAP SSO","teal"],["VM 108","blue"]] },
        { icon: "🐘", name: "PostgreSQL",   role: "Shared database backend for Keycloak, Mattermost, and Portal", badges: [["running","green"],["PostgreSQL 15","teal"],["LXC 204","blue"]] },
        { icon: "🚀", name: "REDLINE Portal","role": "Internal developer portal — service catalog, run-book, NATS status dashboard", badges: [["running","green"],["Node.js","orange"],["LXC 208","blue"]] },
      ]
    },
    {
      label: "// kubernetes platform",
      services: [
        { icon: "☸️", name: "K3s Control Plane", role: "k3s-ctrl · 4 vCPU, 8 GB · control-plane · GitLab Runner registered · K3s v1.35.4", badges: [["running","green"],["K3s ctrl","teal"],["VM 211","blue"]] },
        { icon: "☸️", name: "K3s Worker 1",      role: "k3s-w1 · 2 vCPU, 20 GB · nats-0 pod · 102 GB disk",                                     badges: [["running","green"],["K3s worker","teal"],["VM 212","blue"]] },
        { icon: "☸️", name: "K3s Worker 2",      role: "k3s-w2 · 2 vCPU, 20 GB · nats-1 pod · 102 GB disk",                                     badges: [["running","green"],["K3s worker","teal"],["VM 213","blue"]] },
        { icon: "📡", name: "NATS JetStream",    role: "3-pod StatefulSet · redline-nats cluster · 10 Gi PVC per pod · NodePort 30222 monitor", badges: [["running","green"],["JetStream","cyan"],["3 replicas","blue"]] },
      ]
    },
    {
      label: "// standby / superseded",
      services: [
        { icon: "🔥", name: "pfSense VM",       role: "Spare firewall VM (VMID 104) — standby, not in active path", badges: [["standby","standby"]] },
        { icon: "🔒", name: "WireGuard LXC 200","role": "Original WG LXC — superseded by FreshTomato native WireGuard server",                   badges: [["superseded","standby"]] },
      ]
    },
  ];

  const badgeClass = { green:"hl-b-green", teal:"hl-b-teal", blue:"hl-b-teal", orange:"hl-b-orange", yellow:"hl-b-yellow", purple:"hl-b-purple", cyan:"hl-b-teal", standby:"hl-b-standby" };

  return (
    <div className="hl-svc-tiers">
      {tiers.map(tier => (
        <Reveal key={tier.label} as="div">
          <div className="hl-tier-label">{tier.label}</div>
          <div className="hl-svc-grid">
            {tier.services.map(svc => (
              <div className="hl-svc-card" key={svc.name}>
                <div className="hl-svc-head">
                  <span className="hl-svc-icon">{svc.icon}</span>
                  <span className="hl-svc-name">{svc.name}</span>
                </div>
                <p className="hl-svc-role">{svc.role}</p>
                <div className="hl-badges">
                  {svc.badges.map(([label, color]) => (
                    <span key={label} className={`hl-badge ${badgeClass[color] || "hl-b-teal"}`}>{label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── Pipeline Panel ─────────────────────────────────────────── */
function HLPipeline() {
  const stages = [
    { label: "SOURCE",   name: "GitHub",      note: "anxzik / CEOAAP",          col: HL_PINK   },
    { label: "SCM",      name: "GitLab",       note: "git.domain · CI trigger",  col: HL_ORANGE },
    { label: "CI / CD",  name: "GitLab CI",    note: ".gitlab-ci.yml · k3s-ctrl runner", col: HL_YELLOW },
    { label: "REGISTRY", name: "Harbor",       note: "172.16.60.35 · OCI mirror", col: HL_TEAL  },
    { label: "DEPLOY",   name: "K3s Cluster",  note: "redline ns · manual gate",  col: HL_CYAN  },
    { label: "SECRETS",  name: "Vault",        note: "172.16.60.31 · KV / PKI",   col: HL_SLATE },
    { label: "MESSAGES", name: "NATS JetStream","note": "nats ns · 3-pod HA",      col: HL_GREEN },
  ];

  const W = 1000;
  const slotW = Math.floor(W / stages.length);  // ~142

  return (
    <div>
      <div className="hl-pipeline-wrap">
        <svg viewBox={`0 0 ${W} 200`} className="hl-pipeline-svg">
          <defs>
            <marker id="pia" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={HL_CYAN+"0.8)"}/>
            </marker>
            <pattern id="ppgrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M30 0L0 0 0 30" fill="none" stroke={HL_CYAN+"0.04)"} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={W} height="200" fill="#050910"/>
          <rect width={W} height="200" fill="url(#ppgrid)"/>

          {stages.map((s, i) => {
            const cx = slotW * i + slotW / 2;
            const boxW = 118;
            const bx = cx - boxW / 2;
            return (
              <g key={s.name}>
                {/* Connector arrow */}
                {i > 0 && (
                  <line
                    x1={bx} y1="100"
                    x2={slotW * (i-1) + slotW / 2 + 59 + 4} y2="100"
                    stroke={HL_CYAN+"0.6)"} strokeWidth="1.5"
                    markerEnd="url(#pia)"
                  />
                )}
                {/* Box */}
                <rect x={bx} y="68" width={boxW} height="64" rx="6"
                  fill={s.col+"0.07)"} stroke={s.col+"0.35)"} strokeWidth="1"/>
                {/* Service name */}
                <text x={cx} y="92" fill={s.col+"0.92)"} fontSize="9.5"
                  textAnchor="middle" fontFamily="'Share Tech Mono'" fontWeight="bold">{s.name}</text>
                {/* Note */}
                <text x={cx} y="107" fill={s.col+"0.6)"} fontSize="7.5"
                  textAnchor="middle" fontFamily="'Share Tech Mono'">{s.note}</text>
                {/* Stage label */}
                <text x={cx} y="150" fill={HL_SLATE+"0.45)"} fontSize="7.5"
                  textAnchor="middle" fontFamily="'Share Tech Mono'" letterSpacing="1">{s.label}</text>
                {/* Vault dotted arrow to K3s */}
                {s.name === "Vault" && (
                  <path d={`M ${cx} 68 Q ${cx - 60} 30 ${slotW * 4 + slotW / 2} 68`}
                    fill="none" stroke={HL_SLATE+"0.3)"} strokeWidth="1" strokeDasharray="4,3"/>
                )}
              </g>
            );
          })}

          {/* Footer note */}
          <text x={W/2} y="180" fill={HL_SLATE+"0.35)"} fontSize="7.5"
            textAnchor="middle" fontFamily="'Share Tech Mono'">
            GitHub → GitLab mirror → CI build/test → Harbor push → K3s deploy (manual gate) · Vault secrets injected · NATS messaging
          </text>
        </svg>
      </div>

      {/* Detail cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        <div className="hl-card">
          <div className="hl-card-head">
            <div className="hl-card-icon" style={{ background:HL_YELLOW+"0.1)", border:`1px solid ${HL_YELLOW}0.25)` }}>📋</div>
            <div>
              <div className="hl-card-title">GitLab CI Stages</div>
              <div className="hl-card-sub">.gitlab-ci.yml · k3s-ctrl runner</div>
            </div>
          </div>
          {[
            { k:"stages",        v:"test → build → deploy" },
            { k:"test:go",       v:"golang:1.21 · go test ./..." },
            { k:"test:node",     v:"node:20 · npm ci && npm test" },
            { k:"build:backend", v:"docker:24-dind · push to Harbor" },
            { k:"deploy:k3s",    v:"bitnami/kubectl · when: manual" },
            { k:"branches",      v:"main, /^Phase-.*/" },
          ].map(it => (
            <div className="hl-kv" key={it.k}>
              <span className="hl-kv-k">{it.k}</span>
              <span className="hl-kv-v">{it.v}</span>
            </div>
          ))}
        </div>

        <div className="hl-card">
          <div className="hl-card-head">
            <div className="hl-card-icon" style={{ background:HL_SLATE+"0.1)", border:`1px solid ${HL_SLATE}0.25)` }}>🔑</div>
            <div>
              <div className="hl-card-title">Vault Secrets Structure</div>
              <div className="hl-card-sub">KV v2 · PKI · Audit file</div>
            </div>
          </div>
          {[
            { k:"mount: secret/",  v:"KV v2 — general secrets" },
            { k:"mount: redline/", v:"KV v2 — REDLINE project" },
            { k:"mount: pki/",     v:"PKI engine — internal CA" },
            { k:"redline/nats",    v:"NATS URL, credentials, cluster" },
            { k:"Keycloak OIDC",   v:"cloudflare-access client" },
            { k:"K3s SA",          v:"gitlab-ci ServiceAccount · cluster-admin" },
          ].map(it => (
            <div className="hl-kv" key={it.k}>
              <span className="hl-kv-k">{it.k}</span>
              <span className="hl-kv-v">{it.v}</span>
            </div>
          ))}
        </div>

        <div className="hl-card">
          <div className="hl-card-head">
            <div className="hl-card-icon" style={{ background:HL_CYAN+"0.1)", border:`1px solid ${HL_CYAN}0.25)` }}>📡</div>
            <div>
              <div className="hl-card-title">NATS JetStream Cluster</div>
              <div className="hl-card-sub">redline-nats · nats namespace</div>
            </div>
          </div>
          {[
            { k:"topology",   v:"StatefulSet · 3 replicas" },
            { k:"cluster",    v:"redline-nats" },
            { k:"client",     v:"port 4222" },
            { k:"monitor",    v:"NodePort 30222" },
            { k:"storage",    v:"10 Gi PVC per pod" },
            { k:"init ctr",   v:"POD_NAME → server_name config" },
          ].map(it => (
            <div className="hl-kv" key={it.k}>
              <span className="hl-kv-k">{it.k}</span>
              <span className="hl-kv-v">{it.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Build Log Panel ────────────────────────────────────────── */
function HLBuildLog() {
  const milestones = [
    "Cisco 3560-24P configured — 8 VLANs, Rapid-PVST, DHCP helper, ACLs",
    "FreshTomato edge router deployed — NAT, DDNS, WireGuard server",
    "CGNAT bypass via Oracle Cloud VPS WireGuard relay",
    "Proxmox VE 9.1.4 installed on Dell R630 (40 vCPU, 125 GB RAM)",
    "Active Directory domain corp.architsec.com — DC1 (Dell R420, PDC)",
    "Backup DC3 (IBM X3250 M4) joined and replicated — all 5 partitions",
    "AD replication crisis resolved — 1,029 consecutive failures → healthy",
    "Proxmox AD realm sync — hourly cron, Proxmox-Admins group mapped",
    "WireGuard multi-hop tunnel — Parrot client → OCI relay → edge1 → LAN",
    "Cloudflare Zero Trust tunnels — git, chat, portal, auth endpoints live",
    "K3s 3-node cluster (ctrl + 2 workers) deployed via cloud-init",
    "NATS JetStream 3-pod StatefulSet with HA cluster in K3s",
    "GitLab + GitLab CI with K3s runner registered (redline namespace)",
    "Harbor container registry deployed — K3s registry mirror configured",
    "Nexus OSS artifact manager deployed (Java 11, tuned for 2 GB LXC)",
    "HashiCorp Vault — KV v2, PKI, audit log, Keycloak OIDC integration",
    "Keycloak SSO — architsec realm, Cloudflare Access OIDC client",
    "Apache Guacamole — browser RDP/SSH/VNC via DMZ LXC",
    "Mattermost — self-hosted team chat with AD SSO via Cloudflare tunnel",
    "REDLINE Dev Portal deployed (Node.js, NATS status dashboard)",
    "Wazuh SIEM (Manager + Dashboard) on dedicated 12 GB VM",
    "DevSecOps pipeline: GitHub mirror → GitLab CI → Harbor → K3s (manual gate)",
  ];

  const wars = [
    {
      title: "AD Replication — 1,029 Consecutive Failures",
      items: [
        "DC1 IP change — DC3 DNS still pointing to old address → updated",
        "Tailscale NRPT rules intercepting corp.architsec.com DNS → removed",
        "Missing SPNs on DC1 AD computer object → Set-ADComputer to re-add",
        "DC3 machine account secure channel broken → netdom resetpwd",
        "NTDS initial-sync flag blocking replication → registry bypass (temp)",
      ]
    },
    {
      title: "WireGuard — No Traffic Through Tunnel (5 Root Causes)",
      items: [
        "CGNAT blocks inbound UDP → deployed OCI VPS relay (edge1 dials out)",
        "OCI Security List filtering source-port instead of dest-port 51820",
        "FreshTomato DROP state NEW on wg0 FORWARD chain → iptables -D",
        "swr1 missing return route for 10.20.0.0/24 → ip route added",
        "OCI FORWARD REJECT rule blocking relay → iptables -D FORWARD -j REJECT",
      ]
    },
    {
      title: "DNS — Rogue Stub Zones Intercepting Queries",
      items: [
        "20+ per-host stub zones intercepting queries → removed via DNS Manager",
        "Rogue CNAME architsec.com→architsec.co. in _msdcs zone → deleted",
        "DomainDnsZones/ForestDnsZones pointing to old IP → updated A records",
        "DC1 DNS listening on APIPA addresses → registry fix (REG_MULTI_SZ)",
      ]
    },
    {
      title: "Guacamole — Connection Refused / 500 Error",
      items: [
        "guacd binding only to [::1]:4822 (IPv6 lo) → restarted with -b 0.0.0.0",
        "Bash history expansion (!) mangling XML credentials → heredoc pattern",
        "Cloudflared using stale token-based config → rewrote systemd unit",
      ]
    },
    {
      title: "Cloudflare Tunnel — HTTP 523 Origin Unreachable",
      items: [
        "Port forward on edge1 pointed to RD Gateway, not GitLab → cloudflared on GitLab VM",
        "Mattermost same issue → separate cloudflared daemon on MM VM",
        "Stale A records (Cloudflare proxy IPs) blocking CNAME creation → deleted",
        "GitLab nginx TLS + plain HTTP tunnel → noTLSVerify: true in config",
      ]
    },
    {
      title: "Proxmox — Ghost Node / VLAN Bridge",
      items: [
        "Ghost 'pve1' node after hostname change → deleted /etc/pve/nodes/pve1",
        "vmbr0 not routing VLANs → added bridge-vlan-aware yes to /etc/network/interfaces",
        "AD users missing after realm add → configured hourly pveum realm sync cron",
      ]
    },
    {
      title: "Nexus OSS — Java Version Incompatibility",
      items: [
        "Nexus 3.68 requires Java 8–11; Java 17 installed → installed openjdk-11",
        "-Djava.endorsed.dirs flag incompatible with Java 11 → removed from vmoptions",
        "Memory settings too high for 2 GB LXC → tuned to Xms512m/Xmx1024m",
      ]
    },
    {
      title: "NATS JetStream — CrashLoopBackOff",
      items: [
        "'jetstream cluster requires server_name' → init container injects POD_NAME",
        "NATS showing offline in portal → exposed monitor as NodePort 30222",
      ]
    },
  ];

  const todos = [
    { pri:"hi",  text:"Remove DC3 replication bypass registry flags (Repl Perform Initial Synchronizations)" },
    { pri:"hi",  text:"Power cycle IP camera — needs DHCP lease on VLAN 70" },
    { pri:"med", text:"Update swr1 DHCP helper addresses (VLANs 30/40/50/60) to point to DC1 primary" },
    { pri:"med", text:"Link Tier 3/4 GPOs to OUs — GPOs created but not yet applied" },
    { pri:"med", text:"Remove temporary DC1 hosts-file entries added during replication repair on DC3" },
    { pri:"low", text:"Deploy Nginx reverse proxy LXC (172.16.60.12) for internal SSL termination" },
    { pri:"low", text:"Configure Vault agent injector for K3s pod secrets (sidecar injection)" },
    { pri:"low", text:"OCI DRG BGP — site-to-site VPN between OCI VCN and homelab" },
    { pri:"low", text:"Deploy Wazuh agents on K3s nodes (ctrl, w1, w2)" },
  ];

  const priClass = { hi:"hl-pri-hi", med:"hl-pri-med", low:"hl-pri-low" };

  return (
    <div>
      {/* Milestones */}
      <div className="hl-log-section-title">// completed milestones</div>
      <div className="hl-milestones">
        {milestones.map(m => (
          <div className="hl-milestone" key={m}>
            <span className="hl-milestone-dot">✓</span>
            <span>{m}</span>
          </div>
        ))}
      </div>

      {/* War stories */}
      <div className="hl-log-section-title">// remediated issues — war stories</div>
      <div className="hl-war-grid">
        {wars.map(w => (
          <div className="hl-war-card" key={w.title}>
            <div className="hl-war-title">
              <span style={{color:"#00ff88",fontSize:11}}>✓</span> {w.title}
            </div>
            <ul className="hl-war-items">
              {w.items.map((it, i) => <li className="hl-war-item" key={i}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Pending */}
      <div className="hl-log-section-title">// pending remediation</div>
      <div className="hl-todo-grid">
        {todos.map(td => (
          <div className="hl-todo-item" key={td.text}>
            <span className={`hl-todo-pri ${priClass[td.pri]}`}>{td.pri.toUpperCase()}</span>
            <span>{td.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HomeLab Section ────────────────────────────────────────── */
function HomeLab() {
  const [tab, setTab] = useState("topology");
  const [topoView, setTopoView] = useState("logical");

  const tabs = [
    { id: "topology", label: "topology"  },
    { id: "hardware", label: "hardware"  },
    { id: "services", label: "services"  },
    { id: "pipeline", label: "pipeline"  },
    { id: "log",      label: "build log" },
  ];

  const hlStats = [
    { val: "5",   label: "physical nodes"  },
    { val: "8+8", label: "VMs · LXCs"      },
    { val: "8",   label: "VLANs"           },
    { val: "3",   label: "K3s workers"     },
    { val: "16+", label: "services online" },
  ];

  return (
    <section id="homelab">
      <Reveal as="div" className="section-label">
        <span><span className="num">06</span> // homelab</span>
      </Reveal>
      <Reveal as="h2" className="section-title">
        Enterprise <span className="accent">homelab</span>.
      </Reveal>
      <Reveal as="p" className="section-subtitle">
        Production-grade on-premises / cloud hybrid — purpose-built for security research, DevSecOps automation, and adversarial range exercises.
      </Reveal>

      <Reveal as="div" className="hl-stats-row">
        {hlStats.map(s => (
          <div className="hl-stat" key={s.label}>
            <span className="hl-stat-val">{s.val}</span>
            <span className="hl-stat-label">{s.label}</span>
          </div>
        ))}
      </Reveal>

      <Reveal as="div" className="project-filters" style={{ marginTop: 32 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`filter-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </Reveal>

      <div className="hl-tab-body">
        {tab === "topology" && (
          <div>
            <div className="project-filters" style={{ marginBottom: 20, gap: 8 }}>
              <button className={`filter-btn ${topoView === "logical" ? "active" : ""}`}
                onClick={() => setTopoView("logical")}>logical</button>
              <button className={`filter-btn ${topoView === "physical" ? "active" : ""}`}
                onClick={() => setTopoView("physical")}>physical</button>
            </div>
            {topoView === "logical" ? <HLLogicTopo /> : <HLPhysTopo />}
          </div>
        )}
        {tab === "hardware" && <HLHardware />}
        {tab === "services" && <HLServices />}
        {tab === "pipeline" && <HLPipeline />}
        {tab === "log"      && <HLBuildLog />}
      </div>
    </section>
  );
}

/* Export to global */
Object.assign(window, {
  Header, Hero, About, Skills, Projects, Achievements, Education, Contact, Footer,
  MatrixRain, BootTerminal, HeroVisual, Reveal, HomeLab
});
