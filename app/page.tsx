import Link from "next/link";
import { getPortfolio } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function BentoCard({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section className={`bento-card ${className}`} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </section>
  );
}

export default async function Home() {
  const data = await getPortfolio();
  const marqueeSkills = [...data.skills, ...data.skills];
  const featuredProjects = data.projects.slice(0, 4);

  return (
    <main className="site-shell">
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark">
          DW
        </Link>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
        </div>
      </nav>

      <div className="bento-grid">
        <BentoCard className="hero-card" delay={40}>
          <div className="hero-orbit" aria-hidden="true" />
          <div>
            <p className="eyebrow">{data.profile.role}</p>
            <h1>{data.profile.name}</h1>
            <p className="hero-copy">{data.profile.headline}</p>
            <p className="hero-about">{data.profile.about}</p>
            <div className="meta-row hero-meta">
              <span>{data.profile.location}</span>
              <span>{data.profile.email}</span>
            </div>
          </div>
          <div className="hero-status" aria-label="Portfolio highlights">
            <span>Product engineering</span>
            <span>Cloud backends</span>
            <span>Mobile systems</span>
          </div>
        </BentoCard>

        <BentoCard className="social-card" delay={120}>
          <p className="eyebrow">Socials</p>
          <div className="social-list">
            {data.socials.map((social) => (
              <a key={social.id} href={social.url || "#"} aria-disabled={!social.url}>
                <span>{social.label}</span>
                <ArrowIcon />
              </a>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="stat-card" delay={200}>
          <span className="stat-number">{data.projects.length}</span>
          <span className="stat-label">shipped case studies with production focus</span>
        </BentoCard>

        <BentoCard className="skills-card" delay={280}>
          <div className="section-heading">
            <p className="eyebrow" id="skills">
              Skills
            </p>
            <span>{data.skills.length} technologies</span>
          </div>
          <div className="marquee" aria-label="Technology skills">
            <div className="marquee-track">
              {marqueeSkills.map((skill, index) => (
                <div className="skill-pill" key={`${skill.id}-${index}`}>
                  <span>{skill.icon}</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        <BentoCard className="projects-card" delay={440}>
          <div className="section-heading">
            <p className="eyebrow" id="projects">
              Projects
            </p>
            <span>Selected work</span>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project, index) => (
              <article className="project-tile" key={project.id}>
                <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                </div>
                <div className="tag-row">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <ul>
                  {project.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="project-actions">
                  {project.live ? (
                    <a href={project.live}>
                      Live
                      <ArrowIcon />
                    </a>
                  ) : null}
                  {project.github ? (
                    <a href={project.github}>
                      GitHub
                      <ArrowIcon />
                    </a>
                  ) : null}
                  {project.githubBackend ? (
                    <a href={project.githubBackend}>
                      Backend
                      <ArrowIcon />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </BentoCard>
      </div>
    </main>
  );
}
