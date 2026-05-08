'use client'

import { useState } from 'react'
import ScrollReveal from './ScrollReveal'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormState {
  data: FormData
  isSubmitting: boolean
  submitted: boolean
  error: string | null
}

const links = [
  { icon: '✉', label: 'supawatkhaithong@gmail.com',        href: 'mailto:supawatkhaithong@gmail.com' },
  { icon: '⬡', label: 'github.com/Pangkeek',      href: 'https://github.com/Pangkeek' },
  { icon: '◈', label: 'linkedin.com/in/supawat-khaithong-11bb533b5/', href: 'https://www.linkedin.com/in/supawat-khaithong-11bb533b5/' },
]

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    data: {
      name: '',
      email: '',
      message: ''
    },
    isSubmitting: false,
    submitted: false,
    error: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      },
      error: null // Clear error when user starts typing
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formState.data.name || !formState.data.email || !formState.data.message) {
      setFormState(prev => ({
        ...prev,
        error: 'Please fill in all fields'
      }))
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.data.email)) {
      setFormState(prev => ({
        ...prev,
        error: 'Please enter a valid email address'
      }))
      return
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }))

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState.data),
      })

      const result = await response.json()

      if (response.ok) {
        setFormState({
          data: { name: '', email: '', message: '' },
          isSubmitting: false,
          submitted: true,
          error: null
        })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setFormState(prev => ({ ...prev, submitted: false }))
        }, 5000)
      } else {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          error: result.error || 'Failed to send message'
        }))
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  return (
    <section id="contact" className="py-24 px-12">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-8 before:content-[''] before:w-8 before:h-px before:bg-[#c8ff00]">
            03 — Let&apos;s Talk
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-none mb-6">
              Let&apos;s build<br />something{' '}
              <span className="text-[#c8ff00]">great.</span>
            </h2>
            <p className="text-sm text-[#555] leading-[1.8] mb-8">
              Open to full-time roles, freelance projects, and interesting collabs. I reply within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? "_blank" : undefined}
                  rel={l.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 text-sm text-white px-4 py-4 border border-[#1e1e1e] transition-all duration-300 hover:border-[#c8ff00] hover:text-[#c8ff00] no-underline"
                >
                  <span className="w-5 text-center">{l.icon}</span>
                  {l.label}
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {formState.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm rounded">
                  {formState.error}
                </div>
              )}
              
              {formState.submitted && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm rounded">
                  Message sent successfully! I'll get back to you within 24 hours.
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#555]">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formState.data.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="bg-[#111] border border-[#1e1e1e] text-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8ff00] cursor-none font-[family-name:var(--font-mono)] placeholder:text-[#333]"
                  disabled={formState.isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#555]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formState.data.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  className="bg-[#111] border border-[#1e1e1e] text-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8ff00] cursor-none font-[family-name:var(--font-mono)] placeholder:text-[#333]"
                  disabled={formState.isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#555]">Message</label>
                <textarea
                  name="message"
                  value={formState.data.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="bg-[#111] border border-[#1e1e1e] text-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8ff00] cursor-none font-[family-name:var(--font-mono)] placeholder:text-[#333] resize-vertical"
                  disabled={formState.isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className={`mt-2 py-4 text-sm font-bold tracking-widest border-none transition-all duration-200 cursor-none hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,255,0,0.2)] ${
                  formState.isSubmitting
                    ? 'bg-[#666] text-[#999] cursor-not-allowed'
                    : formState.submitted
                    ? 'bg-[#c8ff00] text-[#080808]'
                    : 'bg-[#c8ff00] text-[#080808]'
                }`}
              >
                {formState.isSubmitting ? 'Sending...' : formState.submitted ? 'Sent! ✓' : 'Send Message →'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
