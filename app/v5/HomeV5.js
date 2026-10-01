"use client";

import b from "./base.module.css";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";
import { Check, Faq, Never, Steps } from "./Sections";
import Services from "./Services";
import { AppProvider } from "./ui";
import Work from "./Work";

/** digitl.rs/v5 — "first you, then us": three questions under the hero build
    a plan that the services, results and contact form then follow. Brings its
    own chrome, so the global SiteNav hides itself (data-own-chrome). */
export default function HomeV5({ clients, articles, fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Services />
          <Work clients={clients} />
          <Check />
          <Steps />
          <Never />
          <Contact />
          <Faq />
        </main>
        <Footer articles={articles} />
      </AppProvider>
    </div>
  );
}
