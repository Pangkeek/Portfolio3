'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type {
  PortfolioData,
  MetricItem,
  ProjectItem,
  SkillItem,
  ContactLink,
} from '@/lib/portfolio'

type ActiveTab = 'metrics' | 'info' | 'projects'
type InfoSubTab = 'hero' | 'contact' | 'marquee' | 'skills'

export default function AdminDashboardPage() {
  const [authLoading, setAuthLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [adminEnabled, setAdminEnabled] = useState(true)
  const [disabledReason, setDisabledReason] = useState<string | null>(null)

  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)

  const [data, setData] = useState<PortfolioData | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [activeTab, setActiveTab] = useState<ActiveTab>('metrics')
  const [infoSubTab, setInfoSubTab] = useState<InfoSubTab>('hero')

  // Temp inputs for tag additions
  const [newMarqueeInput, setNewMarqueeInput] = useState('')
  const [skillTagInputs, setSkillTagInputs] = useState<Record<number, string>>({})
  const [projectStackInputs, setProjectStackInputs] = useState<Record<number, string>>({})

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 4000)
  }, [])

  const fetchPortfolio = useCallback(async () => {
    setLoadingData(true)
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load portfolio data')
      const json = (await res.json()) as PortfolioData
      setData(json)
      setIsDirty(false)
    } catch {
      showToast('error', 'Failed to load portfolio data.')
    } finally {
      setLoadingData(false)
    }
  }, [showToast])

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth', { cache: 'no-store' })
        const json = await res.json()
        setAdminEnabled(json.enabled !== false)
        setDisabledReason(json.reason || null)
        setAuthenticated(Boolean(json.authenticated))
        if (json.authenticated) {
          await fetchPortfolio()
        }
      } catch {
        setAuthError('Could not verify authentication status.')
      } finally {
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [fetchPortfolio])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoggingIn(true)
    setAuthError(null)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setAuthError(json.error || 'Authentication failed.')
      } else {
        setAuthenticated(true)
        setPassword('')
        await fetchPortfolio()
      }
    } catch {
      setAuthError('Network error while logging in.')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
    setData(null)
  }

  const handleSave = useCallback(async () => {
    if (!data || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast('error', json.error || 'Failed to save changes.')
        if (res.status === 401) setAuthenticated(false)
      } else {
        setData(json as PortfolioData)
        setIsDirty(false)
        showToast('success', 'Portfolio updated & published live!')
      }
    } catch {
      showToast('error', 'Network error while saving changes.')
    } finally {
      setSaving(false)
    }
  }, [data, saving, showToast])

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        if (authenticated && data) {
          e.preventDefault()
          handleSave()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [authenticated, data, handleSave])

  const updateData = (updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      return next
    })
    setIsDirty(true)
  }

  // ---- Metrics Helpers ----
  const updateMetric = (index: number, patch: Partial<MetricItem>) => {
    updateData((prev) => {
      const metrics = [...prev.metrics]
      metrics[index] = { ...metrics[index], ...patch }
      return { ...prev, metrics }
    })
  }

  const addMetric = () => {
    updateData((prev) => ({
      ...prev,
      metrics: [
        ...prev.metrics,
        { id: `metric-${Date.now()}`, num: 1, label: 'New Metric' },
      ],
    }))
  }

  const removeMetric = (index: number) => {
    updateData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }))
  }

  const moveMetric = (index: number, direction: -1 | 1) => {
    updateData((prev) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= prev.metrics.length) return prev
      const metrics = [...prev.metrics]
      const [item] = metrics.splice(index, 1)
      metrics.splice(nextIndex, 0, item)
      return { ...prev, metrics }
    })
  }

  // ---- Info Helpers ----
  const addContactLink = () => {
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        contact: {
          ...prev.info.contact,
          links: [
            ...prev.info.contact.links,
            { icon: '◈', label: 'example.com/profile', href: 'https://example.com' },
          ],
        },
      },
    }))
  }

  const updateContactLink = (index: number, patch: Partial<ContactLink>) => {
    updateData((prev) => {
      const links = [...prev.info.contact.links]
      links[index] = { ...links[index], ...patch }
      return {
        ...prev,
        info: {
          ...prev.info,
          contact: { ...prev.info.contact, links },
        },
      }
    })
  }

  const removeContactLink = (index: number) => {
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        contact: {
          ...prev.info.contact,
          links: prev.info.contact.links.filter((_, i) => i !== index),
        },
      },
    }))
  }

  const addMarqueeTech = () => {
    const val = newMarqueeInput.trim()
    if (!val) return
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        marquee: [...prev.info.marquee, val],
      },
    }))
    setNewMarqueeInput('')
  }

  const removeMarqueeTech = (index: number) => {
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        marquee: prev.info.marquee.filter((_, i) => i !== index),
      },
    }))
  }

  const addSkillCard = () => {
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        skills: [
          ...prev.info.skills,
          {
            icon: '⬡',
            name: 'New Capability',
            desc: 'Describe what you build and the tools you use.',
            tags: ['TypeScript'],
          },
        ],
      },
    }))
  }

  const updateSkillCard = (index: number, patch: Partial<SkillItem>) => {
    updateData((prev) => {
      const skills = [...prev.info.skills]
      skills[index] = { ...skills[index], ...patch }
      return {
        ...prev,
        info: { ...prev.info, skills },
      }
    })
  }

  const removeSkillCard = (index: number) => {
    updateData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        skills: prev.info.skills.filter((_, i) => i !== index),
      },
    }))
  }

  const moveSkillCard = (index: number, direction: -1 | 1) => {
    updateData((prev) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= prev.info.skills.length) return prev
      const skills = [...prev.info.skills]
      const [item] = skills.splice(index, 1)
      skills.splice(nextIndex, 0, item)
      return {
        ...prev,
        info: { ...prev.info, skills },
      }
    })
  }

  const addSkillTag = (skillIndex: number) => {
    const raw = (skillTagInputs[skillIndex] || '').trim()
    if (!raw) return
    updateData((prev) => {
      const skills = [...prev.info.skills]
      const current = skills[skillIndex]
      const newTags = raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      skills[skillIndex] = {
        ...current,
        tags: [...current.tags, ...newTags],
      }
      return { ...prev, info: { ...prev.info, skills } }
    })
    setSkillTagInputs((prev) => ({ ...prev, [skillIndex]: '' }))
  }

  const removeSkillTag = (skillIndex: number, tagIndex: number) => {
    updateData((prev) => {
      const skills = [...prev.info.skills]
      skills[skillIndex] = {
        ...skills[skillIndex],
        tags: skills[skillIndex].tags.filter((_, i) => i !== tagIndex),
      }
      return { ...prev, info: { ...prev.info, skills } }
    })
  }

  // ---- Projects Helpers ----
  const renumberProjects = (projects: ProjectItem[]): ProjectItem[] =>
    projects.map((p, idx) => ({
      ...p,
      num: String(idx + 1).padStart(2, '0'),
    }))

  const addProject = () => {
    updateData((prev) => {
      const nextProjects = renumberProjects([
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          num: String(prev.projects.length + 1).padStart(2, '0'),
          name: 'New Project',
          desc: 'Describe the project, key features, and impact.',
          stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          link: 'https://example.com',
          github: 'https://github.com/Pangkeek',
        },
      ])
      return { ...prev, projects: nextProjects }
    })
  }

  const updateProject = (index: number, patch: Partial<ProjectItem>) => {
    updateData((prev) => {
      const projects = [...prev.projects]
      projects[index] = { ...projects[index], ...patch }
      return { ...prev, projects: renumberProjects(projects) }
    })
  }

  const removeProject = (index: number) => {
    updateData((prev) => ({
      ...prev,
      projects: renumberProjects(prev.projects.filter((_, i) => i !== index)),
    }))
  }

  const moveProject = (index: number, direction: -1 | 1) => {
    updateData((prev) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= prev.projects.length) return prev
      const projects = [...prev.projects]
      const [item] = projects.splice(index, 1)
      projects.splice(nextIndex, 0, item)
      return { ...prev, projects: renumberProjects(projects) }
    })
  }

  const addProjectStackTag = (projIndex: number) => {
    const raw = (projectStackInputs[projIndex] || '').trim()
    if (!raw) return
    updateData((prev) => {
      const projects = [...prev.projects]
      const newTags = raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      projects[projIndex] = {
        ...projects[projIndex],
        stack: [...projects[projIndex].stack, ...newTags],
      }
      return { ...prev, projects }
    })
    setProjectStackInputs((prev) => ({ ...prev, [projIndex]: '' }))
  }

  const removeProjectStackTag = (projIndex: number, tagIndex: number) => {
    updateData((prev) => {
      const projects = [...prev.projects]
      projects[projIndex] = {
        ...projects[projIndex],
        stack: projects[projIndex].stack.filter((_, i) => i !== tagIndex),
      }
      return { ...prev, projects }
    })
  }

  if (authLoading) {
    return (
      <div className="admin-cursor min-h-screen bg-[#080808] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-xs tracking-[0.25em] uppercase text-[#c8ff00] animate-pulse">
          Initializing Admin Console...
        </div>
      </div>
    )
  }

  if (!adminEnabled) {
    return (
      <div className="admin-cursor min-h-screen bg-[#080808] text-[#f0f0f0] flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-[#1e1e1e] bg-[#0d0d0d] p-8">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[#ff4d6d] mb-3">
            Security Lock Active
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mb-3">
            Admin Console Disabled
          </h1>
          <p className="text-xs text-[#888] leading-relaxed mb-6">
            {disabledReason ||
              'Admin dashboard is restricted in this environment for your security.'}
          </p>
          <Link
            href="/"
            className="inline-block bg-[#c8ff00] text-[#080808] px-5 py-2.5 text-xs font-bold tracking-wider uppercase no-underline"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="admin-cursor min-h-screen bg-[#080808] text-[#f0f0f0] flex items-center justify-center p-6 hero-grid">
        <div className="max-w-md w-full border border-[#1e1e1e] bg-[#0c0c0c] p-10 relative">
          <div className="inline-flex items-center gap-2 bg-[rgba(200,255,0,0.08)] border border-[rgba(200,255,0,0.2)] px-3 py-1 text-[0.65rem] tracking-[0.18em] uppercase text-[#c8ff00] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]" />
            Protected Route
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight mb-2">
            PANGKI <span className="text-[#c8ff00]">ADMIN.</span>
          </h1>
          <p className="text-xs text-[#666] leading-relaxed mb-8">
            Enter your <code className="text-[#aaa]">ADMIN_PASSWORD</code> from{' '}
            <code className="text-[#aaa]">.env.local</code> to manage metrics, profile info, and projects.
          </p>

          {authError && (
            <div className="mb-6 bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 text-[#ff4d6d] px-4 py-3 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                autoFocus
                className="w-full bg-[#111] border border-[#1e1e1e] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-2 bg-[#c8ff00] text-[#080808] py-3.5 text-xs font-bold tracking-[0.15em] uppercase transition-all hover:shadow-[0_8px_24px_rgba(200,255,0,0.2)] disabled:opacity-50"
            >
              {loggingIn ? 'Verifying...' : 'Unlock Dashboard →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e1e1e] flex justify-between items-center">
            <Link
              href="/"
              className="text-[0.7rem] text-[#666] hover:text-[#c8ff00] no-underline tracking-wider uppercase"
            >
              ← Return to Public Site
            </Link>
            <span className="text-[0.65rem] text-[#444]">HMAC-SHA256 Protected</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-cursor min-h-screen bg-[#080808] text-[#f0f0f0] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#080808]/90 backdrop-blur-xl px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="font-[family-name:var(--font-display)] font-extrabold text-lg tracking-tight">
            PANGKI<span className="text-[#c8ff00]">.ADMIN</span>
          </div>
          <span
            className={`text-[0.65rem] px-2.5 py-0.5 border tracking-widest uppercase ${
              isDirty
                ? 'border-[#ff4d6d]/40 bg-[#ff4d6d]/10 text-[#ff4d6d]'
                : 'border-[#c8ff00]/30 bg-[#c8ff00]/10 text-[#c8ff00]'
            }`}
          >
            {isDirty ? '● Unsaved Changes' : '✓ Synced'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="border border-[#1e1e1e] bg-[#111] hover:border-[#c8ff00] text-white px-4 py-2 text-xs tracking-wider uppercase no-underline transition-colors"
          >
            View Live Site ↗
          </Link>

          <button
            onClick={handleSave}
            disabled={saving || !data}
            className="bg-[#c8ff00] text-[#080808] px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_6px_20px_rgba(200,255,0,0.25)] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes (Ctrl+S)'}
          </button>

          <button
            onClick={handleLogout}
            className="border border-[#1e1e1e] bg-transparent hover:border-[#ff4d6d] hover:text-[#ff4d6d] text-[#777] px-3.5 py-2 text-xs tracking-wider uppercase transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 border text-xs tracking-wider uppercase shadow-2xl transition-all ${
            toast.type === 'success'
              ? 'bg-[#0f1a00] border-[#c8ff00] text-[#c8ff00]'
              : 'bg-[#1f090d] border-[#ff4d6d] text-[#ff4d6d]'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-10">
        {/* Main Section Switcher Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#1e1e1e] pb-6 mb-10">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-3 text-xs font-bold tracking-[0.18em] uppercase border transition-all ${
              activeTab === 'metrics'
                ? 'bg-[#c8ff00] text-[#080808] border-[#c8ff00]'
                : 'bg-[#111] text-[#888] border-[#1e1e1e] hover:border-[#444] hover:text-white'
            }`}
          >
            01 — Metrics ({data?.metrics.length ?? 0})
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 text-xs font-bold tracking-[0.18em] uppercase border transition-all ${
              activeTab === 'info'
                ? 'bg-[#c8ff00] text-[#080808] border-[#c8ff00]'
                : 'bg-[#111] text-[#888] border-[#1e1e1e] hover:border-[#444] hover:text-white'
            }`}
          >
            02 — Info (Hero / Contact / Skills)
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 text-xs font-bold tracking-[0.18em] uppercase border transition-all ${
              activeTab === 'projects'
                ? 'bg-[#c8ff00] text-[#080808] border-[#c8ff00]'
                : 'bg-[#111] text-[#888] border-[#1e1e1e] hover:border-[#444] hover:text-white'
            }`}
          >
            03 — Projects ({data?.projects.length ?? 0})
          </button>
        </div>

        {loadingData || !data ? (
          <div className="py-20 text-center text-xs tracking-widest uppercase text-[#666]">
            Loading portfolio data...
          </div>
        ) : (
          <>
            {/* ==================== TAB 1: METRICS ==================== */}
            {activeTab === 'metrics' && (
              <div className="space-y-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-1">
                      Hero Section Counters
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold">
                      Manage Metrics.
                    </h2>
                  </div>
                  <button
                    onClick={addMetric}
                    className="bg-[#c8ff00] text-[#080808] px-5 py-2.5 text-xs font-bold tracking-wider uppercase"
                  >
                    + Add Metric
                  </button>
                </div>

                {/* Live Preview Strip */}
                <div className="border border-[#1e1e1e] bg-[#0c0c0c] p-6">
                  <div className="text-[0.65rem] tracking-[0.18em] uppercase text-[#555] mb-4">
                    Live Preview
                  </div>
                  <div className="flex flex-wrap gap-12">
                    {data.metrics.map((m) => (
                      <div key={m.id}>
                        <div className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-white">
                          {m.num}
                        </div>
                        <div className="text-[0.65rem] tracking-[0.15em] uppercase text-[#c8ff00] mt-1">
                          {m.label || 'Untitled'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metric Editors */}
                <div className="space-y-4">
                  {data.metrics.map((metric, idx) => (
                    <div
                      key={metric.id}
                      className="grid grid-cols-1 md:grid-cols-[auto_160px_1fr_auto] items-center gap-4 border border-[#1e1e1e] bg-[#0d0d0d] p-5"
                    >
                      <div className="text-xs text-[#555] font-bold px-2">
                        #{String(idx + 1).padStart(2, '0')}
                      </div>

                      <div>
                        <label className="block text-[0.6rem] tracking-[0.15em] uppercase text-[#666] mb-1">
                          Count / Value
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={metric.num}
                          onChange={(e) =>
                            updateMetric(idx, { num: Math.max(0, parseInt(e.target.value || '0', 10)) })
                          }
                          className="w-full bg-[#141414] border border-[#222] text-white px-3 py-2 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.6rem] tracking-[0.15em] uppercase text-[#666] mb-1">
                          Metric Label
                        </label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(idx, { label: e.target.value })}
                          placeholder="e.g. Projects"
                          className="w-full bg-[#141414] border border-[#222] text-white px-3 py-2 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-4 md:pt-0">
                        <button
                          type="button"
                          onClick={() => moveMetric(idx, -1)}
                          disabled={idx === 0}
                          title="Move Up"
                          className="border border-[#222] bg-[#141414] hover:border-[#c8ff00] text-xs px-3 py-2 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMetric(idx, 1)}
                          disabled={idx === data.metrics.length - 1}
                          title="Move Down"
                          className="border border-[#222] bg-[#141414] hover:border-[#c8ff00] text-xs px-3 py-2 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMetric(idx)}
                          title="Delete Metric"
                          className="border border-[#222] bg-[#141414] hover:border-[#ff4d6d] hover:text-[#ff4d6d] text-xs px-3 py-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB 2: INFO ==================== */}
            {activeTab === 'info' && (
              <div className="space-y-8">
                <div>
                  <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-1">
                    Profile, Capabilities & Contact
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold mb-6">
                    Manage Info.
                  </h2>

                  {/* Sub-navigation for Info */}
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: 'hero', label: 'Hero & Footer' },
                        { id: 'contact', label: 'Contact & Social Links' },
                        { id: 'marquee', label: `Tech Marquee (${data.info.marquee.length})` },
                        { id: 'skills', label: `Skills Cards (${data.info.skills.length})` },
                      ] as { id: InfoSubTab; label: string }[]
                    ).map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setInfoSubTab(sub.id)}
                        className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
                          infoSubTab === sub.id
                            ? 'border-[#c8ff00] bg-[#c8ff00]/10 text-[#c8ff00]'
                            : 'border-[#1e1e1e] bg-[#111] text-[#777] hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-tab: Hero & Footer */}
                {infoSubTab === 'hero' && (
                  <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 md:p-8 space-y-6">
                    <div>
                      <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                        Availability Status Badge
                      </label>
                      <input
                        type="text"
                        value={data.info.hero.badge}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              hero: { ...prev.info.hero, badge: e.target.value },
                            },
                          }))
                        }
                        className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                          Headline Line 1
                        </label>
                        <input
                          type="text"
                          value={data.info.hero.titleLine1}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                hero: { ...prev.info.hero, titleLine1: e.target.value },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                          Headline Line 2
                        </label>
                        <input
                          type="text"
                          value={data.info.hero.titleLine2}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                hero: { ...prev.info.hero, titleLine2: e.target.value },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#c8ff00] mb-2">
                          Headline Line 3 (Neon Accent)
                        </label>
                        <input
                          type="text"
                          value={data.info.hero.titleLine3Accent}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                hero: { ...prev.info.hero, titleLine3Accent: e.target.value },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-[#c8ff00] px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                        Bio / Introduction Paragraph
                      </label>
                      <textarea
                        rows={4}
                        value={data.info.hero.bio}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              hero: { ...prev.info.hero, bio: e.target.value },
                            },
                          }))
                        }
                        className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#1e1e1e]">
                      <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                        Footer Copyright Text
                      </label>
                      <input
                        type="text"
                        value={data.info.footer.copyright}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              footer: { copyright: e.target.value },
                            },
                          }))
                        }
                        className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-tab: Contact & Social Links */}
                {infoSubTab === 'contact' && (
                  <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                          Contact Heading Line 1
                        </label>
                        <input
                          type="text"
                          value={data.info.contact.headingLine1}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                contact: {
                                  ...prev.info.contact,
                                  headingLine1: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                          Contact Heading Line 2
                        </label>
                        <input
                          type="text"
                          value={data.info.contact.headingLine2}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                contact: {
                                  ...prev.info.contact,
                                  headingLine2: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#c8ff00] mb-2">
                          Heading Accent Word
                        </label>
                        <input
                          type="text"
                          value={data.info.contact.headingAccent}
                          onChange={(e) =>
                            updateData((prev) => ({
                              ...prev,
                              info: {
                                ...prev.info,
                                contact: {
                                  ...prev.info.contact,
                                  headingAccent: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full bg-[#141414] border border-[#222] text-[#c8ff00] px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                        Contact Pitch / Availability Description
                      </label>
                      <textarea
                        rows={2}
                        value={data.info.contact.description}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              contact: {
                                ...prev.info.contact,
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 text-sm outline-none focus:border-[#c8ff00]"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#1e1e1e] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-[#c8ff00]">
                          Social & Contact Links
                        </span>
                        <button
                          type="button"
                          onClick={addContactLink}
                          className="bg-[#c8ff00] text-[#080808] px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          + Add Link
                        </button>
                      </div>

                      {data.info.contact.links.map((link, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_auto] gap-3 items-center bg-[#121212] border border-[#1e1e1e] p-4"
                        >
                          <div>
                            <label className="block text-[0.6rem] uppercase text-[#555] mb-1">
                              Icon
                            </label>
                            <input
                              type="text"
                              value={link.icon}
                              onChange={(e) => updateContactLink(idx, { icon: e.target.value })}
                              className="w-full bg-[#090909] border border-[#222] text-white px-3 py-2 text-sm text-center outline-none focus:border-[#c8ff00]"
                            />
                          </div>

                          <div>
                            <label className="block text-[0.6rem] uppercase text-[#555] mb-1">
                              Display Label
                            </label>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateContactLink(idx, { label: e.target.value })}
                              className="w-full bg-[#090909] border border-[#222] text-white px-3 py-2 text-sm outline-none focus:border-[#c8ff00]"
                            />
                          </div>

                          <div>
                            <label className="block text-[0.6rem] uppercase text-[#555] mb-1">
                              URL (https:// or mailto:)
                            </label>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateContactLink(idx, { href: e.target.value })}
                              className="w-full bg-[#090909] border border-[#222] text-white px-3 py-2 text-sm outline-none focus:border-[#c8ff00]"
                            />
                          </div>

                          <div className="pt-4 md:pt-0">
                            <button
                              type="button"
                              onClick={() => removeContactLink(idx)}
                              className="border border-[#222] bg-[#090909] hover:border-[#ff4d6d] hover:text-[#ff4d6d] px-3 py-2 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab: Marquee */}
                {infoSubTab === 'marquee' && (
                  <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 md:p-8 space-y-6">
                    <div>
                      <div className="text-xs text-[#888] mb-4">
                        Manage the scrolling technology banner displayed below the Hero section.
                      </div>
                      <div className="flex gap-2 max-w-md">
                        <input
                          type="text"
                          value={newMarqueeInput}
                          onChange={(e) => setNewMarqueeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addMarqueeTech()
                            }
                          }}
                          placeholder="Add tech (e.g. Docker, GraphQL)..."
                          className="flex-1 bg-[#141414] border border-[#222] text-white px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]"
                        />
                        <button
                          type="button"
                          onClick={addMarqueeTech}
                          className="bg-[#c8ff00] text-[#080808] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {data.info.marquee.map((tech, idx) => (
                        <span
                          key={`${tech}-${idx}`}
                          className="inline-flex items-center gap-2 bg-[#141414] border border-[#252525] px-3.5 py-1.5 text-xs text-white"
                        >
                          <span className="text-[#c8ff00]">✦</span>
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeMarqueeTech(idx)}
                            className="text-[#666] hover:text-[#ff4d6d] ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab: Skills Cards */}
                {infoSubTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#888]">
                        Edit the capability cards shown in the &ldquo;01 — Capabilities / What I Build&rdquo; section.
                      </span>
                      <button
                        type="button"
                        onClick={addSkillCard}
                        className="bg-[#c8ff00] text-[#080808] px-4 py-2 text-xs font-bold uppercase tracking-wider"
                      >
                        + Add Skill Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {data.info.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 flex flex-col gap-4"
                        >
                          <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3">
                            <span className="text-xs text-[#c8ff00] tracking-widest uppercase">
                              Skill Card #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => moveSkillCard(idx, -1)}
                                disabled={idx === 0}
                                className="border border-[#222] bg-[#141414] px-2.5 py-1 text-xs hover:border-[#c8ff00] disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSkillCard(idx, 1)}
                                disabled={idx === data.info.skills.length - 1}
                                className="border border-[#222] bg-[#141414] px-2.5 py-1 text-xs hover:border-[#c8ff00] disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSkillCard(idx)}
                                className="border border-[#222] bg-[#141414] px-2.5 py-1 text-xs hover:border-[#ff4d6d] hover:text-[#ff4d6d]"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-[72px_1fr] gap-3">
                            <div>
                              <label className="block text-[0.6rem] uppercase text-[#666] mb-1">
                                Icon
                              </label>
                              <input
                                type="text"
                                value={skill.icon}
                                onChange={(e) => updateSkillCard(idx, { icon: e.target.value })}
                                className="w-full bg-[#141414] border border-[#222] text-white px-3 py-2 text-center text-base outline-none focus:border-[#c8ff00]"
                              />
                            </div>
                            <div>
                              <label className="block text-[0.6rem] uppercase text-[#666] mb-1">
                                Capability Title
                              </label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkillCard(idx, { name: e.target.value })}
                                className="w-full bg-[#141414] border border-[#222] text-white px-3 py-2 text-sm outline-none focus:border-[#c8ff00]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[0.6rem] uppercase text-[#666] mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={skill.desc}
                              onChange={(e) => updateSkillCard(idx, { desc: e.target.value })}
                              className="w-full bg-[#141414] border border-[#222] text-white px-3 py-2 text-xs leading-relaxed outline-none focus:border-[#c8ff00]"
                            />
                          </div>

                          <div>
                            <label className="block text-[0.6rem] uppercase text-[#666] mb-2">
                              Tags
                            </label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {skill.tags.map((tag, tIdx) => (
                                <span
                                  key={`${tag}-${tIdx}`}
                                  className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#262626] px-2.5 py-1 text-[0.68rem] text-[#ccc]"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeSkillTag(idx, tIdx)}
                                    className="text-[#666] hover:text-[#ff4d6d]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={skillTagInputs[idx] || ''}
                                onChange={(e) =>
                                  setSkillTagInputs((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addSkillTag(idx)
                                  }
                                }}
                                placeholder="Add tag (press Enter)..."
                                className="flex-1 bg-[#141414] border border-[#222] text-white px-3 py-1.5 text-xs outline-none focus:border-[#c8ff00]"
                              />
                              <button
                                type="button"
                                onClick={() => addSkillTag(idx)}
                                className="border border-[#c8ff00] text-[#c8ff00] px-3 py-1.5 text-xs uppercase hover:bg-[#c8ff00] hover:text-[#080808] transition-colors"
                              >
                                + Tag
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 3: PROJECTS ==================== */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[#c8ff00] mb-1">
                      02 — Selected Work
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold">
                      Manage Projects.
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={addProject}
                    className="bg-[#c8ff00] text-[#080808] px-5 py-2.5 text-xs font-bold tracking-wider uppercase"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 md:p-8 space-y-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e1e1e] pb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#c8ff00] text-[#080808] font-bold text-xs px-2.5 py-1">
                            {proj.num}
                          </span>
                          <span className="font-[family-name:var(--font-display)] text-xl font-bold">
                            {proj.name || 'Untitled Project'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveProject(idx, -1)}
                            disabled={idx === 0}
                            title="Move Up"
                            className="border border-[#222] bg-[#141414] hover:border-[#c8ff00] px-3 py-1.5 text-xs disabled:opacity-30"
                          >
                            ↑ Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveProject(idx, 1)}
                            disabled={idx === data.projects.length - 1}
                            title="Move Down"
                            className="border border-[#222] bg-[#141414] hover:border-[#c8ff00] px-3 py-1.5 text-xs disabled:opacity-30"
                          >
                            ↓ Move Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProject(idx)}
                            title="Delete Project"
                            className="border border-[#222] bg-[#141414] hover:border-[#ff4d6d] hover:text-[#ff4d6d] px-3 py-1.5 text-xs"
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-1.5">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(idx, { name: e.target.value })}
                            placeholder="Project Name"
                            className="w-full bg-[#141414] border border-[#222] text-white px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-1.5">
                            GitHub URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={proj.github || ''}
                            onChange={(e) => updateProject(idx, { github: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full bg-[#141414] border border-[#222] text-white px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-1.5">
                            Live Web URL
                          </label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(idx, { link: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-[#141414] border border-[#222] text-white px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-1.5">
                          Project Description
                        </label>
                        <textarea
                          rows={3}
                          value={proj.desc}
                          onChange={(e) => updateProject(idx, { desc: e.target.value })}
                          className="w-full bg-[#141414] border border-[#222] text-white px-4 py-2.5 text-sm leading-relaxed outline-none focus:border-[#c8ff00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-[#666] mb-2">
                          Tech Stack Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {proj.stack.map((tech, tIdx) => (
                            <span
                              key={`${tech}-${tIdx}`}
                              className="inline-flex items-center gap-1.5 bg-[#141414] border border-[#c8ff00]/30 text-[#c8ff00] px-3 py-1 text-xs"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeProjectStackTag(idx, tIdx)}
                                className="text-[#888] hover:text-[#ff4d6d]"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 max-w-md">
                          <input
                            type="text"
                            value={projectStackInputs[idx] || ''}
                            onChange={(e) =>
                              setProjectStackInputs((prev) => ({
                                ...prev,
                                [idx]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addProjectStackTag(idx)
                              }
                            }}
                            placeholder="Add stack tag (comma-separated or Enter)..."
                            className="flex-1 bg-[#141414] border border-[#222] text-white px-3 py-2 text-xs outline-none focus:border-[#c8ff00]"
                          />
                          <button
                            type="button"
                            onClick={() => addProjectStackTag(idx)}
                            className="border border-[#c8ff00] text-[#c8ff00] px-4 py-2 text-xs uppercase hover:bg-[#c8ff00] hover:text-[#080808] transition-colors"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
