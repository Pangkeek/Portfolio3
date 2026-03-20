import Cursor     from '@/components/Cursor'
import Nav        from '@/components/Nav'
import Hero       from '@/components/Hero'
import Marquee    from '@/components/Marquee'
import Skills     from '@/components/Skills'
import Projects   from '@/components/Projects'
import Experience from '@/components/Experience'
import Contact    from '@/components/Contact'
import Footer     from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Skills />
        <Projects />
        {/* <Experience /> */}
        <Contact />
      </main>
      <Footer />
    </>
  )
}
