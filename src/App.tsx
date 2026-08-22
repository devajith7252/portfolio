import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import Globe from './Globe'
import './App.css'

type SectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'contact'

type Point = { x: number; y: number }


const sections: Array<{ id: SectionId; label: string }> = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const skills = [
  { title: 'Languages', items: 'JavaScript (ES6+), HTML5, CSS3, Python, PHP, SQL' },
  { title: 'Frameworks', items: 'Angular, React.js' },
  { title: 'Back-end', items: 'Django, Node.js, FastAPI' },
  { title: 'Database', items: 'MySQL' },
  { title: 'Styling & UI', items: 'Tailwind CSS, SCSS, Material Design' },
  { title: 'Real-time', items: 'WebSockets, Streaming Data' },
  { title: 'Data Visualization', items: 'Recharts, ApexCharts' },
  { title: 'Tools', items: 'Git, GitHub, Bitbucket, NPM, Yarn, VS Code' },
  { title: 'Methodology', items: 'Agile Scrum, Component-Based Architecture' },
]


const experienceBullets = [
  'Learned React.js within one month to deliver GnieStudio Phase 4, demonstrating rapid adaptability.',
  'Developed reusable front-end frameworks and UI component libraries using Angular.',
  'Implemented real-time chat interfaces for internal and client-facing AI-driven applications using WebSockets.',
  'Built highly responsive UIs with Angular, HTML5, CSS3, and Tailwind CSS.',
  'Integrated front-end with Node.js and FastAPI APIs for dynamic data operations.',
  'Actively contributed to Agile processes, code reviews, and version control via GitHub and Bitbucket.',
  'Optimized performance by identifying and resolving complex front-end issues.',
]

const projects = [
  {
    title: 'AskAldar - Contingent Workforce Platform',
    client: 'Client: Aldar',
    dates: 'Jul 2026 - Current',
    desc: 'Full-stack conversational AI platform digitizing Aldar workforce lifecycle from staffing request creation to candidate onboarding.',
    bullets: [
      'Role-based AI chat experiences for internal managers and external staffing vendors',
      'Staffing request creation, tracking, and approval workflows',
      'Vendor candidate submissions with CV upload and screening',
      'Interview scheduling, panel management, and structured evaluation feedback',
      'Offer management and commercial proposal handling',
      'Document management for candidate onboarding',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'],
  },
  {
    title: 'AI-Powered Procurement Analytics Platform',
    client: 'Client: Aldar',
    dates: 'May - Jul 2026',
    desc: 'Conversational analytics platform letting procurement teams query enterprise data in natural language, returning tables, charts, and narrative summaries.',
    bullets: [
      'Chat-first React and TypeScript frontend with live streaming and exportable visualizations',
      'Admin console for managing database schema metadata and query instructions',
      'Secure SSO with Azure AD and a WhatsApp-based interface for on-the-go access',
      'Hybrid search with Elasticsearch grounding AI responses in accurate schema context',
    ],
    tech: ['React', 'TypeScript', 'Azure AD', 'Elasticsearch'],
  },
  {
    title: 'HR Analytics Dashboard',
    client: 'Client: Aldar',
    dates: 'Mar - May 2026',
    desc: 'HR analytics dashboard providing workforce visibility into headcount, attendance, leave, payroll, compensation, movement, and diversity metrics.',
    bullets: [
      'React 19, TypeScript, Vite frontend with Tailwind CSS and Framer Motion',
      'AI-powered chat assistant with real-time streaming and Markdown rendering',
      'Universal search across HR data',
      'Multi-format export: PDF, PowerPoint, Excel, and dashboard-to-image',
      'State management with Zustand integrated with a FastAPI backend',
      'Auth, protected routing, and Docker deployments across dev, QA, and production',
    ],
    tech: ['React 19', 'TypeScript', 'Zustand', 'Recharts'],
  },
  {
    title: 'MPH Recruitment AI',
    client: 'Client: MPH',
    dates: 'Jan - Mar 2026',
    desc: 'React frontend for an AI-powered recruitment platform with Recruiter, Candidate, and Admin portals.',
    bullets: [
      'Secure auth with role-based protected routing',
      'Recruiter dashboard for posting and managing job listings',
      'AI-driven candidate-job matching with ranked candidate views',
      'Candidate portal with profile builder and match-score visualizations',
      'Admin dashboard with analytics charts and user management',
      'AI-generated content rendered as sanitized Markdown and HTML',
    ],
    tech: ['React', 'Redux Toolkit', 'Markdown', 'Chart Analytics'],
  },
  {
    title: 'TDK AI Studio',
    client: 'Client: TDK',
    dates: 'Jan - Nov 2024',
    desc: 'Enterprise AI platform frontend covering chat, custom GPT tooling, and document intelligence workflows.',
    bullets: [
      'AI chat interface with session history, sidebar navigation, and markdown-rendered responses',
      'Custom and enterprise GPT creation and configuration',
      'Document Analyzer and SharePoint Analyzer workflows',
      'Multi-language Translator module',
      'Admin panel for users, groups, roles, permissions, and prompt examples',
      'Token-based auth interceptors and role-based route guards',
    ],
    tech: ['React', 'i18n', 'Auth Interceptors', 'RBAC Admin'],
  },
]

const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    school: 'STAS, Kottayam, Kerala',
    year: '2023',
    cgpa: '8.4/10',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    school: 'MES Golden Jubilee College, Kottayam',
    year: '2021',
    cgpa: '7.0/10',
  },
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const heroButtonRef = useRef<HTMLAnchorElement | null>(null)
  const contactButtonRef = useRef<HTMLAnchorElement | null>(null)
  const [introDone, setIntroDone] = useState(false)
  const [mouse, setMouse] = useState<Point>({ x: 0, y: 0 })
  const [trail, setTrail] = useState<Point[]>([])
  const [cursorHover, setCursorHover] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [activeId, setActiveId] = useState<SectionId>('hero')
  const [visible, setVisible] = useState<Record<SectionId, boolean>>({
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    contact: true,
  })
  const [buttonOffset, setButtonOffset] = useState({ primary: { x: 0, y: 0 }, secondary: { x: 0, y: 0 } })
  const [projectSpot, setProjectSpot] = useState<Record<number, Point | null>>({})

  const nameLetters = useMemo(() => {
    let index = 0
    return 'Devajith Mohan'.split(' ').map((word) =>
      word.split('').map((char) => {
        const delay = 0.3 + index * 0.045
        index += 1
        return { char, delay }
      }),
    )
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let raf = 0
    const handleMove = (event: MouseEvent) => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const next = { x: event.clientX, y: event.clientY }
        setMouse(next)
        setTrail((current) => [next, ...current].slice(0, 6))
      })
    }

    const handleOver = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a,button')) setCursorHover(true)
    }

    const handleOut = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a,button')) setCursorHover(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let frame = 0
    let animation = 0

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const stars = Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
    }))

    const tick = () => {
      frame += 1
      const warping = !introDone
      if (!warping && frame % 2 !== 0) {
        animation = window.requestAnimationFrame(tick)
        return
      }

      const speed = warping ? 22 : 0.6
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = '#ffffff'
      ctx.fillStyle = '#ffffff'

      stars.forEach((star) => {
        const prevK = 128 / star.z
        const px = star.x * prevK + width / 2
        const py = star.y * prevK + height / 2
        star.z -= speed

        if (star.z <= 1) {
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
          star.z = width
        }

        const k = 128 / star.z
        const x = star.x * k + width / 2
        const y = star.y * k + height / 2
        const size = Math.max(0.4, (1 - star.z / width) * 2.2)
        const alpha = Math.min(1, (1 - star.z / width) * 1.3)

        if (warping) {
          ctx.globalAlpha = alpha * 0.8
          ctx.lineWidth = size
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(x, y)
          ctx.stroke()
        } else {
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(x, y, size * 0.6, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1
      animation = window.requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animation)
    }
  }, [introDone])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let raf = 0
    const compute = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight
      setScrollPct(maxScroll > 0 ? (scroller.scrollTop / maxScroll) * 100 : 0)

      let nextActive: SectionId = 'hero'
      const nextVisible = {} as Record<SectionId, boolean>
      sections.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < scroller.clientHeight * 0.85 && rect.bottom > scroller.clientHeight * 0.15
        nextVisible[id] = isVisible
        if (rect.top < scroller.clientHeight * 0.48 && rect.bottom > scroller.clientHeight * 0.25) {
          nextActive = id
        }
      })

      setVisible((current) => {
        const changed = sections.some(({ id }) => current[id] !== nextVisible[id])
        return changed ? nextVisible : current
      })
      setActiveId(nextActive)
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        compute()
      })
    }

    compute()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const jumpTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setVisible((current) => ({ ...current, [id]: true }))
  }

  const magneticMove =
    (key: 'primary' | 'secondary', ref: RefObject<HTMLAnchorElement | null>) =>
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setButtonOffset((current) => ({
        ...current,
        [key]: {
          x: (event.clientX - (rect.left + rect.width / 2)) * 0.3,
          y: (event.clientY - (rect.top + rect.height / 2)) * 0.3,
        },
      }))
    }

  const magneticLeave = (key: 'primary' | 'secondary') => {
    setButtonOffset((current) => ({ ...current, [key]: { x: 0, y: 0 } }))
  }

  return (
    <div className="portfolio-app">
      <canvas ref={canvasRef} className="star-canvas" />

      <div className={`intro ${introDone ? 'intro--done' : ''}`}>
        <div className="intro__name">
          <span>Devajith</span>
          <span>Mohan</span>
        </div>
        <div className="intro__track">
          <div className="intro__bar" />
        </div>
      </div>

      {trail.map((point, index) => (
        <span
          className="cursor-trail"
          key={`${point.x}-${point.y}-${index}`}
          style={{
            left: point.x,
            top: point.y,
            width: 5 - index * 0.6,
            height: 5 - index * 0.6,
            opacity: 0.35 - index * 0.05,
          }}
        />
      ))}
      <span className="cursor-dot" style={{ left: mouse.x, top: mouse.y }} />
      <span
        className={`cursor-ring ${cursorHover ? 'cursor-ring--hover' : ''}`}
        style={{ left: mouse.x, top: mouse.y }}
      />
      <span className="spotlight" style={{ left: mouse.x - 240, top: mouse.y - 240 }} />

      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <header className="site-header">
        <a href="#hero" onClick={() => jumpTo('hero')} className="site-logo">
          Devajith Mohan
        </a>
        <span>{sections.find((section) => section.id === activeId)?.label}</span>
      </header>

      <nav className="side-nav" aria-label="Portfolio sections">
        {sections.map((section) => (
          <a
            className={`side-nav__link ${activeId === section.id ? 'side-nav__link--active' : ''}`}
            href={`#${section.id}`}
            key={section.id}
            onClick={(event) => {
              event.preventDefault()
              jumpTo(section.id)
            }}
          >
            <span>{section.label}</span>
            <i />
          </a>
        ))}
      </nav>

      <main ref={scrollerRef} className="portfolio-scroller">
        <section id="hero" className={`section hero-section ${visible.hero ? 'is-visible' : ''}`}>
          <div className="section-number">01</div>
          <div
            className="globe-wrap"
            style={{
              transform: `translate(${(mouse.x - window.innerWidth / 2) * 0.02}px, ${
                (mouse.y - window.innerHeight / 2) * 0.02
              }px)`,
            }}
          >
            <Globe />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Front-end Developer</p>
            <h1>
              {nameLetters.map((word, wordIndex) => (
                <span className="word" key={wordIndex}>
                  {word.map((letter, letterIndex) => (
                    <span
                      className="letter"
                      key={`${letter.char}-${letterIndex}`}
                      style={{ animationDelay: `${letter.delay}s` }}
                    >
                      {letter.char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="hero-summary">
              Building dynamic, responsive web applications with React, Angular, and modern JavaScript - 3 years
              turning ideas into clean, scalable interfaces.
            </p>
            <div className="hero-actions">
              <a
                ref={heroButtonRef}
                href="#projects"
                className="button button--primary"
                onClick={(event) => {
                  event.preventDefault()
                  jumpTo('projects')
                }}
                onMouseMove={magneticMove('primary', heroButtonRef)}
                onMouseLeave={() => magneticLeave('primary')}
                style={{ transform: `translate(${buttonOffset.primary.x}px, ${buttonOffset.primary.y}px)` }}
              >
                View Projects
              </a>
              <a
                ref={contactButtonRef}
                href="#contact"
                className="button"
                onClick={(event) => {
                  event.preventDefault()
                  jumpTo('contact')
                }}
                onMouseMove={magneticMove('secondary', contactButtonRef)}
                onMouseLeave={() => magneticLeave('secondary')}
                style={{ transform: `translate(${buttonOffset.secondary.x}px, ${buttonOffset.secondary.y}px)` }}
              >
                Contact Me
              </a>
            </div>
          </div>
        </section>

        <section id="about" className={`section exact-section about-section ${visible.about ? 'is-visible' : ''}`}>
          <div className="section-watermark section-watermark--left">02</div>
          <div className="section-heading">
            <span>01</span>
            <h2>About</h2>
          </div>
          <p className="about-lede">
            Highly motivated front-end developer with <strong>3 years</strong> of experience building dynamic,
            responsive web apps with Angular, React, HTML5, CSS3 and modern JavaScript - skilled in real-time
            interfaces, API integrations, and reusable UI systems.
          </p>
          <div className="about-stats">
            <div>
              <strong>3+</strong>
              <span>Years Experience</span>
            </div>
            <div>
              <strong>5+</strong>
              <span>Major Projects</span>
            </div>
            <div>
              <strong>8.4</strong>
              <span>CGPA (MCA)</span>
            </div>
          </div>
        </section>

        <section id="skills" className={`section exact-section skills-section ${visible.skills ? 'is-visible' : ''}`}>
          <div className="section-watermark section-watermark--right">03</div>
          <div className="section-heading">
            <span>02</span>
            <h2>Skills</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article className="skill-card" key={skill.title} style={{ transitionDelay: `${index * 0.05}s` }}>
                <h3>{skill.title}</h3>
                <p>{skill.items}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="experience"
          className={`section exact-section experience-section ${visible.experience ? 'is-visible' : ''}`}
        >
          <div className="section-watermark section-watermark--bottom-left">04</div>
          <div className="section-heading">
            <span>03</span>
            <h2>Experience</h2>
          </div>
          <div className="experience-panel">
            <div className="experience-title-row">
              <h3>Associate Developer</h3>
              <span>Sept 2023 - Present</span>
            </div>
            <p>Gapblue Software Labs · Infopark, Kochi</p>
          </div>
          <ul className="experience-list">
            {experienceBullets.map((bullet, index) => (
              <li key={bullet} style={{ transitionDelay: `${index * 0.06}s` }}>
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        <section id="projects" className={`section exact-section projects-section ${visible.projects ? 'is-visible' : ''}`}>
          <div className="section-watermark section-watermark--right">05</div>
          <div className="section-heading">
            <span>04</span>
            <h2>Projects</h2>
          </div>
          <div className="project-list">
            {projects.map((project, index) => {
              const spot = projectSpot[index]
              return (
                <article
                  className="project"
                  key={project.title}
                  onMouseMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect()
                    setProjectSpot((current) => ({
                      ...current,
                      [index]: { x: event.clientX - rect.left, y: event.clientY - rect.top },
                    }))
                  }}
                  onMouseLeave={() => setProjectSpot((current) => ({ ...current, [index]: null }))}
                  style={{
                    transitionDelay: `${index * 0.1}s`,
                    background: spot
                      ? `radial-gradient(220px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.07), transparent 70%)`
                      : undefined,
                  }}
                >
                  <div>
                    <div className="project__title-row">
                      <h3>{project.title}</h3>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="project__meta">
                      {project.client} · {project.dates}
                    </div>
                    <p>{project.desc}</p>
                    <ul>
                      {project.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="tech-list">
                      {project.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="education" className={`section exact-section education-section ${visible.education ? 'is-visible' : ''}`}>
          <div className="section-watermark section-watermark--left-top">06</div>
          <div className="section-heading">
            <span>05</span>
            <h2>Education</h2>
          </div>
          <div className="education-list">
            {education.map((item) => (
              <article className="education-card" key={item.degree}>
                <div>
                  <h3>{item.degree}</h3>
                  <p>{item.school}</p>
                </div>
                <div className="education-card__meta">
                  <span>{item.year}</span>
                  <strong>CGPA {item.cgpa}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className={`section exact-section contact-section ${visible.contact ? 'is-visible' : ''}`}>
          <div className="section-watermark section-watermark--contact">07</div>
          <span className="contact-index">06</span>
          <h2 className="contact-title">Contact</h2>
          <h3>Let's build something great together.</h3>
          <div className="contact-links">
            <span className="contact-ping" />
            <a className="contact-email" href="mailto:devajithmohan1999@gmail.com">
              devajithmohan1999@gmail.com
            </a>
            <a href="tel:+917012147252">+91 70121 47252</a>
            <a href="https://www.linkedin.com/in/devajith-mohan-a239a2209" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
          <p className="contact-location">Alappuzha, Kerala · Devajith Mohan © 2026</p>
        </section>
      </main>
    </div>
  )
}

export default App
