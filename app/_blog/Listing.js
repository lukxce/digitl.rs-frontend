"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import b from "../_home/base.module.css";
import { Newsletter } from "../_home/Blog";
import { Search, X } from "../_home/icons";
import { EASE } from "../_home/ui";
import Card from "./Card";
import l from "./listing.module.css";
import { fold, tekstova } from "./util";

/** The blog index: the head, then every article at once behind category
    chips and a search by title, with the newsletter after the first row
    (Luka, 19 Nov 2026: no featured article and newsletter before the list).
    `categories` arrive counted and ordered from the server. */
export default function Listing({ articles, categories }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);
  const needle = fold(q.trim());
  const filtering = Boolean(cat || needle);
  const shown = filtering
    ? articles.filter(
        (a) =>
          (!cat || a.category === cat) &&
          (!needle || fold(a.title).includes(needle)),
      )
    : articles;
  const reset = () => {
    setQ("");
    setCat(null);
  };
  // after the first row: three on a wide screen; on two columns the grid's
  // dense flow pulls the fourth article up beside the third
  const newsAfter = Math.min(3, shown.length) - 1;

  return (
    <MotionConfig reducedMotion="user">
      <section className={`${b.glow} ${l.hero}`} data-section="Blog">
        <div className={b.container}>
          <div className={l.head}>
            <p
              className={`${b.label} ${b.fadeUp}`}
              style={{ animationDelay: "40ms" }}
            >
              Najnoviji tekstovi
            </p>
            <h1 className={`${b.display} ${l.title}`}>
              <span className={b.lineMask}>
                <span className={b.lineUp} style={{ animationDelay: "100ms" }}>
                  Blog.
                </span>
              </span>
            </h1>
            <p
              className={`${b.intro} ${b.fadeUp}`}
              style={{ animationDelay: "240ms" }}
            >
              Praktični uvidi o marketingu, rastu i izgradnji brendova koji se
              izdvajaju.
            </p>
          </div>

          {articles.length
            ? null
            : <p className={l.empty}>
                Tekstovi trenutno nisu dostupni. Pokušajte ponovo za minut.
              </p>}
        </div>
      </section>

      {articles.length
        ? <section className={l.more} data-section="Tekstovi">
            <div className={b.container}>
              <div className={l.moreTop}>
                {categories.length > 1
                  ? // biome-ignore lint/a11y/useSemanticElements: a row of toggle buttons, not a form fieldset
                    <div
                      className={l.chips}
                      role="group"
                      aria-label="Kategorije"
                    >
                      <button
                        type="button"
                        className={l.chip}
                        aria-pressed={!cat}
                        onClick={() => setCat(null)}
                      >
                        Sve
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          className={l.chip}
                          aria-pressed={cat === c.name}
                          onClick={(e) => {
                            setCat(cat === c.name ? null : c.name);
                            // on a phone the row scrolls: bring a half-seen chip in
                            e.currentTarget.scrollIntoView({
                              behavior: window.matchMedia(
                                "(prefers-reduced-motion: reduce)",
                              ).matches
                                ? "auto"
                                : "smooth",
                              block: "nearest",
                              inline: "nearest",
                            });
                          }}
                        >
                          {c.name}
                          <i>{c.count}</i>
                        </button>
                      ))}
                    </div>
                  : null}
                {/* biome-ignore lint/a11y/useSemanticElements: <search> is too new for the browsers this site supports */}
                <form
                  className={l.search}
                  role="search"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Search size={18} />
                  <label className={b.srOnly} htmlFor="blog-search">
                    Pretražite tekstove po naslovu
                  </label>
                  <input
                    id="blog-search"
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    placeholder="Pretražite tekstove"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  {q
                    ? <button
                        type="button"
                        className={l.clear}
                        aria-label="Obriši pretragu"
                        onClick={() => setQ("")}
                      >
                        <X size={15} />
                      </button>
                    : null}
                </form>
              </div>
              <div className={l.tools}>
                <output className={l.count}>
                  {filtering ? tekstova(shown.length) : ""}
                </output>
              </div>

              {shown.length
                ? <motion.ul
                    className={l.grid}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {shown.flatMap((a, i) => {
                        const card = (
                          <motion.li
                            key={a.slug}
                            layout="position"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.45, ease: EASE }}
                          >
                            <Card a={a} />
                          </motion.li>
                        );
                        // the newsletter after the first row (or after the
                        // last article, when fewer are shown)
                        return i === newsAfter
                          ? [
                              card,
                              <li key="newsletter" className={l.newsInline}>
                                <Newsletter id="blog-news" />
                              </li>,
                            ]
                          : [card];
                      })}
                    </AnimatePresence>
                  </motion.ul>
                : <div className={l.none}>
                    <p>
                      {needle
                        ? `Nema tekstova sa „${q.trim()}” ${cat ? "u ovoj kategoriji" : "u naslovu"}.`
                        : "Nema tekstova u ovoj kategoriji."}
                    </p>
                    <button type="button" onClick={reset}>
                      Prikaži sve tekstove
                    </button>
                    <div className={l.newsInline}>
                      <Newsletter id="blog-news" />
                    </div>
                  </div>}
            </div>
          </section>
        : null}
    </MotionConfig>
  );
}
