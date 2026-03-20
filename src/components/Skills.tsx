import ScrollReveal from './ScrollReveal'

const skills = [
  {
    icon: '⬡',
    name: 'Frontend Engineering',
    desc: 'Building responsive, accessible UIs with React and Next.js. Crafting smooth interactions with Framer, styling with TailwindCSS, and visualizing data with Chart.js.',
    tags: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'TailwindCSS', 'Framer', 'chart.js'],
  },
  {
    icon: '◈',
    name: 'Backend Systems',
    desc: 'Building RESTful APIs with Node.js and Express, managing relational data through Prisma, and handling document-based storage with Mongoose.',
    tags: ['Node.js', 'Express', 'Prisma', 'Mongoose'],
  },
  {
    icon: '⬢',
    name: 'Data & Databases',
    desc: 'Schema design and query optimization with PostgreSQL for relational data, and MongoDB for flexible, document-oriented storage.',
    tags: ['PostgreSQL', 'MongoDB'],
  },
  {
    icon: '◎',
    name: 'DevOps & Cloud',
    desc: 'Automating workflows with GitHub Actions, hosting static sites on GitHub Pages, deploying frontends on Vercel, and running backend services on Railway.',
    tags: ['Github actions', 'Github pages', 'Vercel', 'Railway'],
  },
  {
    icon: '⬟',
    name: 'Testing & Quality',
    desc: 'Maintaining clean, consistent codebases with ESLint for static analysis and Prettier for unified formatting across every project.',
    tags: ['ESLint', 'Prettier'],
  },
  {
    icon: '◇',
    name: 'Data Science & Machine Learning',
    desc: 'Analyzing and manipulating data with Pandas and NumPy, building and training models with Scikit-learn, TensorFlow, and PyTorch.',
    tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
  },
]

export default function Skills() {
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
          <ScrollReveal key={skill.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
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
