"""Share images (1200x630) for the service pages and the hub.
Dev-only: python3 scripts/og.py  ->  public/og/<slug>.png
Uses the brand book's system module (embedded Manrope, mark) and its sticker PNGs."""
import asyncio, base64, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

GH = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(GH / "brand-books" / "digitl" / "src"))
from sysd import *  # noqa

OUTD = Path(__file__).resolve().parents[1] / "public" / "og"
STK = GH / "brand-books" / "digitl" / "out" / "art"
CONTENT = Path(__file__).resolve().parents[1] / "app" / "_usluge" / "content"


def b64(p):
    return "data:image/png;base64," + base64.b64encode(Path(p).read_bytes()).decode()


def field(slug, name):
    s = (CONTENT / f"{slug}.js").read_text()
    m = re.search(rf'^\s*{name}:\s*"([^"]+)"', s, re.M)
    return m.group(1) if m else ""


PAGES = [
    ("placeno-oglasavanje", "ads"), ("seo-optimizacija", "seo"), ("izrada-sajta", "web"),
    ("vodjenje-drustvenih-mreza", "social"), ("brending-i-vizuelni-identitet", "brand"), ("ai-automatizacija", "ai"),
]


def card(label, title, sticker, sub="digitl.rs/usluge"):
    st = f"<img src='{b64(STK / f'stiker-{sticker}.png')}' style='position:absolute;right:70px;top:150px;width:300px;height:300px;transform:rotate(7deg)'>" if sticker else \
        "".join(f"<img src='{b64(STK / f'stiker-{k}.png')}' style='position:absolute;width:150px;height:150px;left:{x}px;top:{y}px;transform:rotate({r}deg)'>"
                for k, x, y, r in [("ads", 760, 90, -8), ("seo", 950, 120, 7), ("web", 820, 270, -4), ("social", 1000, 300, 9), ("brand", 760, 430, -6), ("ai", 950, 450, 5)])
    body = (f"<div style='position:absolute;inset:0;background:{BLUE_BG}'></div>"
            f"<div style='position:absolute;left:70px;top:62px'>{logo(44, '#fff')}</div>{st}"
            f"<div style='position:absolute;left:70px;bottom:70px;width:{680 if sticker else 640}px;color:#fff'>"
            f"<div class='eb' style='font-size:20px;color:{LIME}'>{label}</div>"
            f"<h1 style='font-size:{76 if len(title) < 30 else 64}px;line-height:.98;margin-top:16px'>{title}</h1>"
            f"<div style='font-size:24px;font-weight:600;margin-top:22px;opacity:.8'>{sub}</div></div>")
    return doc(1200, 630, body, BLUE)


async def main():
    jobs = [(slug, card(field(slug, 'label'), field(slug, 'h1'), k)) for slug, k in PAGES]
    jobs.append(("usluge", card("Usluge", "Usluge digitalnog marketinga", None, "digitl.rs/usluge")))
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1200, "height": 630})
        for name, html in jobs:
            await pg.set_content(html); await pg.wait_for_timeout(250)
            await pg.screenshot(path=str(OUTD / f"{name}.png")); print(name)
        await b.close()

asyncio.run(main())
