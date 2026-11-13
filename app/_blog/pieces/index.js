/* Bespoke pieces, one file per post, so each post gets its own interactions
   instead of one template for all (Luka, 13 Nov 2026). Used in the post's
   Markdown as:
     ```piece
     name: <piece name>
     …any lines the piece reads
     ```                                                                    */
import { PIECES as ads } from "./ads";
import { PIECES as ai } from "./ai";
import { PIECES as instagram } from "./instagram";
import { PIECES as odrzavanje } from "./odrzavanje";
import { PIECES as recenzije } from "./recenzije";

export const BESPOKE = { ...recenzije, ...ads, ...instagram, ...odrzavanje, ...ai };
