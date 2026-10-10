const HYPHENATED = /(\S*\p{L}-\p{L}\S*)/u;
const ORDINAL = /(\d\.) (?=\p{Ll})/gu;

/** Text with the pairs that belong together kept on one line: a hyphenated
    word ("Barrel-ova", never "Barrel-" and "ova" a line apart) and a date's
    number with its month ("17. avgusta"). */
export default function Tie({ children }) {
  return String(children ?? "")
    .replace(ORDINAL, "$1 ")
    .split(HYPHENATED)
    .map((part, i) =>
      i % 2 && part.length <= 22
        ? // biome-ignore lint/suspicious/noArrayIndexKey: parts of one fixed string
          <span key={i} style={{ whiteSpace: "nowrap" }}>
            {part}
          </span>
        : part,
    );
}
