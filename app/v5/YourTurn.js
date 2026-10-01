"use client";

import Audit from "./Audit";
import b from "./base.module.css";
import { Chapter, Reveal } from "./ui";
import y from "./yourturn.module.css";

export default function YourTurn() {
  return (
    <section className={y.section} data-theme="light">
      <div className={b.container}>
        <Chapter
          n="4"
          name="Vaš sajt"
          id="dijagnoza"
          title={
            <>
              Sad vi. <em>Koliko je brz vaš sajt?</em>
            </>
          }
          sub="Isti test kojim Google ocenjuje sajtove na telefonu. Za dvadesetak sekundi vidite ocenu, šta kasni i šta bismo prvo popravili."
        />
        <div className={y.console}>
          <Audit />
        </div>
        <div className={y.facts}>
          <Reveal className={y.fact}>
            <b>+32%</b>
            <span>
              veća verovatnoća da posetilac ode kad se stranica učitava 3 s
              umesto 1 s
            </span>
            <cite>Google / SOASTA, 2017</cite>
          </Reveal>
          <Reveal i={1} className={y.fact}>
            <b>27,6%</b>
            <span>
              klikova ide na prvi organski rezultat, deset puta više nego na
              deseti
            </span>
            <cite>Backlinko, 4 miliona rezultata</cite>
          </Reveal>
          <Reveal i={2} className={y.fact}>
            <b>0,63%</b>
            <span>ljudi klikne bilo šta na drugoj strani Google-a</span>
            <cite>Backlinko, 4 miliona rezultata</cite>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
