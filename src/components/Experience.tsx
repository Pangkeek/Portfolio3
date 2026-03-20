import ScrollReveal from './ScrollReveal'

const experiences = [
  {
    date: '2023 — Present',
    role: 'Senior Full Stack Engineer',
    company: 'Vercel — Remote',
    desc: 'Leading frontend infrastructure for Next.js deployment platform. Built edge caching layer processing 50B requests/month, reduced P99 latency by 40%.',
  },
  {
    date: '2021 — 2023',
    role: 'Full Stack Engineer',
    company: 'Stripe — San Francisco, CA',
    desc: 'Developed merchant dashboard and billing infrastructure. Shipped 3 major product features to 1M+ merchants. Owned the reporting pipeline end-to-end.',
  },
  {
    date: '2020 — 2021',
    role: 'Frontend Engineer',
    company: 'Figma — San Francisco, CA',
    desc: 'Built real-time collaboration features for the web editor. Optimized canvas rendering for large documents, improving FPS by 60%.',
  },
  {
    date: '2018 — 2020',
    role: 'Software Engineer Intern → Junior Engineer',
    company: 'Various Startups',
    desc: 'Worked across early-stage B2B SaaS companies, shipping full features independently from ideation to production.',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-12 max-w-screen-xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-4 text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-4 before:content-[''] before:w-8 before:h-px before:bg-[#c8ff00]">
          03 — Journey
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-none mb-12">
          Experience.
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <div className="relative pl-8 border-l border-[#1e1e1e]">
          {experiences.map((exp, i) => (
            <div key={i} className="relative pb-12 last:pb-0 group">
              {/* Timeline dot */}
              <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full border border-[#c8ff00] bg-[#080808] -translate-x-[3.5px] transition-colors duration-300 group-hover:bg-[#c8ff00]" />

              <div className="text-[0.7rem] text-[#c8ff00] tracking-wider uppercase mb-1.5">{exp.date}</div>
              <div className="font-[family-name:var(--font-display)] text-xl font-bold mb-0.5">{exp.role}</div>
              <div className="text-sm text-[#555] mb-3">{exp.company}</div>
              <div className="text-[0.78rem] text-[#888] leading-[1.8] max-w-2xl">{exp.desc}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
