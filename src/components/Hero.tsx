'use client'

import { useEffect, useRef } from 'react'
import type { HeroInfo, MetricItem } from '@/lib/portfolio'

interface HeroProps {
  metrics: MetricItem[]
  heroInfo: HeroInfo
}

function countUp(el: HTMLSpanElement, target: number, duration = 1500) {
  let start = 0
  const step = (timestamp: number) => {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    el.textContent = String(Math.floor(progress * target))
    if (progress < 1) requestAnimationFrame(step)
    else el.textContent = String(target)
  }
  requestAnimationFrame(step)
}

export default function Hero({ metrics, heroInfo }: HeroProps) {
  const statRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-metric-index')
            const idx = indexAttr ? parseInt(indexAttr, 10) : -1
            if (idx >= 0 && metrics[idx]) {
              countUp(entry.target as HTMLSpanElement, metrics[idx].num)
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    statRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [metrics])

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero-grid relative min-h-screen flex items-center px-12 pt-32 pb-16 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto">
        {/* Tag */}
        <div className="fade-up delay-1 inline-flex items-center gap-2 bg-[rgba(200,255,0,0.08)] border border-[rgba(200,255,0,0.2)] px-4 py-1.5 text-[0.7rem] tracking-[0.15em] uppercase text-[#c8ff00] mb-8">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#c8ff00]" />
          {heroInfo.badge}
        </div>

        {/* Title */}
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.04em] mb-10">
          <div className="line-wrap">
            <span className="line-reveal delay-2 relative">{heroInfo.titleLine1}</span>
          </div>
          <div className="line-wrap">
            <span className="line-reveal delay-3">{heroInfo.titleLine2}</span>
          </div>
          <div className="line-wrap">
            <span className="line-reveal delay-5 text-[#c8ff00]">{heroInfo.titleLine3Accent}</span>
          </div>
        </h1>

        {/* Sub */}
        <p className="fade-up delay-4 max-w-lg text-[#555] text-sm leading-[1.8] mb-12">
          {heroInfo.bio}
        </p>

        {/* Actions */}
        <div className="fade-up delay-5 flex flex-wrap gap-4">
          <button
            onClick={() => scrollTo('#projects')}
            className="bg-[#c8ff00] text-[#080808] px-8 py-3.5 text-sm font-bold tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,255,0,0.25)] cursor-none"
          >
            View Projects
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="bg-transparent text-white px-8 py-3.5 text-sm font-bold tracking-wider border border-[#1e1e1e] transition-all hover:border-[#c8ff00] hover:text-[#c8ff00] cursor-none"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up delay-6 hidden lg:flex absolute top-1/2 right-12 -translate-y-1/2 flex-col gap-8">
        {metrics.map((s, i) => (
          <div key={s.id || s.label} className="text-right">
            <div className="font-[family-name:var(--font-display)] text-[2.5rem] font-extrabold leading-none">
              <span
                data-metric-index={i}
                ref={(el) => {
                  statRefs.current[i] = el
                }}
              >
                0
              </span>
            </div>
            <div className="text-[0.65rem] tracking-[0.15em] uppercase text-[#555] mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="fade-up delay-6 absolute bottom-12 right-12 flex flex-col items-center gap-2">
        <div className="scroll-line-anim w-px h-16 bg-gradient-to-b from-[#c8ff00] to-transparent" />
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#555] [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>
    </section>
  )
}
