"use client";

import Booking from "./Booking";
import b from "./base.module.css";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";
import Journey from "./Journey";
import Loop from "./Loop";
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
    the steps in the service pages' sticker language; skin "sticker" does
    the same for the hero's cards (the /v7 test). */
export default function HomeV5({ clients, fonts, look = "v2", skin }) {
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
          <Contact />
          <Loop />
          <Faq />
        </main>
        <Footer />
        <Booking />
      </AppProvider>
    </div>
  );
}
