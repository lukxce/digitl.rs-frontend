import Link from "next/link";
import b from "../_home/base.module.css";
import ProjectCard from "./Card";
import { sized } from "./lib";
import l from "./listing.module.css";

const TONES = ["blue", "mist", "lime"];

/** /projects: every case study, newest first. The newest one leads at full
    width; the rest sit two to a row, and an odd one out closes the page at
    full width again, so four projects and twelve both end on a clean line. */
export default function Listing({ projects }) {
  const [lead, ...rest] = projects;
  const odd = rest.length % 2 === 1;
  const tiles = odd ? rest.slice(0, -1) : rest;
  const closer = odd ? rest[rest.length - 1] : null;

  return (
    <>
      <section className={`${b.glow} ${l.hero}`}>
        <div className={b.container}>
          <span className={`${b.label} ${b.fadeUp}`}>Projekti</span>
          <h1 className={`${b.display} ${l.title}`}>
            <span className={b.lineMask}>
              <span className={b.lineUp}>Naš rad.</span>
            </span>
          </h1>
          <p className={`${b.intro} ${b.fadeUp} ${l.intro}`}>
            Izbor projekata koje smo realizovali za klijente iz različitih
            industrija.
          </p>
          {projects.length > 1
            ? <ul className={`${l.index} ${b.fadeUp}`} aria-label="Klijenti">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.href}>
                      {p.logo
                        ? // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sized(p.logo, 64)}
                            alt=""
                            width="22"
                            height="22"
                          />
                        : null}
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            : null}
        </div>
      </section>

      <section className={l.list} aria-label="Studije slučaja">
        <div className={b.container}>
          {lead
            ? <div className={l.grid}>
                <div className={l.span}>
                  <ProjectCard p={lead} variant="feature" tone="dark" eager />
                </div>
                {tiles.map((p, i) => (
                  <ProjectCard
                    key={p.slug}
                    p={p}
                    tone={TONES[i % TONES.length]}
                    i={i % 2}
                  />
                ))}
                {closer
                  ? <div className={l.span}>
                      <ProjectCard
                        p={closer}
                        variant="wide"
                        tone={TONES[tiles.length % TONES.length]}
                        flip
                      />
                    </div>
                  : null}
              </div>
            : <p className={l.empty}>
                Projekti trenutno nisu dostupni. Pokušajte ponovo za koji minut.
              </p>}
        </div>
      </section>
    </>
  );
}
