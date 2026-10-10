"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import b from "../_home/base.module.css";
import { Newsletter } from "../_home/Blog";
import { ArrowRight, Search, X } from "../_home/icons";
import { EASE, Words } from "../_home/ui";
import Card from "./Card";
import l from "./listing.module.css";
import Tie from "./Tie";
import { fold, img, imgSet, tekstova } from "./util";

/** The newest article, told large: the front page of the blog. */
function Lead({ a }) {
  return (
    <Link
      href={a.href}
      className={`${l.lead} ${b.fadeUp}`}
      style={{ animationDelay: "320ms" }}
    >
      <div className={l.leadCover}>
        {a.cover
          ? // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img(a.cover, 1200)}
              srcSet={imgSet(a.cover, [640, 960, 1200, 1600])}
              sizes="(max-width: 899px) 100vw, 700px"
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
            />
          : null}
      </div>
      <div className={l.leadBody}>
        <p className={l.tags}>
          <span className={l.new}>Najnovije</span>
          {a.category ? <span className={l.tag}>{a.category}</span> : null}
        </p>
        <h2 className={l.leadTitle}>
          <Tie>{a.title}</Tie>
        </h2>
        {a.description
          ? <p className={l.excerpt}>
              <Tie>{a.description}</Tie>
            </p>
          : null}
        <p className={l.meta}>
          {a.avatar
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={a.avatar} alt="" width={30} height={30} />
            : null}
          {a.author ? <b>{a.author}</b> : null}
          {a.date ? <time dateTime={a.iso ?? undefined}>{a.date}</time> : null}
          {a.minutes ? <span>{a.minutes} min čitanja</span> : null}
        </p>
        <span className={l.read}>
          Pročitajte tekst <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

/** The blog index: the head and the newest article, the newsletter, then
    every other article behind category chips and a search by title.
    `categories` arrive counted and ordered from the server. */
export default function Listing({ articles, categories }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);
  const needle = fold(q.trim());
  const [lead, ...rest] = articles;

  // Untouched, the grid is everything under the newest article. A category
  // or a search looks through all of them, the newest included, so a chip
  // that says one article always has one to show.
  const filtering = Boolean(cat || needle);
  const shown = filtering
    ? articles.filter(
        (a) =>
          (!cat || a.category === cat) &&
          (!needle || fold(a.title).includes(needle)),
      )
    : rest;
  const reset = () => {
    setQ("");
    setCat(null);
  };
  const newsAfter = Math.min(2, shown.length) - 1;

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

          {lead
            ? <Lead a={lead} />
            : <p className={l.empty}>
                Tekstovi trenutno nisu dostupni. Pokušajte ponovo za minut.
              </p>}

          {/* wide screens: the newsletter right under the newest article;
              phones get it further down, between the articles */}
          <div className={l.newsTop}>
            <Newsletter />
          </div>
        </div>
      </section>

      {rest.length
        ? <section className={l.more} data-section="Još sa bloga">
            <div className={b.container}>
              <div className={l.moreTop}>
                <Words text="Još sa bloga." className={b.h2} />
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
                        // phones: the newsletter after the second article
                        // (or after the last one, when fewer are shown)
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
