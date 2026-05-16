"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PortfolioData, Project, Skill, Social } from "@/lib/portfolio";

const emptySkill: Skill = { id: "", name: "", icon: "" };
const emptySocial: Social = { id: "", label: "", url: "" };
const emptyProject: Project = {
  id: "",
  title: "",
  summary: "",
  highlights: [],
  github: "",
  githubBackend: "",
  live: "",
  tags: []
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || crypto.randomUUID()
  );
}

function listToText(list: string[]) {
  return list.join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [status, setStatus] = useState("Loading portfolio data...");
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "skills" | "socials">("projects");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio", { cache: "no-store" })
      .then((response) => response.json())
      .then((portfolio: PortfolioData) => {
        setData(portfolio);
        setStatus("Changes are saved to data/portfolio.json.");
      })
      .catch(() => setStatus("Could not load portfolio data."));
  }, []);

  const counts = useMemo(
    () => ({
      projects: data?.projects.length ?? 0,
      skills: data?.skills.length ?? 0,
      socials: data?.socials.length ?? 0
    }),
    [data]
  );

  async function save() {
    if (!data) return;
    setSaving(true);
    setStatus("Saving...");

    const response = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    setSaving(false);
    setStatus(response.ok ? "Saved. Refresh the portfolio page to see updates." : "Save failed.");
  }

  function updateProject(index: number, project: Project) {
    if (!data) return;
    const projects = data.projects.map((item, itemIndex) => (itemIndex === index ? project : item));
    setData({ ...data, projects });
  }

  function updateSkill(index: number, skill: Skill) {
    if (!data) return;
    const skills = data.skills.map((item, itemIndex) => (itemIndex === index ? skill : item));
    setData({ ...data, skills });
  }

  function updateSocial(index: number, social: Social) {
    if (!data) return;
    const socials = data.socials.map((item, itemIndex) => (itemIndex === index ? social : item));
    setData({ ...data, socials });
  }

  if (!data) {
    return (
      <main className="admin-shell">
        <div className="admin-loading">{status}</div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Portfolio Admin</p>
          <h1>Content manager</h1>
          <p>{status}</p>
        </div>
        <div className="admin-actions">
          <Link href="/">View site</Link>
          <button onClick={save} disabled={saving}>
            {saving ? "Saving" : "Save changes"}
          </button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          Profile
        </button>
        <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>
          Projects <span>{counts.projects}</span>
        </button>
        <button className={activeTab === "skills" ? "active" : ""} onClick={() => setActiveTab("skills")}>
          Skills <span>{counts.skills}</span>
        </button>
        <button className={activeTab === "socials" ? "active" : ""} onClick={() => setActiveTab("socials")}>
          Socials <span>{counts.socials}</span>
        </button>
      </nav>

      {activeTab === "profile" ? (
        <section className="admin-panel">
          <div className="form-grid">
            <label>
              Name
              <input value={data.profile.name} onChange={(event) => setData({ ...data, profile: { ...data.profile, name: event.target.value } })} />
            </label>
            <label>
              Role
              <input value={data.profile.role} onChange={(event) => setData({ ...data, profile: { ...data.profile, role: event.target.value } })} />
            </label>
            <label>
              Location
              <input value={data.profile.location} onChange={(event) => setData({ ...data, profile: { ...data.profile, location: event.target.value } })} />
            </label>
            <label>
              Email
              <input value={data.profile.email} onChange={(event) => setData({ ...data, profile: { ...data.profile, email: event.target.value } })} />
            </label>
            <label className="wide">
              Headline
              <textarea value={data.profile.headline} onChange={(event) => setData({ ...data, profile: { ...data.profile, headline: event.target.value } })} />
            </label>
            <label className="wide">
              About
              <textarea value={data.profile.about} onChange={(event) => setData({ ...data, profile: { ...data.profile, about: event.target.value } })} />
            </label>
          </div>
        </section>
      ) : null}

      {activeTab === "projects" ? (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Projects</h2>
            <button
              onClick={() =>
                setData({
                  ...data,
                  projects: [{ ...emptyProject, id: crypto.randomUUID(), title: "New project" }, ...data.projects]
                })
              }
            >
              Add project
            </button>
          </div>
          <div className="editor-list">
            {data.projects.map((project, index) => (
              <article className="editor-card" key={project.id}>
                <div className="editor-card-head">
                  <strong>{project.title || "Untitled project"}</strong>
                  <button onClick={() => setData({ ...data, projects: data.projects.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
                </div>
                <div className="form-grid">
                  <label>
                    Title
                    <input value={project.title} onChange={(event) => updateProject(index, { ...project, title: event.target.value, id: slugify(event.target.value) })} />
                  </label>
                  <label>
                    Live link
                    <input value={project.live} onChange={(event) => updateProject(index, { ...project, live: event.target.value })} />
                  </label>
                  <label>
                    GitHub frontend
                    <input value={project.github} onChange={(event) => updateProject(index, { ...project, github: event.target.value })} />
                  </label>
                  <label>
                    GitHub backend
                    <input value={project.githubBackend} onChange={(event) => updateProject(index, { ...project, githubBackend: event.target.value })} />
                  </label>
                  <label className="wide">
                    Summary
                    <textarea value={project.summary} onChange={(event) => updateProject(index, { ...project, summary: event.target.value })} />
                  </label>
                  <label className="wide">
                    Tags, comma separated
                    <input value={project.tags.join(", ")} onChange={(event) => updateProject(index, { ...project, tags: csvToList(event.target.value) })} />
                  </label>
                  <label className="wide">
                    Highlights, one per line
                    <textarea value={listToText(project.highlights)} onChange={(event) => updateProject(index, { ...project, highlights: textToList(event.target.value) })} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "skills" ? (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Skills</h2>
            <button onClick={() => setData({ ...data, skills: [{ ...emptySkill, id: crypto.randomUUID(), name: "New skill", icon: "NS" }, ...data.skills] })}>
              Add skill
            </button>
          </div>
          <div className="compact-list">
            {data.skills.map((skill, index) => (
              <div className="compact-row" key={skill.id}>
                <input value={skill.icon} aria-label="Skill icon" onChange={(event) => updateSkill(index, { ...skill, icon: event.target.value })} />
                <input value={skill.name} aria-label="Skill name" onChange={(event) => updateSkill(index, { ...skill, name: event.target.value, id: slugify(event.target.value) })} />
                <button onClick={() => setData({ ...data, skills: data.skills.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "socials" ? (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Social links</h2>
            <button onClick={() => setData({ ...data, socials: [{ ...emptySocial, id: crypto.randomUUID(), label: "New link" }, ...data.socials] })}>
              Add social
            </button>
          </div>
          <div className="compact-list">
            {data.socials.map((social, index) => (
              <div className="compact-row social-row" key={social.id}>
                <input value={social.label} aria-label="Social label" onChange={(event) => updateSocial(index, { ...social, label: event.target.value, id: slugify(event.target.value) })} />
                <input value={social.url} aria-label="Social URL" onChange={(event) => updateSocial(index, { ...social, url: event.target.value })} />
                <button onClick={() => setData({ ...data, socials: data.socials.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
