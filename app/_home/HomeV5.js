"use client";

import b from "./base.module.css";
import Blog from "./Blog";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";
import Journey from "./Journey";
import Loop from "./Loop";
import Nav from "./Nav";
import { Faq, PlanSection } from "./Sections";
import Services from "./Services";
import { AppProvider } from "./ui";
import Voices from "./Voices";
import Work from "./Work";

/** The digitl.rs homepage: one conversation, top to bottom. The promise
    with one of our services shown working, what we do, how we work, three
    questions for a plan, whether it works, what clients say, the blog, the
    customer's path, the talk. The plan from the three questions travels
    through the sections below it. Brings its own chrome, so the global
    SiteNav hides itself (data-own-chrome). */
export default function HomeV5({ clients, articles, fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Services />
          <Journey />
          <PlanSection clients={clients} />
          <Work clients={clients} />
          <Voices />
          <Blog articles={articles} />
          <Loop />
          <Contact />
          <Faq />
        </main>
        <Footer />
      </AppProvider>
    </div>
  );
}
