"use client";

import b from "./base.module.css";
import Contact from "./Contact";
import Footer from "./Footer";
import Nav from "./Nav";
import { AppProvider } from "./ui";

/** The frame the blog and project pages share with the homepage: the same
    nav (its links lead back to the homepage's sections), the contact form,
    and the footer. Brings its own chrome, so the global SiteNav hides. */
export default function Shell({ children, fonts, contact = true }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <AppProvider home={false}>
        <Nav />
        <main>
          {children}
          {contact ? <Contact /> : null}
        </main>
        <Footer />
      </AppProvider>
    </div>
  );
}
