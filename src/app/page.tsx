import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Values from "@/components/Values";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="flex-1">
        <Hero />
        <Story />
        <Values />
        <Events />
      </main>
      <Footer />
    </>
  );
}
