import HeroContent from "./HeroContent";
import HeroBackground from "./HeroBackground";

export default function HeroSection() {
  return (
    <section className="relative h-svh max-h-[1000px] w-full overflow-hidden border bg-background flex items-center justify-center">
      <HeroContent />
      <HeroBackground />
    </section>
  );
}
