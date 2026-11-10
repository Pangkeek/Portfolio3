import ScrollReveal from './ScrollReveal'
import type { ProjectItem } from '@/lib/portfolio'

interface ProjectsProps {
  projects: ProjectItem[]
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 px-12 max-w-screen-xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-4 text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-4 before:content-[''] before:w-8 before:h-px before:bg-[#c8ff00]">
          02 — Work
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-none mb-12">
          Selected<br />Projects.
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex flex-col gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
          {projects.map((p) => (
            <div
              key={p.id || p.num}
              className="project-item relative grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-8 bg-[#080808] p-10 transition-colors duration-300 hover:bg-[#111] overflow-hidden group"
            >
              <div className="text-[0.7rem] text-[#555] tracking-wider relative z-10">{p.num}</div>

              <div className="relative z-10">
                <div className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight mb-1.5">{p.name}</div>
                <div className="text-[0.75rem] text-[#555] leading-[1.6]">{p.desc}</div>
                <div className="flex gap-3 flex-wrap mt-3">
                  {p.stack.map((t) => (
                    <span key={t} className="text-[0.65rem] text-[#c8ff00] tracking-wider">{t}</span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} GitHub Repository`}
                    title="View GitHub Repository"
                    className="flex w-12 h-12 border border-[#1e1e1e] items-center justify-center text-[#555] transition-all duration-300 group-hover:border-[#333] hover:!border-[#c8ff00] hover:text-[#c8ff00] hover:-translate-y-0.5 cursor-none no-underline"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z" />
                    </svg>
                  </a>
                )}

                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} Live Website`}
                  title="View Live Website"
                  className="flex w-12 h-12 border border-[#1e1e1e] items-center justify-center text-xl text-[#555] transition-all duration-300 group-hover:border-[#c8ff00] hover:!border-[#c8ff00] hover:text-[#c8ff00] hover:rotate-45 cursor-none no-underline"
                >
                  ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
