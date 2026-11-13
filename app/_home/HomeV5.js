"use client";

import Blog from "./Blog";
import Booking from "./Booking";
import b from "./base.module.css";
import Contact from "./Contact";
import { CARD_SKIN } from "./content";
import Footer from "./Footer";
import Hero from "./Hero";
import Journey from "./Journey";
import Nav from "./Nav";
import { Faq, PlanSection } from "./Sections";
import Services from "./Services";
import { AppProvider } from "./ui";
// The "Šta dobijate" section is parked (Luka, 21 Oct 2026); its four little
// interfaces now live in the steps of Kako radimo (Minis.js).
// import Value from "./Value";
import Voices from "./Voices";
import Work from "./Work";

/** The digitl.rs homepage: one conversation, top to bottom. The promise
    with one of our services shown working, what we do, how we work, three
    questions for a plan, whether it works, what clients say, the talk,
    then the customer's path and the questions. The plan from the three
    questions travels through the sections below it. Brings its own
    chrome, so the global SiteNav hides itself (data-own-chrome).

    look "v2" (the default since 11 Nov 2026) draws the service cards and
    the steps in the service pages' sticker language. skin draws the
    hero's cards the way Luka picked on 11 Nov 2026 (the /v9 test): white
    fields, the arrow-in-a-circle key, items as white cards in a mist tray
    ("fine"), and the pieces that tell each story coming off the card
    ("lift"), nothing tilted. The rules sit at the end of each card's
    stylesheet. */
export default function HomeV5({
  clients,
  articles = [],
  fonts,
  look = "v2",
  skin = CARD_SKIN,
}) {
  return (
    <div
      className={`${b.root} ${fonts}`}
      data-own-chrome
      data-look={look}
      data-skin={skin}
    >
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Services look={look} />
          <Journey />
          <PlanSection clients={clients} />
          <Work clients={clients} />
          <Voices />
          {/* <Value /> */}
          {/* The blog is off the site for now (Luka, 10 Nov 2026: the old
              posts were industry news). Blog.js stays for when it returns. */}
          {/* the form comes before the wheel (Luka, 11 Nov 2026) */}
          {/* the site check comes back right before the form (Luka, 12 Nov
              2026); what it measures is carried into the form */}
          {/* the site check is off for now (Luka, 13 Nov 2026); Audit.js
              stays for when it comes back */}
          {/* <Check /> */}
          {/* the blog sits under the site check (Luka, 13 Nov 2026) */}
          <Blog articles={articles} />
          <Contact />
          {/* the customer's path wheel is off for now (Luka, 13 Nov 2026) */}
          {/* <Loop /> */}
          <Faq />
        </main>
        <Footer />
        <Booking />
      </AppProvider>
    </div>
  );
}
