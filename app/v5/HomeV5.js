"use client";

import Booking from "./Booking";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";
import { Faq, Journal, Marquee, Process, Proof, Services, WithWithout } from "./Sections";
import s from "./v5.module.css";

export default function HomeV5({ clients, articles }) {
  return (
    // data-own-chrome hides the site-wide nav pill; this page brings its own nav.
    <div className={s.root} data-own-chrome>
      <Nav />
      <main>
        <Hero clients={clients} />
        <Marquee clients={clients} />
        <Services />
        <WithWithout />
        <Proof clients={clients} />
        <Process />
        <Faq />
        <Journal articles={articles} />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
