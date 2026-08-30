import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Principles from "@/components/Principles";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Writing from "@/components/Writing";
import Games from "@/components/Games";
import Education from "@/components/Education";
import FunFacts from "@/components/FunFacts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EasterEggs from "@/components/EasterEggs";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const featuredPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <Header />
      <main id="top" className="mx-auto w-full max-w-7xl flex-1 px-5 pt-20 sm:px-8 lg:px-12">
        <Hero />
        <SelectedWork />
        <Experience />
        <Writing posts={featuredPosts} />
        <About />
        <Principles />
        <Skills />
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
