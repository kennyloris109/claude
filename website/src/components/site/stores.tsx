import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { airlineItems, categories, img, reasons } from "@/content"
import { cn } from "@/lib/utils"

export function Stores() {
  const [active, setActive] = useState(categories[0].id)
  const reduce = useReducedMotion()
  const current = categories.find((c) => c.id === active) ?? categories[0]

  return (
    <section id="stores" aria-labelledby="stores-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-2xl">
          <h2 id="stores-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            Supply categories
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-steel">
            What we regularly supply. Need something that is not listed? Add it to your requisition.
          </p>
        </div>

        <Tabs value={active} onValueChange={setActive} className="mt-12 gap-0 lg:grid lg:grid-cols-[minmax(240px,0.8fr)_1.6fr] lg:gap-12">
          <TabsList
            variant="line"
            className="h-auto w-full flex-row justify-start gap-0 overflow-x-auto rounded-none border-b-2 border-ink p-0 lg:flex-col lg:items-stretch lg:overflow-visible lg:border-b-0 lg:border-t-2"
          >
            {categories.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className={cn(
                  "h-auto shrink-0 flex-none justify-start rounded-none border-0 px-4 py-3 font-head text-xl font-bold text-steel after:hidden lg:border-b lg:border-rule lg:px-0 lg:py-4 lg:text-[1.7rem]",
                  "hover:text-ink data-active:bg-transparent data-active:text-ink data-active:shadow-none",
                  "relative before:absolute before:bottom-0 before:left-0 before:h-[3px] before:w-full before:origin-left before:scale-x-0 before:bg-signal before:transition-transform before:duration-300 data-active:before:scale-x-100",
                  "lg:before:top-1/2 lg:before:bottom-auto lg:before:left-auto lg:before:right-0 lg:before:h-[10px] lg:before:w-[10px] lg:before:-translate-y-1/2",
                )}
              >
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-8 lg:mt-0" forceMount hidden={c.id !== active}>
              {c.id === active && (
                <div className="grid gap-8 md:grid-cols-[1.45fr_1fr] md:items-end">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-ink">
                    <AnimatePresence initial={false}>
                      <motion.img
                        key={current.id}
                        src={current.image}
                        alt={current.alt}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </AnimatePresence>
                  </div>
                  <div>
                    <h3 className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-extrabold uppercase">{c.name}</h3>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {c.items.map((it, i) => (
                        <motion.li
                          key={it}
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.05 * i }}
                          className="rounded-[3px] border border-ink/25 bg-white px-3 py-1.5 font-medium"
                        >
                          {it}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export function Airline() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"])
  const reveal = useTransform(scrollYProgress, [0.05, 0.4], reduce ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(12% 10% 12% 10%)", "inset(0% 0% 0% 0%)"])

  return (
    <section id="airline" ref={ref} aria-labelledby="airline-title" className="overflow-hidden bg-deep py-24 text-white sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <motion.div style={{ clipPath: reveal }} className="relative aspect-[4/3] overflow-hidden rounded-[3px] lg:aspect-auto lg:min-h-[560px]">
          <motion.img
            src={img("aircraft-stand")}
            alt="Airliner at the stand at sunset with ground service vehicles alongside"
            loading="lazy"
            style={{ y, scale: 1.18 }}
            className="absolute inset-0 size-full object-cover"
          />
        </motion.div>

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
            <span className="whitespace-pre">24°54′ N  67°10′ E</span>
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
            <img src={img("produce-shelf")} alt="Shelves of fresh vegetables and fruit" loading="lazy" className="size-full object-cover" />
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
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
  const words = COMMIT.split(" ")

  return (
    <section aria-labelledby="commit-title" className="py-24 sm:py-36">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <h2 id="commit-title" className="font-head text-2xl font-bold text-steel">
          Our commitment
        </h2>
        <p ref={ref} className="mt-6 max-w-[18ch] font-display text-[clamp(2.8rem,7.5vw,6rem)] leading-[0.95] font-extrabold uppercase">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
              {w}
            </Word>
          ))}
        </p>
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
  const color = useTransform(progress, range, still ? ["#0E2A3B", "#0E2A3B"] : ["#A9BAC3", "#0E2A3B"])
  return (
    <motion.span style={{ color }} className="inline-block pr-[0.25em]">
      {children}
    </motion.span>
  )
}
