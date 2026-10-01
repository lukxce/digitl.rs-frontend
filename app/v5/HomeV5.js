"use client";

import b from "./base.module.css";
import Blog from "./Blog";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";
import Journey from "./Journey";
import Loop from "./Loop";
import Nav from "./Nav";
import { Check, Faq } from "./Sections";
import Services from "./Services";
import { AppProvider } from "./ui";
import Voices from "./Voices";
import Work from "./Work";

/** digitl.rs/v5 — one conversation, top to bottom: the promise, where you are
    (three questions, a plan), what we do, how it looks from the inside, whether
    it works, what clients say, your own site, the talk. The plan from the three
    questions travels through every section. Brings its own chrome, so the
    global SiteNav hides itself (data-own-chrome). */
export default function HomeV5({ clients, articles, fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Services />
          <Journey />
          <Work clients={clients} />
          <Voices />
          <Blog articles={articles} />
          <Loop />
          <Check />
          <Contact />
          <Faq />
        </main>
        <Footer articles={[]} />
      </AppProvider>
    </div>
  );
}
