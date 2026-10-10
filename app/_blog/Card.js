import Link from "next/link";
import { ArrowUpRight } from "../_home/icons";
import c from "./card.module.css";
import Tie from "./Tie";
import { img, imgSet } from "./util";

/** One article as a tile: cover, category, title, two lines of the
    description, date and reading time. Used by the listing and by
    "Još sa bloga" under a post. */
export default function Card({ a, as: Title = "h3" }) {
  return (
    <Link href={a.href} className={c.card}>
      <div className={c.cover}>
        {a.cover
          ? // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img(a.cover, 800)}
              srcSet={imgSet(a.cover, [480, 800, 1200])}
              sizes="(max-width: 639px) 100vw, (max-width: 1039px) 50vw, 420px"
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
            />
          : null}
      </div>
      <div className={c.body}>
        <div className={c.top}>
          {a.category ? <span className={c.tag}>{a.category}</span> : null}
          <span className={c.go} aria-hidden="true">
            <ArrowUpRight size={15} />
          </span>
        </div>
        <Title className={c.title}>
          <Tie>{a.title}</Tie>
        </Title>
        {a.description
          ? <p className={c.excerpt}>
              <Tie>{a.description}</Tie>
            </p>
          : null}
        <p className={c.meta}>
          {a.date ? <time dateTime={a.iso ?? undefined}>{a.date}</time> : null}
          {a.minutes ? <span>{a.minutes} min čitanja</span> : null}
        </p>
      </div>
    </Link>
  );
}
