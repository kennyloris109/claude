import { useRef } from "react"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Phone } from "lucide-react"
import { PHONE, PHONE_DISPLAY, portServices, type PortService } from "@/content"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

// Opens the quotation form on the matching tab.
export function requestQuote(service: string) {
  window.dispatchEvent(new CustomEvent("oms:quote", { detail: service }))
  document.getElementById("quotation")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function PortServices() {
  return (
    <>
      {portServices.map((s, i) => (
        <ServiceFeature key={s.id} s={s} dark={i === 0} flip={i % 2 === 1} />
      ))}
    </>
  )
}

function ServiceFeature({ s, dark, flip }: { s: PortService; dark: boolean; flip: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"])
  // Observe an unclipped wrapper: a fully clipped element never reports as in view.
  const photoWrap = useRef<HTMLDivElement>(null)
  const photoIn = useInView(photoWrap, { once: true, amount: 0.3 })
  const hidden = flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"

  return (
    <section
      id={s.id}
      ref={ref}
      aria-labelledby={`${s.id}-title`}
      className={cn("overflow-hidden py-24 sm:py-32", dark ? "bg-deep text-white" : "border-y border-rule bg-shoal text-ink")}
    >
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        {/* Photo */}
        <div ref={photoWrap} className={cn(flip && "lg:order-2")}>
        <motion.figure
          className="relative m-0 overflow-hidden rounded-[3px] shadow-[0_30px_60px_-30px_rgb(10_33_48/0.6)]"
          initial={reduce ? false : { clipPath: hidden }}
          animate={{ clipPath: reduce || photoIn ? "inset(0 0% 0 0%)" : hidden }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
            <motion.img
              src={s.image}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              style={{ y, scale: 1.14 }}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-deep/70 to-transparent" />
          </div>
          <figcaption className="absolute bottom-4 left-4 rounded-[2px] bg-deep/75 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {s.caption}
          </figcaption>
        </motion.figure>
        </div>

        {/* Copy */}
        <div>
          <h2 id={`${s.id}-title`} className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            {s.title}
          </h2>
          <p className={cn("mt-5 max-w-[56ch] text-lg", dark ? "text-white/80" : "text-on-shoal")}>{s.summary}</p>

          <h3 className="mt-10 font-head text-xl font-bold">What we coordinate</h3>
          <ul className={cn("mt-3 border-t-2", dark ? "border-white/70" : "border-ink")}>
            {s.coordinate.map((it, k) => (
              <motion.li
                key={it}
                initial={reduce ? false : { opacity: 0, x: flip ? 16 : -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: k * 0.06, ease }}
                className={cn(
                  "relative border-b py-3 pl-6 before:absolute before:top-[1.35em] before:left-0 before:size-[8px] before:bg-signal",
                  dark ? "border-white/15" : "border-rule",
                )}
              >
                {it}
              </motion.li>
            ))}
          </ul>

          <h3 className="mt-8 font-head text-xl font-bold">For a quote, send us</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {s.quoteNeeds.map((n) => (
              <li
                key={n}
                className={cn(
                  "rounded-[3px] border px-3 py-1.5 text-[0.95rem] font-medium",
                  dark ? "border-white/30 text-white" : "border-ink/25 bg-white text-ink",
                )}
              >
                {n}
              </li>
            ))}
          </ul>
          <p className={cn("mt-5 text-sm", dark ? "text-white/65" : "text-on-shoal")}>{s.note}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => requestQuote(s.id)}
              className="inline-flex h-12 items-center rounded-[3px] bg-signal px-6 font-head text-xl font-bold text-ink transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-signal-hi"
            >
              Request a {s.id === "bunker" ? "bunker" : "fresh water"} quotation
            </button>
            <a
              href={`tel:${PHONE}`}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-[3px] border-2 px-5 font-head text-xl font-bold no-underline transition-colors duration-200",
                dark ? "border-white/80 text-white hover:bg-white hover:text-ink" : "border-ink text-ink hover:bg-ink hover:text-chart",
              )}
            >
              <Phone className="size-5" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
