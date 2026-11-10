import Cursor   from '@/components/Cursor'
import Nav      from '@/components/Nav'
import Hero     from '@/components/Hero'
import Marquee  from '@/components/Marquee'
import Skills   from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact  from '@/components/Contact'
import Footer   from '@/components/Footer'
import { getPortfolioData } from '@/lib/portfolio'

export const dynamic = 'force-dynamic'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Pangki',
      alternateName: 'Supawat Khaithong',
      url: 'https://pangki.dev',
      jobTitle: 'Full Stack Developer',
      knowsAbout: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      sameAs: [
        'https://github.com/Pangkeek',
        'https://www.linkedin.com/in/supawat-khaithong-11bb533b5/',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Pangki — Full Stack Developer',
      url: 'https://pangki.dev',
      description: 'Portfolio of Pangki (Supawat Khaithong), a Full Stack Developer specializing in Next.js, React, and TypeScript.',
    },
  ],
}

export default async function Home() {
  const data = await getPortfolioData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Cursor />
      <Nav />
      <main>
        <Hero metrics={data.metrics} heroInfo={data.info.hero} />
        <Marquee techs={data.info.marquee} />
        <Skills skills={data.info.skills} />
        <Projects projects={data.projects} />
        <Contact contactInfo={data.info.contact} />
      </main>
      <Footer copyright={data.info.footer.copyright} />
    </>
  )
}
