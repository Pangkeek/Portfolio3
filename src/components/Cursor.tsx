'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
      trail.style.left  = e.clientX + 'px'
      trail.style.top   = e.clientY + 'px'
    }

    document.addEventListener('mousemove', onMove)

    const hoverEls = document.querySelectorAll('button, a, .project-item, .skill-card')
    const onEnter = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)'
      trail.style.transform  = 'translate(-50%,-50%) scale(1.5)'
    }
    const onLeave = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)'
      trail.style.transform  = 'translate(-50%,-50%) scale(1)'
    }

    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={trailRef}  className="cursor-trail" />
    </>
  )
}
