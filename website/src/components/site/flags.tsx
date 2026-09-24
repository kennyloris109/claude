import type { SVGProps } from "react"

type FlagProps = SVGProps<SVGSVGElement> & { title?: string }

// International Code of Signals flags for the company initials.
export function FlagO(props: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" {...props}>
      <path d="M0 0h30v20H0z" fill="#F4C20D" />
      <path d="M0 0h30v20z" fill="#C8102E" />
    </svg>
  )
}

export function FlagM(props: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" {...props}>
      <path d="M0 0h30v20H0z" fill="#1D4F9C" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#fff" strokeWidth="4.4" />
    </svg>
  )
}

export function FlagS(props: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" {...props}>
      <path d="M0 0h30v20H0z" fill="#fff" />
      <path d="M10 6.5h10v7H10z" fill="#1D4F9C" />
    </svg>
  )
}

export const flagSet = [
  { Flag: FlagO, letter: "O", name: "Oscar" },
  { Flag: FlagM, letter: "M", name: "Mike" },
  { Flag: FlagS, letter: "S", name: "Sierra" },
]

export function FlagMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-[2px] ${className}`} aria-hidden="true">
      {flagSet.map(({ Flag, letter }) => (
        <Flag key={letter} className="h-3 w-[18px] ring-1 ring-black/10" />
      ))}
    </span>
  )
}
