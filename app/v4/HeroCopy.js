import b from "../v5/base.module.css";
import { Btn } from "../v5/ui";
import c from "./heroCopy.module.css";

/** The same promise in every idea, so the ideas can be compared fairly.
    `align` is "center" or "left"; `tone` "dark" sets it for a dark ground. */
export default function HeroCopy({ align = "center", tone, className = "" }) {
  return (
    <div
      className={`${c.copy} ${className}`}
      data-align={align}
      data-tone={tone}
    >
      <p className={c.status}>
        <span className={b.liveDot} />
        <span className={c.statusLong}>
          Agencija za rast · Beograd / London ·
        </span>{" "}
        <b>2 slobodna mesta</b>
      </p>
      <h1 className={c.title}>
        Marketing koji se meri <span>profitom,</span> ne aktivnošću.
      </h1>
      <p className={c.lead}>
        Oglasi, SEO, sajt, mreže i brend, vođeni kao jedan sistem i mereni
        jednim brojem: koliko su vam doneli.
      </p>
      <div className={c.ctas}>
        <Btn variant="accent">Zakažite razgovor</Btn>
        <Btn variant="ghost" arrow={false}>
          Tri pitanja za vaš plan
        </Btn>
      </div>
    </div>
  );
}
