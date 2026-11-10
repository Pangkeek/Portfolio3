import fs from 'fs/promises'
import path from 'path'

export interface MetricItem {
  id: string
  num: number
  label: string
}

export interface HeroInfo {
  badge: string
  titleLine1: string
  titleLine2: string
  titleLine3Accent: string
  bio: string
}

export interface SkillItem {
  icon: string
  name: string
  desc: string
  tags: string[]
}

export interface ContactLink {
  icon: string
  label: string
  href: string
}

export interface ContactInfo {
  headingLine1: string
  headingLine2: string
  headingAccent: string
  description: string
  links: ContactLink[]
}

export interface FooterInfo {
  copyright: string
}

export interface PortfolioInfo {
  hero: HeroInfo
  marquee: string[]
  skills: SkillItem[]
  contact: ContactInfo
  footer: FooterInfo
}

export interface ProjectItem {
  id: string
  num: string
  name: string
  desc: string
  stack: string[]
  link: string
  github?: string
}

export interface PortfolioData {
  metrics: MetricItem[]
  info: PortfolioInfo
  projects: ProjectItem[]
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'portfolio.json')

const SAFE_URL_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:']

export function sanitizeUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim()
  if (!trimmed) return '#'
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed
  }
  try {
    const parsed = new URL(trimmed)
    if (SAFE_URL_PROTOCOLS.includes(parsed.protocol)) {
      return trimmed
    }
    return '#'
  } catch {
    return '#'
  }
}

export function sanitizePortfolioData(input: PortfolioData): PortfolioData {
  const metrics: MetricItem[] = Array.isArray(input.metrics)
    ? input.metrics.map((m, idx) => ({
        id: String(m.id || `metric-${idx + 1}`).slice(0, 64),
        num: Number.isFinite(Number(m.num)) ? Math.max(0, Math.floor(Number(m.num))) : 0,
        label: String(m.label || '').trim().slice(0, 80),
      }))
    : []

  const hero: HeroInfo = {
    badge: String(input.info?.hero?.badge ?? '').trim().slice(0, 120),
    titleLine1: String(input.info?.hero?.titleLine1 ?? '').trim().slice(0, 80),
    titleLine2: String(input.info?.hero?.titleLine2 ?? '').trim().slice(0, 80),
    titleLine3Accent: String(input.info?.hero?.titleLine3Accent ?? '').trim().slice(0, 80),
    bio: String(input.info?.hero?.bio ?? '').trim().slice(0, 1000),
  }

  const marquee: string[] = Array.isArray(input.info?.marquee)
    ? input.info.marquee
        .map((t) => String(t || '').trim().slice(0, 60))
        .filter(Boolean)
    : []

  const skills: SkillItem[] = Array.isArray(input.info?.skills)
    ? input.info.skills.map((s) => ({
        icon: String(s.icon || '⬡').trim().slice(0, 10),
        name: String(s.name || '').trim().slice(0, 100),
        desc: String(s.desc || '').trim().slice(0, 600),
        tags: Array.isArray(s.tags)
          ? s.tags.map((t) => String(t || '').trim().slice(0, 50)).filter(Boolean)
          : [],
      }))
    : []

  const contact: ContactInfo = {
    headingLine1: String(input.info?.contact?.headingLine1 ?? "Let's build").trim().slice(0, 80),
    headingLine2: String(input.info?.contact?.headingLine2 ?? 'something').trim().slice(0, 80),
    headingAccent: String(input.info?.contact?.headingAccent ?? 'great.').trim().slice(0, 80),
    description: String(input.info?.contact?.description ?? '').trim().slice(0, 500),
    links: Array.isArray(input.info?.contact?.links)
      ? input.info.contact.links.map((l) => ({
          icon: String(l.icon || '◈').trim().slice(0, 10),
          label: String(l.label || '').trim().slice(0, 150),
          href: sanitizeUrl(String(l.href || '')),
        }))
      : [],
  }

  const footer: FooterInfo = {
    copyright: String(input.info?.footer?.copyright ?? '').trim().slice(0, 200),
  }

  const projects: ProjectItem[] = Array.isArray(input.projects)
    ? input.projects.map((p, index) => {
        const rawGithub = String(p.github || '').trim()
        return {
          id: String(p.id || `proj-${index + 1}`).slice(0, 64),
          num: String(index + 1).padStart(2, '0'),
          name: String(p.name || '').trim().slice(0, 120),
          desc: String(p.desc || '').trim().slice(0, 1000),
          stack: Array.isArray(p.stack)
            ? p.stack.map((t) => String(t || '').trim().slice(0, 50)).filter(Boolean)
            : [],
          link: sanitizeUrl(String(p.link || '')),
          github: rawGithub ? sanitizeUrl(rawGithub) : '',
        }
      })
    : []

  return {
    metrics,
    info: {
      hero,
      marquee,
      skills,
      contact,
      footer,
    },
    projects,
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8')
  const parsed = JSON.parse(raw) as PortfolioData
  return sanitizePortfolioData(parsed)
}

export async function savePortfolioData(data: PortfolioData): Promise<PortfolioData> {
  const sanitized = sanitizePortfolioData(data)
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(sanitized, null, 2) + '\n', 'utf-8')
  return sanitized
}
