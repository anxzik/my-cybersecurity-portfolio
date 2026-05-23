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
        Drawn to the trenches of Cybersecurity by way of a lifelong fascination with computing, and a Decades long career in Physical Security,
          I help organizations secure and monitor their environments.
      </Reveal>

      <div className="about-grid">
        <Reveal as="div" className="about-body">
          <p>{identity.bio}</p>
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
            <div className="k">background</div>
            <div className="v">20+ yrs physical security · EMS Director of Operations</div>
          </div>
          <div className="info-row">
            <div className="k">status</div>
            <div className="v"><span style={{color:'#27c93f'}}>● </span>{identity.status}</div>
          </div>
          <div className="info-row">
            <div className="k">stack</div>
            <div className="v">Python · Go · Bash · K8s · GCP · GitLab CI</div>
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
      { id: "all",         label: "all" },
      { id: "devsecops",   label: "devsecops" },
      { id: "blue team",   label: "blue team" },
      { id: "cloud",       label: "cloud" },
      { id: "networking",  label: "networking" },
      { id: "softwaredev", label: "softwaredev" },
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
                {p.links.map((l) => l.href ? (
                  <a key={l.label} href={l.href} className="project-link" target="_blank" rel="noreferrer">
                    <i className="bi bi-arrow-up-right"></i> {l.label}
                  </a>
                ) : (
                  <span key={l.label} className="project-link" style={{opacity: 0.5, cursor: 'default'}}>
                    <i className="bi bi-lock"></i> {l.label}
                  </span>
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
          <div className="cert" key={c.name} style={c.expired ? {opacity: 0.6} : {}}>
            <div className="cert-icon"><i className={`bi bi-${c.icon}`}></i></div>
            <div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-org">{c.org}</div>
              <div className="cert-year" style={c.expired ? {color: 'var(--fg-muted)'} : {}}>
                {c.expired ? `Expired ${c.year}` : `Issued ${c.year}`}
              </div>
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

/* Export to global */
Object.assign(window, {
  Header, Hero, About, Skills, Projects, Achievements, Education, Contact, Footer,
  MatrixRain, BootTerminal, HeroVisual, Reveal
});
