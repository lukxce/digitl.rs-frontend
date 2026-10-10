import Link from "next/link";
import ProjectBlocksRendererAuto from "../components/ProjectBlocksRendererAuto";
import b from "../_home/base.module.css";
import { ArrowLeft, ArrowUpRight, Quote } from "../_home/icons";
import { Btn, Reveal } from "../_home/ui";
import ProjectCard from "./Card";
import ChapterNav from "./ChapterNav";
import CaseCta from "./Cta";
import Gallery from "./Gallery";
import { monthYear, sized, srcSet, widestEm } from "./lib";
import s from "./study.module.css";
import Viz, { CountUp } from "./Viz";

const TONES = ["blue", "mist", "lime"];
const pad2 = (n) => String(n).padStart(2, "0");
const isResult = (ch) => /^rezultat/i.test(ch.kicker ?? "");

/* ── top of the page ──────────────────────────────────────────────────── */
function Hero({ showcase, headline, standfirst, meta, services }) {
  const name = showcase.clientName || showcase.title;
  const logo =
    showcase.thumbSrc && showcase.thumbSrc !== showcase.coverUrl
      ? showcase.thumbSrc
      : null;
  return (
    <header className={`${b.glow} ${s.hero}`}>
      <div className={b.container}>
        <Link href="/projects" className={`${s.back} ${b.fadeUp}`}>
          <ArrowLeft size={15} /> Projekti
        </Link>

        <div className={`${s.client} ${b.fadeUp}`}>
          <span className={s.logo}>
            {logo
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={sized(logo, 128)} alt="" width="52" height="52" />
              : <b aria-hidden="true">{name.slice(0, 1)}</b>}
          </span>
          <p>
            <b>{name}</b>
            {showcase.category ? <span>{showcase.category}</span> : null}
          </p>
        </div>

        <h1 className={`${s.h1} ${b.fadeUp}`}>{headline}</h1>

        <div className={`${s.lead} ${b.fadeUp}`}>
          {standfirst ? <p className={s.standfirst}>{standfirst}</p> : null}
          <div className={s.actions}>
            {showcase.websiteUrl
              ? <Btn
                  href={showcase.websiteUrl}
                  variant="ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Posetite sajt
                </Btn>
              : null}
            {services.length
              ? <ul className={s.services} aria-label="Šta smo radili">
                  {services.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              : null}
          </div>
        </div>

        {meta.length
          ? <dl
              className={`${s.facts} ${b.fadeUp}`}
              data-n={Math.min(meta.length, 4)}
            >
              {meta.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          : null}

        {showcase.coverUrl
          ? <figure className={`${s.cover} ${b.fadeUp}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sized(showcase.coverUrl, 1600)}
                srcSet={srcSet(showcase.coverUrl, [800, 1200, 1600, 2400])}
                sizes="(max-width: 1320px) 100vw, 1256px"
                alt={`Sajt koji smo napravili za ${name}`}
                width="1600"
                height="900"
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          : null}
      </div>
    </header>
  );
}

/* ── the headline numbers, and where they come from ───────────────────── */
function Numbers({ numbers, source }) {
  if (!numbers.length) return null;
  // Values are not always short figures ("51.773", "3. mesec"). The whole
  // row is set in the size its widest value needs, so the row reads evenly
  // and nothing runs into the next cell. A phrase too long for one line at
  // any sensible size is allowed to wrap instead.
  const em = widestEm(numbers.map((n) => n.value));
  const wraps = em > 7;
  return (
    <section className={s.numbers} aria-label="Projekat u brojevima">
      <div className={b.container}>
        <ul
          className={s.numGrid}
          data-n={Math.min(numbers.length, 4)}
          data-wrap={wraps ? "" : undefined}
          style={{ "--em": wraps ? 5.5 : em }}
        >
          {numbers.map((n, i) => (
            <Reveal as="li" i={i} key={`${n.value}-${n.label}`}>
              <b>
                <CountUp value={n.value} />
              </b>
              <span>{n.label}</span>
              {n.note ? <em>{n.note}</em> : null}
            </Reveal>
          ))}
        </ul>
        {source
          ? <p className={s.source}>
              <i aria-hidden="true" />
              {source}
            </p>
          : null}
      </div>
    </section>
  );
}

/* ── chapters ─────────────────────────────────────────────────────────── */
/* What a chapter holds decides how it is laid out, so eleven chapters do
   not come out as one template eleven times:
   - a figure that reads in a column (bars, a table, a short before/after)
     or a pull quote stands beside the text, on alternating sides;
   - a chapter with nothing to stand beside it runs its title and its text
     in two columns;
   - whatever needs width (a time series, a row of figures, pictures, and
     every before/after in a results chapter) gets the full measure below. */
function plan(chapters) {
  let sides = 0;
  let pulls = 0;
  return chapters.map((ch, i) => {
    const kind = ch.viz?.kind;
    const result = isResult(ch);
    const beside =
      kind === "share" ||
      (kind === "table" && (ch.viz.columns?.length ?? 0) <= 4) ||
      (kind === "compare" && !result);
    const pullBeside = Boolean(ch.pull) && !beside;
    const split = beside || pullBeside;
    return {
      ch,
      n: i + 1,
      result,
      beside,
      pullBeside,
      split,
      flip: split ? sides++ % 2 === 1 : false,
      // the first quote of a study is the dark card; later ones are quieter
      pullTone: ch.pull ? (pulls++ === 0 ? "dark" : "soft") : null,
    };
  });
}

function Pull({ text, tone }) {
  return (
    <blockquote className={`${s.pull} ${s[`pull_${tone}`]}`}>
      <span className={s.pullMark} aria-hidden="true">
        <Quote size={34} />
      </span>
      <p>{text}</p>
    </blockquote>
  );
}

function Chapter({ p }) {
  const { ch } = p;
  const head = (
    <Reveal as="header" className={s.chHead}>
      <p className={s.kicker}>
        <i>{pad2(p.n)}</i>
        {ch.kicker}
      </p>
      <h2 id={`${ch.id}-naslov`} className={s.chTitle}>
        {ch.title}
      </h2>
    </Reveal>
  );
  const body = (
    <Reveal className={s.text} i={1}>
      {(ch.body ?? []).map((para) => (
        <p key={para.slice(0, 48)}>{para}</p>
      ))}
    </Reveal>
  );
  const viz = ch.viz ? <Viz viz={ch.viz} board={p.result} /> : null;

  return (
    <section
      id={ch.id}
      className={s.chapter}
      aria-labelledby={`${ch.id}-naslov`}
      data-result={p.result ? "" : undefined}
    >
      {p.split
        ? <>
            {head}
            <div
              className={s.split}
              data-flip={p.flip ? "" : undefined}
              data-figure={p.beside ? "" : undefined}
            >
              {body}
              <Reveal className={s.side} i={2}>
                {p.beside ? viz : <Pull text={ch.pull} tone={p.pullTone} />}
              </Reveal>
            </div>
          </>
        : <div className={s.lede}>
            {head}
            {body}
          </div>}

      {ch.pull && !p.pullBeside
        ? <Reveal>
            <Pull text={ch.pull} tone="wide" />
          </Reveal>
        : null}
      {viz && !p.beside ? <Reveal className={s.wide}>{viz}</Reveal> : null}
      {ch.media?.length
        ? <Reveal className={s.media}>
            <Gallery items={ch.media} />
          </Reveal>
        : null}
    </section>
  );
}

function Chapters({ chapters }) {
  const planned = plan(chapters);
  // results chapters that follow one another share one lit stage
  const groups = [];
  for (const p of planned) {
    const last = groups[groups.length - 1];
    if (last && last.result === p.result) last.items.push(p);
    else groups.push({ result: p.result, items: [p] });
  }
  const nav = planned.map((p, i) => ({
    id: p.ch.id,
    n: pad2(p.n),
    kicker: p.ch.kicker,
    title: p.ch.title,
    first: i === 0 || planned[i - 1].ch.kicker !== p.ch.kicker,
  }));

  return (
    <div className={s.story}>
      <div className={`${b.container} ${s.storyGrid}`}>
        <ChapterNav items={nav} />
        <div className={s.chapters}>
          {groups.map((g) => (
            <div key={g.items[0].ch.id} className={g.result ? s.stage : s.run}>
              {g.items.map((p) => (
                <Chapter key={p.ch.id} p={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── after the chapters ───────────────────────────────────────────────── */
function Next({ next }) {
  if (!next?.title && !next?.body?.length) return null;
  return (
    <section className={s.block}>
      <div className={b.container}>
        <Reveal className={s.next}>
          <div>
            <span className={b.label}>Ograničenja i sledeći koraci</span>
            {next.title ? <h2>{next.title}</h2> : null}
          </div>
          <div className={s.nextBody}>
            {(next.body ?? []).map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Takeaways({ items }) {
  if (!items.length) return null;
  return (
    <section className={s.block}>
      <div className={b.container}>
        <Reveal as="span" className={b.label}>
          Zaključak
        </Reveal>
        <Reveal as="h2" className={`${b.h2} ${s.blockTitle}`} i={1}>
          Šta smo naučili.
        </Reveal>
        <ol className={s.lessons} data-n={Math.min(items.length, 4)}>
          {items.map((t, i) => (
            <Reveal as="li" i={i} key={t.title || t.text}>
              <i aria-hidden="true">{i + 1}</i>
              {t.title ? <h3>{t.title}</h3> : null}
              {t.text ? <p>{t.text}</p> : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function More({ projects }) {
  if (!projects.length) return null;
  return (
    <section className={s.block}>
      <div className={b.container}>
        <div className={s.moreHead}>
          <div>
            <Reveal as="span" className={b.label}>
              Projekti
            </Reveal>
            <Reveal as="h2" className={`${b.h2} ${s.blockTitle}`} i={1}>
              Još projekata.
            </Reveal>
          </div>
          <Link href="/projects" className={s.all}>
            Svi projekti <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className={s.moreGrid} data-n={projects.length}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              p={p}
              variant="mini"
              tone={TONES[i % TONES.length]}
              i={i}
              as="h3"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** /projects/<slug>. With a story the page is told in chapters; without one
    it falls back to what the CMS holds: description, numbers, the rich text
    and the takeaways. Client, logo, cover and link come from the CMS in both. */
export default function Study({ showcase, story, more }) {
  const name = showcase.clientName || showcase.title;
  const meta = story?.meta?.length
    ? story.meta
    : [
        { label: "Klijent", value: name },
        { label: "Delatnost", value: showcase.category },
        { label: "Objavljeno", value: monthYear(showcase.publishedAt) },
      ];
  const numbers = story?.numbers?.length
    ? story.numbers
    : (showcase.successRate ?? []).map((m) => ({
        value: m.title,
        label: m.subtitle,
      }));
  const lessons = story?.takeaways?.length
    ? story.takeaways
    : (showcase.keyTakeaways ?? []).map((t) => ({
        title: t.title,
        text: t.description,
      }));
  const hasContent =
    typeof showcase.content === "string"
      ? showcase.content.trim().length > 0
      : Array.isArray(showcase.content) && showcase.content.length > 0;

  return (
    <>
      <article>
        <Hero
          showcase={showcase}
          headline={story?.headline ?? showcase.title}
          standfirst={story?.standfirst ?? showcase.description}
          meta={meta.filter((m) => m?.label && m?.value)}
          services={story?.services ?? []}
        />
        <Numbers
          numbers={numbers.filter((n) => n?.value)}
          source={story?.source}
        />

        {story?.chapters?.length
          ? <Chapters chapters={story.chapters.filter((ch) => ch?.id)} />
          : null}
        {!story && hasContent
          ? <div className={s.fallback}>
              <div className={`${b.container} ${s.prose}`}>
                <ProjectBlocksRendererAuto blocks={showcase.content} />
              </div>
            </div>
          : null}

        {story ? <Next next={story.next} /> : null}
        <Takeaways items={lessons} />
      </article>

      <section className={s.block}>
        <div className={b.container}>
          <CaseCta />
        </div>
      </section>
      <More projects={more} />
    </>
  );
}
