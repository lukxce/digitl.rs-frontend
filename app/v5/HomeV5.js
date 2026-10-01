"use client";

import b from "./base.module.css";
import Booking from "./Booking";
import Data from "./Data";
import Faq from "./Faq";
import Footer from "./Footer";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Nav from "./Nav";
import Position from "./Position";
import Problems from "./Problems";
import Process from "./Process";
import Results from "./Results";
import Roles from "./Roles";
import Story from "./Story";
import { AppProvider } from "./ui";

/** digitl.rs/v5 — brings its own chrome, so the global SiteNav hides itself
    (data-own-chrome). Order: the problems we hear, why they need one system,
    proof, why position and speed are money, how we work, the conversation. */
export default function HomeV5({ clients, articles, fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider>
        <Nav />
        <main>
          <Hero clients={clients} />
          <Problems clients={clients} />
          <Story />
          <Results clients={clients} />
          <Manifesto clients={clients} />
          <Position clients={clients} />
          <Data />
          <Process />
          <Roles />
          <Booking />
          <Faq />
        </main>
        <Footer articles={articles} />
      </AppProvider>
    </div>
  );
}
