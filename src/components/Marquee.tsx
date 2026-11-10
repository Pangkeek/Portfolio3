interface MarqueeProps {
  techs: string[]
}

export default function Marquee({ techs }: MarqueeProps) {
  const doubled = [...techs, ...techs]

  return (
    <div className="border-t border-b border-[#1e1e1e] bg-[#111] overflow-hidden py-4">
      <div className="marquee-track flex gap-8 w-max">
        {doubled.map((tech, i) => (
          <div key={i} className="flex items-center gap-4 text-[0.75rem] tracking-[0.1em] uppercase text-[#555] whitespace-nowrap">
            {tech}
            <span className="text-[#c8ff00] text-base">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
