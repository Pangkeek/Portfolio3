import ScrollReveal from './ScrollReveal'

const projects = [
  {
    num: '01',
    name: 'Porta-Kamp',
    desc: 'A corporate website for Porta-Kamp Houston — a company with 70 years pioneering modular and prefabricated structures worldwide. Features service showcases, a project gallery, contact forms with email integration, and fully SEO-optimized pages with a premium forest green and gold design.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Resend', 'Vercel'],
    link: 'https://www.portakamp.com/',
  },
  {
    num: '02',
    name: 'MorseType',
    desc: 'A typing practice app inspired by Monkey Type, but for Morse code. Players tap out Morse sequences and get scored on speed and accuracy. Features real-time performance tracking, player statistics, and a live leaderboard so users can compete and climb the ranks. Fully interactive and responsive across devices.',
    stack: ['Next.js', 'JavaScript', 'Tailwind CSS','Prisma','postgresql','railway'],
    link: 'https://morsecode2.up.railway.app/',
  },
  {
    num: '03',
    name: "Kelly Tarlton's",
    desc: "A landing page for a mobile app featuring immersive scroll-based animations. Designed to showcase the app's features through smooth, cinematic transitions as the user scrolls — giving the page a rich, storytelling feel that mirrors the mobile experience.",
    stack: ['React', 'JavaScript', 'Tailwind CSS','Framer Motion','Github pages'],
    link: 'https://pangkeek.github.io/Kelly_Tarlton.github.io/',
  },
  {
    num: '04',
    name: 'ShopFlow',
    desc: 'A slot machine game with a twist — every spin is tracked. Players can pull the lever and watch the reels, while the app records win rates, spin history, and payout stats in real time. Turns a simple game into a data-driven experience.',
    stack: ['Next.js', 'JavaScript', 'Tailwind CSS','chart.js','vercel'],
    link: 'https://fontend-e-commerce.vercel.app/',
  },
  {
    num: '05',
    name: 'Portfolio',
    desc: 'A personal developer portfolio showcasing projects, skills, and experience. Built with a clean, responsive layout that adapts beautifully across mobile, tablet, and desktop — giving visitors a smooth and professional browsing experience.',
    stack: ['React', 'JavaScript', 'Tailwind CSS'],
    link: 'https://portfolio2-sigma-eight.vercel.app/',
  },
]

export default function Projects() {
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
            <a
              key={p.num}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-item relative grid grid-cols-[auto_1fr_auto] items-center gap-8 bg-[#080808] p-10 transition-colors duration-300 hover:bg-[#111] cursor-none overflow-hidden group no-underline"
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

              <div className="relative z-10 hidden sm:flex w-12 h-12 border border-[#1e1e1e] items-center justify-center text-xl text-[#555] transition-all duration-300 group-hover:border-[#c8ff00] hover:border-[#c8ff00] hover:text-[#c8ff00] hover:rotate-45">
                ↗
              </div>
            </a>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
