import ScrollReveal from './ScrollReveal'
import type { SkillItem } from '@/lib/portfolio'

interface SkillsProps {
  skills: SkillItem[]
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-24 px-12 max-w-screen-xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-4 text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-4 before:content-[''] before:w-8 before:h-px before:bg-[#c8ff00]">
          01 — Capabilities
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-none mb-12">
          What I<br />Build.
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
        {skills.map((skill, i) => (
          <ScrollReveal key={`${skill.name}-${i}`} delay={((i % 3) + 1) as 1 | 2 | 3}>
            <div className="skill-card relative bg-[#080808] p-8 transition-colors duration-300 hover:bg-[#111] group h-full">
              <div className="text-2xl mb-4">{skill.icon}</div>
              <div className="font-[family-name:var(--font-display)] text-lg font-bold mb-2">{skill.name}</div>
              <div className="text-[0.75rem] text-[#555] leading-[1.7] mb-4">{skill.desc}</div>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/[0.04] border border-[#1e1e1e] px-2.5 py-0.5 text-[0.65rem] text-[#555] tracking-wider transition-all duration-200 group-hover:border-[rgba(200,255,0,0.2)] group-hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
