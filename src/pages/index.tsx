import { MotionConfig } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSectionRouting } from "../lib/activeSection";
import About from "./About/About";
import Craft from "./Craft/Craft";
import Hero from "./Hero/Hero";
import Menu from "./Menu/Menu";
import Visit from "./Visit/Visit";

/**
 * The whole site: one page, top to bottom, with a URL per section
 * (see SECTIONS in site.config.ts).
 */
export default function Page() {
  useSectionRouting();

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      {/* Clip, not hide: sideways overflow is cut without breaking the sticky scenes. */}
      <main id="main" tabIndex={-1} className="overflow-x-clip focus:outline-none">
        <Hero />
        <Menu />
        <Craft />
        <About />
        <Visit />
      </main>
      <Footer />
    </MotionConfig>
  );
}
