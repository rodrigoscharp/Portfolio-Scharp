import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Skills from "@/components/Skills";
import Metrics from "@/components/Metrics";
import FeaturedWork from "@/components/FeaturedWork";
import OrbzTeam from "@/components/OrbzTeam";
import Testimonials from "@/components/Testimonials";
import BetoGuide from "@/components/BetoGuide";
import OpeningIntro from "@/components/OpeningIntro";
import Timeline from "@/components/Timeline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-center pb-16 pt-28 md:pb-24">
          <Intro />
          <Skills />
        </div>
        <Metrics />
        <FeaturedWork />
        <OrbzTeam />
        <Timeline />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <BetoGuide />
      <OpeningIntro gate />
    </>
  );
}
