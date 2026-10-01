"use client";

import { useEffect, useState } from "react";
import World, { CITIES } from "../_bento/World";
import o from "./globe.module.css";

// Stable reference: the globe redraws from scratch whenever its pins change.
const PINS = [CITIES.belgrade, CITIES.london];

function useClock(tz) {
  const [t, setT] = useState(null);
  useEffect(() => {
    const read = () =>
      setT(
        new Date().toLocaleTimeString("sr-RS", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: tz,
        }),
      );
    read();
    const id = setInterval(read, 15000);
    return () => clearInterval(id);
  }, [tz]);
  return t ?? "--:--";
}

export default function Globe() {
  const bg = useClock("Europe/Belgrade");
  const ld = useClock("Europe/London");
  return (
    <div className={o.wrap}>
      <div className={o.stage}>
        <World mode="globe" pins={PINS} className={o.world} />
      </div>
      <div className={o.side}>
        <span className={o.label}>Dve kancelarije, jedan tim</span>
        <div className={o.city}>
          <i data-c="bg" />
          <span>
            <b>Beograd</b>
            <em>Srbija</em>
          </span>
          <strong>{bg}</strong>
        </div>
        <div className={o.city}>
          <i data-c="ld" />
          <span>
            <b>London</b>
            <em>Ujedinjeno Kraljevstvo</em>
          </span>
          <strong>{ld}</strong>
        </div>
        <p className={o.text}>
          Radimo sa klijentima u Srbiji i van nje. Sat je pravi, globus se vrti.
        </p>
      </div>
    </div>
  );
}
