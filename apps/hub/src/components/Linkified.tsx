// Renders plain assistant text with URLs turned into clickable links that
// open in a new tab. No markdown engine — just enough for "open the deck"
// to hand back something clickable.
const URL_RE = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g

export function Linkified({ text }: { text: string }) {
  // With a capturing group, split() alternates text/match — odd indices are URLs.
  const parts = text.split(URL_RE)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="text-cyan underline decoration-cyan/40 underline-offset-2 transition-colors duration-150 hover:text-cyan-400"
          >
            {part.length > 60 ? `${part.slice(0, 57)}…` : part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
