import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Skills from "@/components/Skills";
import FeaturedWork from "@/components/FeaturedWork";
import Timeline from "@/components/Timeline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="flex min-h-[100svh] flex-col justify-center pb-16 pt-28 md:pb-24">
          <Intro />
          <Skills />
        </div>
        <FeaturedWork />
        <Timeline />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
