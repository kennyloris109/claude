import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categories } from "@/content"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

export function Stores() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [cycle, setCycle] = useState(0)

  const select = (i: number) => {
    if (i === active) return
    setPrev(active)
    setActive(i)
    setCycle((c) => c + 1)
  }

  const current = categories[active]

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

        <Tabs
          value={current.id}
          onValueChange={(v) => select(categories.findIndex((c) => c.id === v))}
          className="mt-12 gap-6 lg:grid lg:grid-cols-[minmax(280px,0.85fr)_1.6fr] lg:items-stretch lg:gap-10"
        >
          {/* Category list */}
          <TabsList
            variant="line"
            className="-mx-4 h-auto w-auto flex-row group-data-horizontal/tabs:h-auto lg:h-full justify-start gap-2 overflow-x-auto rounded-none p-0 px-4 pb-1 lg:mx-0 lg:w-full lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-visible lg:border-t-2 lg:border-ink lg:px-0 lg:pb-0"
          >
            {categories.map((c, i) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className={cn(
                  "group/cat relative h-auto shrink-0 flex-none justify-start gap-4 overflow-hidden rounded-[3px] border border-rule bg-white px-4 py-3 text-left font-head text-lg font-bold text-steel shadow-none after:hidden",
                  "data-active:border-ink data-active:bg-ink! data-active:text-white! data-active:shadow-none",
                  "h-auto! lg:min-h-[88px] lg:flex-1 lg:rounded-none lg:border-0 lg:border-b lg:border-rule lg:bg-transparent lg:px-0 lg:py-4 lg:text-[1.75rem] lg:data-active:border-rule lg:data-active:bg-transparent! lg:data-active:text-ink!",
                  "hover:text-ink",
                )}
              >
                {/* Active marker: a small signal square that grows in */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden size-3 shrink-0 bg-signal transition-transform duration-500 ease-out-expo lg:block",
                    i === active ? "scale-100" : "scale-0 group-hover/cat:scale-50",
                  )}
                />
                <span className={cn("transition-transform duration-500 ease-out-expo", i === active ? "lg:translate-x-0" : "lg:-translate-x-7")}>
                  {c.name}
                </span>
                <span className="ml-auto hidden font-sans text-sm font-medium text-steel tabular-nums lg:inline">
                  {c.items.length} items
                </span>
                {/* Hover thumbnail peek */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none hidden h-14 w-20 shrink-0 overflow-hidden rounded-[2px] transition-[clip-path,opacity] duration-500 ease-out-expo lg:block",
                    i === active
                      ? "[clip-path:inset(0_0_0_0)] opacity-100"
                      : "[clip-path:inset(0_0_0_100%)] opacity-0 group-hover/cat:[clip-path:inset(0_0_0_0)] group-hover/cat:opacity-100",
                  )}
                >
                  <img src={c.image} alt="" loading="lazy" className="size-full object-cover" />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Stage */}
          <div
            role="tabpanel"
            aria-label={current.name}
            className="relative isolate aspect-[4/5] overflow-hidden rounded-[3px] bg-deep text-white shadow-[0_30px_60px_-30px_rgb(10_33_48/0.55)] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[600px]"
          >
            {categories.map((c, i) => {
              const isActive = i === active
              const isPrev = i === prev
              if (!isActive && !isPrev) return null
              return (
                <motion.div
                  key={isActive ? `a-${i}-${cycle}` : `p-${i}`}
                  className="absolute inset-0 overflow-hidden"
                  style={{ zIndex: isActive ? 2 : 1 }}
                  initial={isActive && cycle > 0 && !reduce ? { clipPath: "inset(0 0 0 100%)" } : false}
                  animate={{ clipPath: "inset(0 0 0 0%)" }}
                  transition={{ duration: 0.95, ease }}
                >
                  <img
                    src={c.image}
                    alt={c.alt}
                    loading="lazy"
                    decoding="async"
                    className={cn("size-full object-cover", isActive && !reduce && "push-in")}
                  />
                </motion.div>
              )
            })}
            <div className="absolute inset-0 z-[3] bg-linear-to-t from-deep via-deep/55 to-deep/0" />
            <div className="absolute inset-x-0 bottom-0 z-[4] p-6 sm:p-8 lg:p-10">
              <motion.h3
                key={`t-${current.id}`}
                initial={reduce ? false : { y: "0.6em", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease }}
                className="font-display text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[0.9] font-extrabold uppercase"
              >
                {current.name}
              </motion.h3>
              <ul key={`i-${current.id}`} className="mt-5 flex flex-wrap gap-2" aria-label={`${current.name} items`}>
                {current.items.map((it, k) => (
                  <motion.li
                    key={it}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.4 + k * 0.05, ease }}
                    className="rounded-[3px] border border-white/35 bg-deep/40 px-3 py-1.5 font-medium text-white backdrop-blur-sm"
                  >
                    {it}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
