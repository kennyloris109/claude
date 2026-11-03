import { ADDRESS_LINES, EMAIL, MAPS_URL, PHONE, PHONE_DISPLAY, credits } from "@/content"
import { FlagMark } from "./flags"

export function Footer() {
  return (
    <footer className="bg-deep pt-20 pb-10 text-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <FlagMark />
            <p className="mt-5 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.9] font-extrabold uppercase">
              Ocean Marine Services
            </p>
            <p className="mt-4 text-white/75">
              Ship Chandler and Marine Supply
              <br />
              Karachi, Pakistan
            </p>
            <p className="mt-6 max-w-[36ch] font-head text-2xl leading-snug font-semibold">
              Your reliable partner for marine and aviation supply.
            </p>
          </div>
          <div>
            <h2 className="font-head text-xl font-bold">Services</h2>
            <ul className="mt-3 grid gap-1 text-white/75">
              {["Ship chandling", "Marine bunker support", "Bulk fresh water supply", "Provisions", "Deck, engine and cabin stores", "Lubricants", "Port support", "Airline provisions and stores"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-head text-xl font-bold">Contact</h2>
            <a href={`tel:${PHONE}`} className="mt-3 block font-head text-2xl font-bold text-white tabular-nums no-underline hover:text-signal">
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="mt-2 block font-semibold break-all text-white underline decoration-signal decoration-2 hover:text-signal">
              {EMAIL}
            </a>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="mt-3 block text-white/75 no-underline hover:text-white">
              {ADDRESS_LINES.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </a>
            <a href="#quotation" className="mt-6 inline-flex h-11 items-center rounded-[3px] bg-signal px-5 font-head text-lg font-bold text-ink no-underline hover:bg-signal-hi">
              Request a quotation
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-6 text-sm text-white/60">
          <p className="font-semibold text-white/75">Image credits</p>
          <ul className="mt-2 grid gap-1">
            {credits.map((c) => (
              <li key={c.what}>
                {c.what}:{" "}
                <a href={c.href} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
                  {c.who}
                </a>
                , {c.license}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <span>© {new Date().getFullYear()} Ocean Marine Services</span>
            <span>Ship Chandling, Marine Supply, Port Support, Aviation Catering Supplies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
