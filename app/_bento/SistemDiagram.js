"use client";

import s from "./sistem.module.css";

/**
 * The positioning drawn rather than listed: five channels wired into one
 * system that produces enquiries, instead of a menu of separate services.
 */

const CHANNELS = [
  "Plaćeno oglašavanje",
  "SEO",
  "Web",
  "Društvene mreže",
  "Brend",
];

const NODE_W = 268;
const NODE_H = 62;
const GAP = 20;
const HUB_X = 660;
const HUB_R = 62;
const VB_W = 1180;

export default function SistemDiagram() {
  const total = CHANNELS.length * NODE_H + (CHANNELS.length - 1) * GAP;
  const top = 34;
  const vbH = total + top * 2;
  const hubY = top + total / 2;

  return (
    <svg
      className={s.diagram}
      viewBox={`0 0 ${VB_W} ${vbH}`}
      role="img"
      aria-label="Pet kanala povezanih u jedan sistem koji donosi upite"
    >
      <title>Pet kanala povezanih u jedan sistem koji donosi upite</title>

      {/* wires first, so the nodes sit on top of them */}
      <g className={s.wires}>
        {CHANNELS.map((label, i) => {
          const y = top + i * (NODE_H + GAP) + NODE_H / 2;
          const x0 = NODE_W;
          const x1 = HUB_X - HUB_R;
          const mid = (x0 + x1) / 2;
          return (
            <path
              key={label}
              className={s.wire}
              style={{ "--d": `${i * 0.28}s` }}
              d={`M ${x0} ${y} C ${mid} ${y}, ${mid} ${hubY}, ${x1} ${hubY}`}
            />
          );
        })}
        <path
          className={s.wireOut}
          d={`M ${HUB_X + HUB_R} ${hubY} L ${VB_W - 330} ${hubY}`}
        />
      </g>

      {/* channels */}
      {CHANNELS.map((label, i) => {
        const y = top + i * (NODE_H + GAP);
        return (
          <g key={label}>
            <rect
              className={s.node}
              x="0"
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx="18"
            />
            <circle className={s.nodeDot} cx="30" cy={y + NODE_H / 2} r="5" />
            <text className={s.nodeText} x="52" y={y + NODE_H / 2 + 6}>
              {label}
            </text>
          </g>
        );
      })}

      {/* the hub */}
      <circle className={s.hubHalo} cx={HUB_X} cy={hubY} r={HUB_R + 16} />
      <circle className={s.hub} cx={HUB_X} cy={hubY} r={HUB_R} />
      <text className={s.hubText} x={HUB_X} y={hubY - 4} textAnchor="middle">
        jedan
      </text>
      <text className={s.hubText} x={HUB_X} y={hubY + 20} textAnchor="middle">
        sistem
      </text>

      {/* the outcome */}
      <rect
        className={s.outNode}
        x={VB_W - 330}
        y={hubY - 54}
        width="330"
        height="108"
        rx="22"
      />
      <text className={s.outLabel} x={VB_W - 298} y={hubY - 18}>
        REZULTAT
      </text>
      <text className={s.outText} x={VB_W - 298} y={hubY + 14}>
        Upiti koji se
      </text>
      <text className={s.outText} x={VB_W - 298} y={hubY + 42}>
        pretvaraju u posao
      </text>
    </svg>
  );
}
