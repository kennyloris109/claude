export { Stores } from "./stores-catalogue"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { airlineItems, img, reasons } from "@/content"

export function Airline() {
  return (
    <section id="airline" aria-labelledby="airline-title" className="overflow-hidden bg-deep py-24 text-white sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] lg:aspect-auto lg:min-h-[560px]">
          <img
            src={img("aircraft-stand")}
            alt="Airliner at the stand at sunset with ground service vehicles alongside"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 id="airline-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            Airline provisions and stores
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg text-white/80">
            We provide provisions and stores for foreign-going airlines, supporting airline catering and operational
            requirements.
          </p>
          <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {airlineItems.map((it) => (
              <li key={it} className="relative border-b border-white/12 py-2 pl-5 before:absolute before:top-[1.05em] before:left-0 before:size-[7px] before:bg-signal">
                {it}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[52ch] font-head text-xl leading-snug font-semibold text-white">
            All supplies are handled according to the applicable customs, airport, airline and food-safety requirements.
          </p>
          <p className="mt-3 text-white/70 tabular-nums">
            Jinnah International Airport, Karachi
            <br />
            <span>24°54′N 67°10′E</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="bg-shoal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="why-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            Why vessels choose Ocean Marine Services
          </h2>
          <div className="mt-8 aspect-[4/3] overflow-hidden rounded-[3px]">
            <img src={img("manora-harbour-launches")} alt="Harbour launches moored off Manora, Karachi" loading="lazy" className="size-full object-cover" />
          </div>
        </div>
        <ul className="border-t-2 border-ink">
          {reasons.map((r) => (
            <li key={r.title} className="group grid gap-2 border-b border-rule py-8 sm:grid-cols-[minmax(200px,0.8fr)_1.2fr] sm:gap-8">
              <h3 className="font-head text-[1.9rem] leading-[1.02] font-bold transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                {r.title}
              </h3>
              <p className="max-w-[48ch] text-lg text-on-shoal">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const COMMIT = "To deliver the right products, at the right time, at the right place."

export function Commitment() {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
  const words = COMMIT.split(" ")

  return (
    <section aria-labelledby="commit-title" className="py-24 sm:py-36">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <h2 id="commit-title" ref={ref} className="max-w-[18ch] font-display text-[clamp(2.8rem,7.5vw,6rem)] leading-[0.95] font-extrabold uppercase">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
              {w}
            </Word>
          ))}
        </h2>
        <p className="mt-10 max-w-[62ch] text-lg text-steel">
          We understand the importance of vessel schedules, crew requirements and operational continuity. Our team works
          closely with vessel operators, ship managers, ship agents and procurement teams to provide dependable supply
          solutions.
        </p>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  range: [number, number]
  still: boolean
}) {
  const color = useTransform(progress, range, still ? ["#0E2A3B", "#0E2A3B"] : ["#3F5868", "#0E2A3B"])
  return (
    <motion.span style={{ color }} className="inline-block pr-[0.25em]">
      {children}
    </motion.span>
  )
}
