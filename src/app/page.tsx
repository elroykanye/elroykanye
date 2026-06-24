import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Principles from "@/components/Principles";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Games from "@/components/Games";
import Education from "@/components/Education";
import FunFacts from "@/components/FunFacts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EasterEggs from "@/components/EasterEggs";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="mx-auto w-full max-w-4xl flex-1 px-5 pt-20">
        <Hero />
        <About />
        <Principles />
        <Skills />
        <Experience />
        <Games />
        <Education />
        <FunFacts />
        <Contact />
      </main>
      <Footer />
      <EasterEggs />
    </>
  );
}
