import { Search } from "./icons";
import k from "./stickerScenes.module.css";

/* The service cards' scenes for /v2: the same small stories the homepage
   cards tell (clicks become enquiries, your result climbs to first, a site
   assembles and scores 100, a week of posts fills in, a brand becomes one
   system), drawn in the service pages' sticker language: flat brand
   colours, an ink outline and a white sticker edge. Each loops in CSS. */

/* ads: clicks from search and from Meta travel into an inbox that counts */
function AdsScene() {
  return (
    <span className={k.ads} aria-hidden="true">
      <span className={`${k.stk} ${k.chip} ${k.chipG}`}>
        <i>G</i>Pretraga
      </span>
      <span className={`${k.stk} ${k.chip} ${k.chipM}`}>
        <i>M</i>Meta
      </span>
      <svg className={k.paths} viewBox="0 0 240 160">
        <path d="M96 41 C 122 41, 118 76, 146 76" />
        <path d="M80 119 C 116 119, 118 88, 146 88" />
      </svg>
      <i className={`${k.click} ${k.c1}`} />
      <i className={`${k.click} ${k.c2}`} />
      <i className={`${k.click} ${k.c3}`} />
      <span className={`${k.stk} ${k.inbox}`}>
        <b>Novi upiti</b>
        <span className={`${k.row} ${k.r1}`}>
          <i data-k="g" />
          <em />
        </span>
        <span className={`${k.row} ${k.r2}`}>
          <i data-k="m" />
          <em />
        </span>
        <span className={`${k.row} ${k.r3}`}>
          <i data-k="g" />
          <em />
        </span>
        <span className={`${k.stk} ${k.count}`}>
          <span className={k.n1}>1</span>
          <span className={k.n2}>2</span>
          <span className={k.n3}>3</span>
        </span>
      </span>
    </span>
  );
}

/* seo: four results; yours climbs from fourth to first and gets stamped */
function SeoScene() {
  return (
    <span className={k.seo} aria-hidden="true">
      <span className={`${k.stk} ${k.serp}`}>
        <span className={k.bar}>
          <Search size={10} strokeWidth={2.8} /> pretraga vaših kupaca
        </span>
        <span className={k.results}>
          <span className={`${k.res} ${k.ra}`}>
            <i />
            <em />
          </span>
          <span className={`${k.res} ${k.rb}`}>
            <i />
            <em />
          </span>
          <span className={`${k.res} ${k.rc}`}>
            <i />
            <em />
          </span>
          <span className={`${k.res} ${k.you}`}>
            <i />
            <em />
            <b>vi</b>
          </span>
        </span>
      </span>
      <span className={`${k.stk} ${k.stamp}`}>1</span>
    </span>
  );
}

/* web: the page puts itself together, then four 100s pop on */
function WebScene() {
  return (
    <span className={k.web} aria-hidden="true">
      <span className={`${k.stk} ${k.browser}`}>
        <span className={k.chrome}>
          <i data-c="coral" />
          <i data-c="lime" />
          <i data-c="blue" />
          <em>vasafirma.rs</em>
        </span>
        <span className={k.page}>
          <span className={`${k.blk} ${k.navl}`} />
          <span className={`${k.blk} ${k.h1}`} />
          <span className={`${k.blk} ${k.line}`} />
          <span className={`${k.blk} ${k.cta}`} />
          <span className={`${k.blk} ${k.img}`} />
        </span>
      </span>
      <span className={k.scores}>
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className={`${k.stk} ${k.score}`} data-n={n}>
            100
          </span>
        ))}
      </span>
    </span>
  );
}

/* social: the week's grid fills in, the post goes out, a heart comes back */
function SocialScene() {
  return (
    <span className={k.social} aria-hidden="true">
      <span className={`${k.stk} ${k.posted}`}>Objavljeno</span>
      <span className={`${k.stk} ${k.phone}`}>
        <span className={k.handle}>
          <i />
          <em />
        </span>
        <span className={k.grid}>
          {Array.from({ length: 9 }, (_, n) => (
            <i key={n} data-n={n} />
          ))}
        </span>
      </span>
      <span className={`${k.stk} ${k.bubble}`}>♥</span>
      <span className={`${k.stk} ${k.plus}`}>+24</span>
    </span>
  );
}

/* brand: three swatches fan out, the type and the mark join them */
function BrandScene() {
  return (
    <span className={k.brand} aria-hidden="true">
      <span className={`${k.stk} ${k.hex}`}>#2A29FF</span>
      <span className={k.fan}>
        <i className={`${k.stk} ${k.sw} ${k.swA}`} />
        <i className={`${k.stk} ${k.sw} ${k.swB}`} />
        <i className={`${k.stk} ${k.sw} ${k.swC}`} />
        <i className={`${k.stk} ${k.mark}`} />
      </span>
      <span className={`${k.stk} ${k.type}`}>
        <b>Aa</b>
        <em>Manrope</em>
      </span>
    </span>
  );
}

export const SCENES = {
  ads: AdsScene,
  seo: SeoScene,
  web: WebScene,
  social: SocialScene,
  brand: BrandScene,
};
