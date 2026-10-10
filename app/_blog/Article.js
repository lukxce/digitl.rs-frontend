import Link from "next/link";
import { extractContentHeadings } from "../../lib/blockHeadings.js";
import b from "../_home/base.module.css";
import { Newsletter } from "../_home/Blog";
import { ArrowLeft, ArrowUpRight } from "../_home/icons";
import { Head, Reveal } from "../_home/ui";
import logo from "../assets/digitl-logo.png";
import Ask, { Calm } from "./Ask";
import s from "./article.module.css";
import Card from "./Card";
import { categoryOf } from "./categories";
import { canParse, parseBlocks, withoutMissing } from "./markdown";
import Progress from "./Progress";
import Prose from "./Prose";
import Share from "./Share";
import Tie from "./Tie";
import Toc, { TocFold } from "./Toc";
import {
  formatDate,
  img,
  imgSet,
  imgSize,
  readingMinutes,
  SITE_URL,
} from "./util";

const text = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

/** A blog post: the promise and the cover up top as on the homepage, the
    key messages, then the text in a reading column with its contents and
    share actions alongside. `more` are cards for "Još sa bloga". */
export default async function Article({ article, more }) {
  const url = `${SITE_URL}/journal/${encodeURIComponent(article.slug)}`;
  const { blocks } = article;

  // Markdown blocks are parsed here; any other shape the CMS may send goes
  // to the site's existing renderer, inside the same typography.
  const parsed = canParse(blocks) ? parseBlocks(blocks, article.title) : null;
  if (parsed) parsed.nodes = await withoutMissing(parsed.nodes);
  const hasBody = parsed
    ? parsed.nodes.length > 0
    : typeof blocks === "string"
      ? blocks.trim().length > 0
      : Array.isArray(blocks) && blocks.length > 0;
  const toc = parsed ? parsed.toc : extractContentHeadings(blocks);
  const showToc = hasBody && toc.length > 1;

  const standfirst =
    text(article.description) ||
    text(article.subtitle) ||
    text(article.excerpt);
  const author = article.author?.name || "Digitl";
  const avatar = img(article.author?.imageUrl, 120) || logo.src;
  const date = formatDate(article.publishedAt);
  const minutes = readingMinutes(blocks);
  const category = categoryOf(article);
  const cover = article.coverUrl;
  const coverSize = imgSize(cover) ?? { width: 1600, height: 900 };
  const keys = (article.keyTakeaways ?? []).filter(
    (k) => k?.title || k?.description,
  );

  return (
    <Calm>
      <Progress target="tekst" />

      <article>
        <header className={`${b.glow} ${s.hero}`}>
          <div className={`${b.container} ${s.heroGrid}`}>
            <div className={s.intro}>
              <Link
                href="/journal"
                className={`${s.back} ${b.fadeUp}`}
                aria-label="Nazad na blog"
              >
                <span>
                  <ArrowLeft size={14} />
                </span>
                Blog
              </Link>
              <h1
                className={`${s.title} ${b.fadeUp}`}
                style={{ animationDelay: "80ms" }}
              >
                <Tie>{article.title}</Tie>
              </h1>
              {standfirst
                ? <p
                    className={`${s.standfirst} ${b.fadeUp}`}
                    style={{ animationDelay: "160ms" }}
                  >
                    <Tie>{standfirst}</Tie>
                  </p>
                : null}
              <div
                className={`${s.byline} ${b.fadeUp}`}
                style={{ animationDelay: "240ms" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" width={46} height={46} />
                <p>
                  <b>{author}</b>
                  <span>
                    <em>{category}</em>
                    {date
                      ? <time dateTime={article.publishedAt}>{date}</time>
                      : null}
                    {minutes ? <i>{minutes} min čitanja</i> : null}
                  </span>
                </p>
              </div>
            </div>

            {cover
              ? <figure
                  className={`${s.cover} ${b.fadeUp}`}
                  style={{
                    animationDelay: "200ms",
                    aspectRatio: `${coverSize.width} / ${coverSize.height}`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(cover, 1400, 82)}
                    srcSet={imgSet(cover, [700, 1000, 1400, 1600], 82)}
                    sizes="(max-width: 959px) 100vw, 700px"
                    alt=""
                    width={coverSize.width}
                    height={coverSize.height}
                    fetchPriority="high"
                    decoding="async"
                  />
                </figure>
              : null}
          </div>
        </header>

        {keys.length
          ? <section className={b.container} aria-labelledby="kljucne-poruke">
              <Reveal className={s.keys}>
                <h2 id="kljucne-poruke" className={s.keysLabel}>
                  Ključne poruke
                </h2>
                <ol className={s.keysGrid}>
                  {keys.map((k, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list from the CMS
                    <li key={i} className={s.key}>
                      <span className={s.keyNo} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {k.title
                        ? <h3>
                            <Tie>{k.title}</Tie>
                          </h3>
                        : null}
                      {k.description
                        ? <p>
                            <Tie>{k.description}</Tie>
                          </p>
                        : null}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </section>
          : null}

        <div className={b.container}>
          <div className={s.layout}>
            <div className={s.main}>
              {showToc ? <TocFold items={toc} /> : null}
              <div id="tekst">
                {hasBody
                  ? <Prose
                      nodes={parsed?.nodes}
                      blocks={parsed ? undefined : blocks}
                    />
                  : <p className={s.nothing}>Ovaj tekst još nema sadržaj.</p>}
              </div>
              <Share url={url} title={article.title} className={s.shareEnd} />
              <Ask author={author} avatar={avatar} />
            </div>

            <aside className={s.side}>
              {showToc ? <Toc items={toc} /> : null}
              <Share url={url} title={article.title} />
            </aside>
          </div>
        </div>
      </article>

      <section className={s.more}>
        <div className={b.container}>
          {more.length
            ? <>
                <div className={s.moreTop}>
                  <Head label="Blog" title="Još sa bloga." />
                  <Link className={s.all} href="/journal">
                    Svi tekstovi <ArrowUpRight size={15} />
                  </Link>
                </div>
                <ul className={s.moreGrid}>
                  {more.map((a, i) => (
                    <Reveal as="li" key={a.slug} i={i} y={22}>
                      <Card a={a} />
                    </Reveal>
                  ))}
                </ul>
              </>
            : null}
          <Newsletter />
        </div>
      </section>
    </Calm>
  );
}
