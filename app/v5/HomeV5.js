"use client";

import b from "./base.module.css";
import Booking from "./Booking";
import Cases from "./Cases";
import Faq from "./Faq";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";
import Story from "./Story";
import { AppProvider } from "./ui";
import YourTurn from "./YourTurn";

/** digitl.rs/v5 — one story in five chapters: the promise, the problem and the
    system, the proof, the visitor's own site, and how to start. Brings its own
    chrome, so the global SiteNav hides itself (data-own-chrome). */
export default function HomeV5({ clients, articles, fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Story />
          <Cases clients={clients} />
          <YourTurn />
          <Booking />
          <Faq />
        </main>
        <Footer articles={articles} />
      </AppProvider>
    </div>
  );
}
