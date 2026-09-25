import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Gear, Globe, PeaceHand, Sparkle } from "@/components/Icons";
import { SITE } from "@/lib/data";

const icon = "inline-block h-[0.95em] w-[0.95em] align-[-0.12em]";

export default function Intro() {
  return (
    <section id="about" className="px-5 pb-6 md:px-0">
      <Reveal>
        <p className="max-w-[1400px] text-[clamp(1.85rem,4vw,3.6rem)] font-medium leading-[1.22] tracking-[-0.02em]">
          Hi, I&apos;m{" "}
          <span className="relative mx-[0.08em] inline-block h-[1.05em] w-[1.05em] overflow-hidden rounded-[0.18em] align-[-0.2em]">
            <Image
              src={SITE.square}
              alt="Rodrigo Scharp"
              fill
              sizes="200px"
              className="object-cover"
            />
          </span>{" "}
          Rodrigo <PeaceHand className={icon} strokeWidth={1.9} />, building
          software since{" "}
          <span className="whitespace-nowrap">
            <span className="mx-[0.05em] inline-block rounded-full border-[1.5px] border-ink px-[0.35em] py-[0.02em] align-[0.02em] text-[0.92em] font-semibold leading-[1.3]">
              {SITE.startYear}
            </span>
            ,
          </span>{" "}
          focused on back-end systems <Gear className={icon} />, products{" "}
          <Globe className={icon} /> and real-world impact{" "}
          <Sparkle className={icon} />.
        </p>
      </Reveal>
    </section>
  );
}
