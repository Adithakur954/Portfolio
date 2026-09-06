import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import profileImage from "./images/profile-optimized.webp";

import Journey from "./Journey.jsx";
import "./experience.css";

const site = {
  email: "singhaditya1627@gmail.com",
  github: "https://github.com/Adithakur954",
  linkedin: "https://www.linkedin.com/in/aditya-singh-064015254",
  instagram: "https://www.instagram.com/btwitsadithakur",
  resume: "/Aditya-Singh-Resume.pdf",
};
const projects = [
  {
    id: "referral",
    name: "Referral Platform",
    category: "Full stack",
    type: "FULL STACK APPLICATION",
    description:
      "Turning connections into opportunities. A referral system with invitations, tracking, and a responsive experience.",
    stack: ["React", "Node.js", "SQL"],
    detail:
      "A full-stack e-commerce referral system bringing together user invitations, referral tracking, scalable APIs, and a responsive React interface.",
    url: site.github,
    linkLabel: "Explore my GitHub",
  },
  {
    id: "social",
    name: "Social Media Backend",
    category: "Backend",
    type: "API & BACKEND ENGINEERING",
    description:
      "The engine behind the feed. Structured services for posts, comments, media uploads, and playlists.",
    stack: ["Node.js", "MongoDB", "REST API"],
    detail:
      "Backend services for social interactions and media management, with MongoDB aggregation pipelines for efficient data retrieval and organized APIs for posts, comments, uploads, and playlists.",
    url: `${site.github}/Backend-Combined`,
    linkLabel: "View source code",
  },
  {
    id: "chat",
    name: "Real-Time Chat",
    category: "Full stack",
    type: "REAL-TIME WEB APPLICATION",
    description:
      "Less waiting. More connecting. A messaging experience built around fast, intuitive conversations.",
    stack: ["React", "Express", "MongoDB"],
    detail:
      "A real-time messaging application with an optimized data model for fast retrieval and toast-based interaction feedback. Built with React, Express, and MongoDB.",
    url: site.github,
    linkLabel: "Explore my GitHub",
  },
  {
    id: "currency",
    name: "Currency Converter",
    category: "Frontend",
    type: "INTERACTIVE WEB TOOL",
    description:
      "A small tool for a connected world. Simple currency conversion powered by an exchange-rate API.",
    stack: ["JavaScript", "CSS", "API"],
    detail:
      "An interactive currency conversion tool that uses an external exchange-rate API to convert between currencies through a simple, focused interface.",
    url: "https://currencyconvertorbyadi.netlify.app/",
    linkLabel: "Open live project",
  },
];
const experiences = [
  {
    role: "Full Stack Developer",
    period: "JAN 2026 — PRESENT",
    description:
      "Owning end-to-end development of geospatial visualization modules for monitoring telecom signal quality and logs. Building React dashboards, Node.js / Express APIs, and optimizing MongoDB and SQL queries at scale.",
    tags: ["React", "Node.js", "Geospatial analytics", "SQL"],
    current: true,
  },
  {
    role: "Full Stack Developer Intern",
    period: "OCT 2025 — JAN 2026",
    description:
      "Built interactive map-based telecom analytics and ML-assisted workflows for evaluating signal strength across geographic locations. Promoted to a full-time role after consistently delivering production-ready features.",
    tags: ["Maps API", "MongoDB", "REST APIs", "Agile"],
  },
];
const skillGroups = [
  {
    icon: "⌘",
    name: "The interface",
    note: "Experiences that feel right.",
    skills: ["React.js", "Next.js", "Redux", "JavaScript", "Tailwind CSS"],
  },
  {
    icon: "{ }",
    name: "The engine",
    note: "Solid foundations. Room to grow.",
    skills: [
      "Node.js",
      "Express.js",
      "Java",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
    ],
  },
  {
    icon: "↗",
    name: "The workflow",
    note: "From first commit to production.",
    skills: ["Git", "Postman", "CI/CD Basics", "Agile", "Maps API"],
  },
];

const skillNotes = {
  "React.js": "Building responsive interfaces, real-time chat, and geospatial dashboards at Vinfocom.",
  "Next.js": "Part of my frontend toolkit, alongside React, Redux, and Tailwind CSS.",
  "Redux": "A state-management tool in my frontend toolkit.",
  "JavaScript": "The language connecting my browser interfaces with Node.js backend services.",
  "Tailwind CSS": "A styling tool in my frontend toolkit for responsive web interfaces.",
  "Node.js": "Backend services for referral tracking, messaging, and telecom analytics.",
  "Express.js": "RESTful APIs connecting React dashboards with backend services.",
  "Java": "One of my programming languages, alongside JavaScript and SQL.",
  "REST APIs": "Moving data between frontend dashboards and backend services at Vinfocom.",
  "MongoDB": "Aggregation pipelines for social media APIs and optimized queries for telecom data.",
  "PostgreSQL": "Part of my relational database toolkit, alongside MySQL.",
  "MySQL": "Part of my SQL database toolkit for structured application data.",
  "Git": "Version control in my development workflow, alongside code reviews and Agile delivery.",
  "Postman": "A tool in my workflow for developing and checking API requests.",
  "CI/CD Basics": "Foundational knowledge of continuous integration and delivery.",
  "Agile": "Planning sprints, reviewing code, and shipping features with cross-functional teams.",
  "Maps API": "Interactive visualization of telecom signal quality and logs across geographic locations.",
};

function Arrow({ diagonal = false, className = "" }) {
  return (
    <svg
      className={`arrow ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
Arrow.propTypes = { diagonal: PropTypes.bool, className: PropTypes.string };

function ProjectPreview({ id }) {
  return (
    <div className={`project-preview preview-${id}`} aria-hidden="true">
      <span className="preview-caption">
        INTERFACE CONCEPT / {id.toUpperCase()}
      </span>
      {id === "referral" && (
        <div className="mini-app referral-app">
          <div className="mini-sidebar">
            <b>
              r<span>↗</span>
            </b>
            <i className="selected">◫</i>
            <i>⌘</i>
            <i>↗</i>
            <i>⚙</i>
          </div>
          <div className="mini-main">
            <div className="mini-topline">
              <span>Overview</span>
              <span className="mini-avatar">AS</span>
            </div>
            <h4>Good things grow together.</h4>
            <p>Your network. Your impact.</p>
            <div className="mini-stats">
              <div>
                <small>Total referrals</small>
                <b>
                  128 <em>↗ 24%</em>
                </b>
              </div>
              <div>
                <small>Successful invites</small>
                <b>
                  86 <em>↗ 18%</em>
                </b>
              </div>
            </div>
            <div className="mini-chart">
              <div className="chart-title">
                Referral activity <span>This month⌄</span>
              </div>
              <div className="chart-bars">
                {[25, 40, 32, 56, 45, 67, 52, 76, 64, 88, 73, 96].map(
                  (height, i) => (
                    <i key={i} style={{ height: `${height}%` }} />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {id === "social" && (
        <div className="code-window">
          <div className="code-toolbar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>social-api / routes.js</span>
            <span>JS</span>
          </div>
          <div className="code-content">
            <p>
              <span className="purple">import</span> express{" "}
              <span className="purple">from</span>{" "}
              <span className="green">&apos;express&apos;</span>;
            </p>
            <p>
              <span className="purple">const</span> router ={" "}
              <span className="blue">express.Router</span>();
            </p>
            <br />
            <p className="code-comment">{"// Built for the way we connect."}</p>
            <p>
              router.<span className="blue">route</span>(
              <span className="green">&apos;/posts&apos;</span>)
            </p>
            <p>
              {" "}
              .<span className="blue">get</span>(getAllPosts)
            </p>
            <p>
              {" "}
              .<span className="blue">post</span>(verifyJWT, createPost);
            </p>
            <br />
            <p>
              <span className="purple">export default</span> router;
            </p>
            <div className="api-response">
              <i /> 200 OK <span>All systems connected</span>
            </div>
          </div>
        </div>
      )}
      {id === "chat" && (
        <div className="chat-app">
          <div className="chat-sidebar">
            <b>
              hello<span>●</span>
            </b>
            <div className="chat-search">⌕ &nbsp; Search messages</div>
            {["Design buddies", "Weekend plans", "The build club"].map(
              (name, i) => (
                <div className={`chat-person person-${i}`} key={name}>
                  <span>{["D", "W", "B"][i]}</span>
                  <div>
                    <b>{name}</b>
                    <small>
                      {
                        [
                          "You: Let’s make it happen",
                          "That sounds like a plan!",
                          "Just pushed an update",
                        ][i]
                      }
                    </small>
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="chat-main">
            <div className="chat-title">
              <b>Design buddies</b>
              <small>
                <i /> Online
              </small>
            </div>
            <div className="bubble incoming">Got an idea. Got a minute? ✨</div>
            <div className="bubble outgoing">Always. What are we building?</div>
            <div className="bubble incoming">Something people love using.</div>
            <div className="bubble outgoing">That’s my kind of project 🙌</div>
            <div className="chat-input">
              Message your next big idea <span>↑</span>
            </div>
          </div>
        </div>
      )}
      {id === "currency" && (
        <div className="currency-app">
          <div className="currency-logo">
            ↔ <span>across.</span>
          </div>
          <h4>A world of possibilities.</h4>
          <p>A simpler way to convert.</p>
          <div className="currency-field">
            <small>You send</small>
            <div>
              <b>100.00</b>
              <span>🇺🇸 USD ⌄</span>
            </div>
          </div>
          <div className="currency-swap">↓↑</div>
          <div className="currency-field">
            <small>You receive</small>
            <div>
              <b>92.00</b>
              <span>🇪🇺 EUR ⌄</span>
            </div>
          </div>
          <div className="currency-button">
            Convert currency <span>↗</span>
          </div>
          <small className="sample-rate">
            Illustrative amounts · not live rates
          </small>
        </div>
      )}
    </div>
  );
}
ProjectPreview.propTypes = { id: PropTypes.string.isRequired };

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [activeSection, setActiveSection] = useState("home");
  const [filter, setFilter] = useState("All work");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [portraitFlipped, setPortraitFlipped] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });
  const dialogRef = useRef(null);
  const copyTimer = useRef(null);
  const menuRef = useRef(null);
  const visibleProjects = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion =
      motionPaused || reducedMotion ? "paused" : "on";
  }, [motionPaused, reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0d171c" : "#edf2ef");
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* Storage may be disabled. */
    }
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--progress",
        `${max > 0 ? (scrollY / max) * 100 : 0}%`,
      );
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        if (menuRef.current?.getAttribute("aria-expanded") === "true")
          menuRef.current.focus();
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("keydown", onKey);
    onScroll();
    return () => {
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("keydown", onKey);
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      dialogRef.current.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [selectedProject]);

  useEffect(() => {
    const items = document.querySelectorAll('.section-heading, .project-card, .about-grid, .skill-card, .experience-item, .contact-main');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    items.forEach(item => { item.classList.add('scroll-reveal'); observer.observe(item); });
    return () => observer.disconnect();
  }, [filter]);

  useEffect(() => {
    if (motionPaused || reducedMotion) return undefined;
    const rings = new Set();
    const reactToClick = event => {
      const ring = document.createElement('span');
      ring.className = 'click-ring'; ring.setAttribute('aria-hidden', 'true');
      ring.style.left = `${event.clientX}px`; ring.style.top = `${event.clientY}px`;
      document.body.appendChild(ring); rings.add(ring);
      ring.addEventListener('animationend', () => { ring.remove(); rings.delete(ring); }, { once: true });
    };
    addEventListener('pointerdown', reactToClick, { passive: true });
    return () => { removeEventListener('pointerdown', reactToClick); rings.forEach(ring => ring.remove()); };
  }, [motionPaused, reducedMotion]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      window.location.href = `mailto:${site.email}`;
    }
  };
  const closeProject = () => {
    dialogRef.current?.close();
    setSelectedProject(null);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="header">
        <div className="shell header-inner">
          <a className="brand" href="#home" aria-label="Aditya Singh, home">
            aditya<span className="brand-period">.</span>
          </a>
          <nav
            id="navigation"
            className={menuOpen ? "navigation open" : "navigation"}
            aria-label="Main navigation"
          >
            {[
              ["work", "Work"],
              ["about", "About"],
              ["experience", "Experience"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <span />
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="theme-button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "☾" : "☀"}
            </button>
            <a className="header-contact" href={`mailto:${site.email}`}>
              Let’s talk <Arrow diagonal />
            </a>
            <button
              ref={menuRef}
              className="menu-button"
              aria-controls="navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "Close" : "Menu"}
              <span>{menuOpen ? "−" : "+"}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <Journey paused={motionPaused || reducedMotion} reducedMotion={reducedMotion} onToggleMotion={() => setMotionPaused(value => !value)} resume={site.resume} />
        <div
          className="ticker"
          aria-label="React, Node.js, thoughtful interfaces, scalable systems, geospatial analytics"
        >
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden="true">
                {[
                  "REACT.JS",
                  "NODE.JS",
                  "THOUGHTFUL INTERFACES",
                  "SCALABLE SYSTEMS",
                  "GEOSPATIAL ANALYTICS",
                ].map((item) => (
                  <span key={item}>
                    {item}
                    <i aria-hidden="true">/</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="work section shell" id="work">
          <div className="section-eyebrow">
            <span>01 / THE PROJECT ARCHIVE</span>
            <span>SELECT A PROJECT TO OPEN THE FILE</span>
          </div>
          <div className="section-heading">
            <h2>
              Ideas made <em>real.</em>
            </h2>
            <p>
              A mix of thoughtful interfaces and the
              <br /> systems working behind the scenes.
            </p>
          </div>
          <div className="work-toolbar">
            <div className="filters" role="group" aria-label="Filter projects">
              {["All work", "Full stack", "Backend", "Frontend"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={filter === item ? "active" : ""}
                >
                  {item}
                  {item === "All work" && <span>04</span>}
                </button>
              ))}
            </div>
            <span className="project-count" aria-live="polite">
              {String(visibleProjects.length).padStart(2, "0")} PROJECTS
            </span>
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <button
                className="project-card"
                key={project.id}
                onClick={() => setSelectedProject(project)}
                aria-haspopup="dialog"
              >
                <div className="project-art">
                  <ProjectPreview id={project.id} />
                  <span className="project-open">
                    <Arrow diagonal />
                  </span>
                </div>
                <div className="project-meta">
                  <span className="project-type">{project.type}</span>
                  <h3>
                    {project.name}
                    <Arrow diagonal />
                  </h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {project.stack.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <a
            className="work-more text-link"
            href={site.github}
            target="_blank"
            rel="noreferrer"
          >
            There’s more on GitHub <Arrow diagonal />
          </a>
        </section>

        <section className="about section" id="about">
          <div className="shell">
            <div className="section-eyebrow">
              <span>02 / A LITTLE ABOUT ME</span>
              <span>MORE THAN A JOB TITLE</span>
            </div>
            <div className="about-grid">
              <div>
                <h2>
                  Curious by nature.
                  <br />
                  Builder by <em>choice.</em>
                </h2>
                <button className={`profile-pass ${portraitFlipped ? 'flipped' : ''}`} onClick={() => setPortraitFlipped(value => !value)} aria-pressed={portraitFlipped} aria-label="Flip Aditya’s profile card">
                  <img src={profileImage} alt="Aditya Singh beside a sunlit window" width="1000" height="1334" loading="lazy" />
                  <span className="profile-pass-copy"><small>{portraitFlipped ? 'THE BACKSTORY' : 'DEVELOPER ACCESS PASS'}</small><strong>{portraitFlipped ? 'Always a student.' : 'Aditya Singh'}</strong><span>{portraitFlipped ? 'AKGEC · B.Tech CSE · May 2026 · CGPA 7.45. Volunteer, Atal Generative AI Development Program.' : 'Full Stack Developer / Vinfocom IT Services'}</span><small>{portraitFlipped ? 'CLICK TO RETURN ↩' : 'CLICK TO TURN THE CARD ↗'}</small></span>
                </button>
                <div className="about-note">
                  <span aria-hidden="true">&lt;/&gt;</span>
                  <p>
                    Connecting the dots
                    <br />
                    between people & technology.
                  </p>
                </div>
              </div>
              <div className="about-copy">
                <p className="about-lead">
                  I like figuring out how things work.
                  <br />I love making them work better.
                </p>
                <p>
                  I’m a full stack developer at{" "}
                  <strong>Vinfocom IT Services</strong>, turning complex telecom
                  data into useful visual tools. My work lives at the
                  intersection of web development, data, and maps.
                </p>
                <p>
                  From a carefully considered interaction to an efficient
                  database query, I care about the details that make a product
                  feel effortless. Clean code, continuous learning, and a
                  healthy dose of curiosity keep me going.
                </p>
                <div className="about-facts">
                  <div>
                    <small>BASED IN</small>
                    <span>Ghaziabad, India ↗</span>
                  </div>
                  <div>
                    <small>EDUCATION</small>
                    <span>B.Tech CSE · AKGEC</span>
                  </div>
                </div>
                <a
                  className="text-link"
                  href={site.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  The longer story, in my résumé <Arrow diagonal />
                </a>
              </div>
            </div>
            <div className="skills-heading" id="skills">
              <span>MY EVERYDAY TOOLKIT</span>
              <span>THE RIGHT TOOLS FOR THE RIGHT IDEAS.</span>
            </div>
            <div className="skill-grid">
              {skillGroups.map((group) => (
                <article className="skill-card" key={group.name}>
                  <span className="skill-icon">{group.icon}</span>
                  <h3>{group.name}</h3>
                  <p>{group.note}</p>
                  <div className="tags">
                    {group.skills.map((skill) => (
                      <button key={skill} className="skill-token" aria-pressed={activeSkill?.name === skill} onClick={() => setActiveSkill({name: skill, group: group.name})}>{skill} <span>+</span></button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="skill-readout" aria-live="polite"><span>TOOLKIT / INSPECT</span>{activeSkill ? <p><strong>{activeSkill.name}</strong> — {skillNotes[activeSkill.name]}</p> : <p>Pick a technology above to explore how it fits into my work.</p>}</div>
          </div>
        </section>

        <section className="experience section shell" id="experience">
          <div className="section-eyebrow">
            <span>03 / THE JOURNEY SO FAR</span>
            <span>LEARNING. BUILDING. GROWING.</span>
          </div>
          <div className="experience-grid">
            <div>
              <h2>
                Good work.
                <br />
                <em>Great learning.</em>
              </h2>
              <p className="experience-intro">
                Every challenge is another
                <br /> opportunity to get better.
              </p>
              <a
                className="text-link"
                href={site.resume}
                target="_blank"
                rel="noreferrer"
              >
                View full résumé <Arrow diagonal />
              </a>
            </div>
            <div className="timeline">
              {experiences.map((job, index) => (
                <details
                  className="experience-item"
                  key={job.role}
                  open={index === 0}
                >
                  <summary>
                    <span className="experience-date">
                      {job.period}
                      {job.current && (
                        <span className="current-badge">CURRENT</span>
                      )}
                    </span>
                    <span className="experience-role">
                      {job.role}
                      <span className="expand-icon" />
                    </span>
                    <span className="experience-company">
                      Vinfocom IT Services Pvt. Ltd.
                    </span>
                  </summary>
                  <div className="experience-detail">
                    <p>{job.description}</p>
                    <div className="tags">
                      {job.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
              <div className="education-row">
                <span className="experience-date">2026 / EDUCATION</span>
                <h3>B.Tech in Computer Science</h3>
                <p>Ajay Kumar Garg Engineering College · CGPA 7.45</p>
              </div>
            </div>
          </div>
          <div className="learning-strip">
            <span>ALWAYS A STUDENT</span>
            <p>
              Microsoft Ambassador Program{" "}
              <small>Web development workshop</small>
            </p>
            <p>
              Simplilearn <small>Web development course</small>
            </p>
            <p>
              Atal Generative AI Program <small>Community volunteer</small>
            </p>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="shell">
            <div className="section-eyebrow">
              <span>04 / LET’S CONNECT</span>
              <span>GREAT THINGS START WITH A HELLO.</span>
            </div>
            <div className="contact-main">
              <div>
                <p className="contact-kicker">
                  HAVE AN IDEA? A PROJECT? A REALLY GOOD QUESTION?
                </p>
                <h2>
                  Let’s build
                  <br />
                  something <em>good.</em>
                </h2>
              </div>
              <a
                className="contact-orb"
                href={`mailto:${site.email}`}
                aria-label="Email Aditya to start a conversation"
              >
                <Arrow diagonal />
              </a>
            </div>
            <div className="contact-bottom">
              <div className="email-group">
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <button
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  title="Copy email address"
                >
                  {copied ? "✓" : "⧉"}
                </button>
                <span className="copy-status" role="status">
                  {copied ? "Copied!" : ""}
                </span>
              </div>
              <div className="social-links">
                <a href={site.github} target="_blank" rel="noreferrer">
                  GitHub <Arrow diagonal />
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <Arrow diagonal />
                </a>
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer shell">
        <a className="brand" href="#home">
          aditya<span className="brand-period">.</span>
        </a>
        <p>© {new Date().getFullYear()} Aditya Singh. Made with intention.</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="dialog-title"
        onCancel={closeProject}
        onClose={() => setSelectedProject(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProject();
        }}
      >
        {selectedProject && (
          <div className="dialog-content">
            <button
              className="dialog-close"
              onClick={closeProject}
              aria-label="Close project details"
            >
              ✕
            </button>
            <ProjectPreview id={selectedProject.id} />
            <div className="dialog-text">
              <p className="eyebrow">{selectedProject.type}</p>
              <h2 id="dialog-title">{selectedProject.name}</h2>
              <p>{selectedProject.detail}</p>
              <div className="tags">
                {selectedProject.stack.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <a
                className="button button-dark"
                href={selectedProject.url}
                target="_blank"
                rel="noreferrer"
              >
                {selectedProject.linkLabel} <Arrow diagonal />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
export default App;
