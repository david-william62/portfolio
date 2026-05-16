import { promises as fs } from "fs";
import path from "path";

export type Skill = {
  id: string;
  name: string;
  icon: string;
};

export type Social = {
  id: string;
  label: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  github: string;
  githubBackend: string;
  live: string;
  tags: string[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  about: string;
};

export type PortfolioData = {
  profile: Profile;
  skills: Skill[];
  socials: Social[];
  projects: Project[];
};

const dataPath = path.join(process.cwd(), "data", "portfolio.json");

export async function getPortfolio(): Promise<PortfolioData> {
  const file = await fs.readFile(dataPath, "utf8");
  return JSON.parse(file) as PortfolioData;
}

export async function savePortfolio(data: PortfolioData) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || crypto.randomUUID();
}
