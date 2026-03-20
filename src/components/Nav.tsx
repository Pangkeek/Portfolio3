'use client'

export default function Nav() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav-anim fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 border-b border-[#1e1e1e] bg-[rgba(8,8,8,0.85)] backdrop-blur-xl">
      <div className="font-[family-name:var(--font-display)] font-extrabold text-lg tracking-tight text-[#c8ff00]">
        JEEP.
      </div>

      <ul className="hidden md:flex gap-8 list-none">
        {['#skills', '#projects', '#contact'].map((href) => (
          <li key={href}>
            <button
              onClick={() => scrollTo(href)}
              className="relative text-[#555] text-xs tracking-widest uppercase transition-colors hover:text-white group cursor-none bg-transparent border-none"
            >
              {href.replace('#', '')}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c8ff00] transition-all duration-300 group-hover:w-full" />
            </button>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => scrollTo('#contact')}
        className="bg-[#c8ff00] text-[#080808] px-5 py-2 text-xs font-bold tracking-wider transition-transform hover:scale-105 cursor-none"
      >
        Hire Me
      </button>
    </nav>
  )
}
