import Link from "next/link";
import b from "../_home/base.module.css";
import { ArrowRight, ArrowUpRight } from "../_home/icons";
import { Reveal } from "../_home/ui";
import c from "./card.module.css";
import { sized, srcSet } from "./lib";

const SIZES = {
  feature: "(max-width: 959px) 100vw, 680px",
  wide: "(max-width: 959px) 100vw, 680px",
  tile: "(max-width: 759px) 100vw, 640px",
  mini: "(max-width: 759px) 100vw, 420px",
};

/** One project: the client's real site, who it is, the headline of the
    study and its numbers. `variant` sets the size, `tone` the ground. */
export default function ProjectCard({
  p,
  variant = "tile",
  tone = "mist",
  flip = false,
  i = 0,
  as: Title = "h2",
  eager = false,
}) {
  const mini = variant === "mini";
  const title = p.headline ?? p.name;
  const numbers = mini ? p.numbers.slice(0, 2) : p.numbers;
  // The first card of a page is on screen at load: it comes in with CSS, so
  // its picture does not wait for the scripts.
  const Wrap = eager ? "div" : Reveal;
  const wrap = eager
    ? { className: `${c.cell} ${b.fadeUp}` }
    : { i, className: c.cell };
  return (
    <Wrap {...wrap}>
      <article
        className={`${c.card} ${c[variant]} ${c[tone]} ${flip ? c.flip : ""}`}
      >
        {p.cover
          ? <div className={c.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sized(p.cover, 1280)}
                srcSet={srcSet(p.cover, [640, 960, 1280, 1600])}
                sizes={SIZES[variant]}
                alt={`Sajt koji smo napravili za ${p.name}`}
                width="1600"
                height="900"
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : undefined}
                decoding="async"
              />
            </div>
          : null}

        <div className={c.body}>
          <div className={c.top}>
            <span className={c.logo}>
              {p.logo
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sized(p.logo, 96)}
                    alt=""
                    width="44"
                    height="44"
                    loading="lazy"
                  />
                : <b aria-hidden="true">{p.name.slice(0, 1)}</b>}
            </span>
            <p className={c.who}>
              {p.headline ? <b>{p.name}</b> : null}
              {p.category ? <span>{p.category}</span> : null}
            </p>
            <span className={c.go} aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </div>

          <Title className={c.title} data-name={p.headline ? undefined : ""}>
            <Link href={p.href} className={c.link}>
              {title}
            </Link>
          </Title>

          {p.blurb && (variant === "feature" || !p.headline)
            ? <p className={c.blurb}>{p.blurb}</p>
            : null}

          {numbers.length
            ? <ul className={c.stats}>
                {numbers.map((n) => (
                  <li key={`${n.value}-${n.label}`}>
                    <b>{n.value}</b>
                    <span>{n.label}</span>
                  </li>
                ))}
              </ul>
            : null}

          <div className={c.foot}>
            {p.services.length && !mini
              ? <ul className={c.chips} aria-label="Šta smo radili">
                  {p.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              : null}
            <span className={c.more} aria-hidden="true">
              Pogledajte studiju <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </article>
    </Wrap>
  );
}
