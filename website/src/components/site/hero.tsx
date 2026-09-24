import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { heroSlides } from "@/content"
import { cn } from "@/lib/utils"
import { flagSet } from "./flags"

const SLIDE_MS = 7000
const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [cycle, setCycle] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const go = useCallback(
    (next: number) => {
      const n = (next + heroSlides.length) % heroSlides.length
      if (n === index) return
      setPrev(index)
      setCycle((c) => c + 1)
      setIndex(n)
    },
    [index],
  )

  // Autoplay, stopped by the pause control, reduced motion, or a hidden tab.
  useEffect(() => {
    window.clearTimeout(timer.current)
    if (paused || reduce) return
    timer.current = window.setTimeout(() => go(index + 1), SLIDE_MS)
    return () => window.clearTimeout(timer.current)
  }, [index, paused, reduce, go, cycle])

  useEffect(() => {
    const onVis = () => setPaused((p) => (document.hidden ? true : p))
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  const slide = heroSlides[index]

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Karachi Harbour and airline supply photographs"
      className="relative isolate flex min-h-[max(680px,100svh)] flex-col overflow-hidden bg-deep text-white"
    >
      {/* Slides */}
      <div className="absolute inset-0 -z-10" aria-live={paused ? "polite" : "off"}>
        {heroSlides.map((s, i) => {
          const active = i === index
          const under = i === prev
          if (!active && !under) return null
          return (
            <motion.div
              key={active ? `a-${i}-${cycle}` : `u-${i}`}
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: active ? 2 : 1 }}
              initial={active && cycle > 0 && !reduce ? { clipPath: "inset(0 0 0 100%)" } : false}
              animate={{ clipPath: "inset(0 0 0 0%)" }}
              transition={{ duration: 1.15, ease }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${heroSlides.length}: ${s.detail}`}
              aria-hidden={!active}
            >
              <img
                src={s.image}
                alt={s.alt}
                className={cn("size-full object-cover", active && "push-in")}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
              />
            </motion.div>
          )
        })}
        {/* Legibility wash: deepest behind the wordmark, clear across the sky. */}
        <div className="absolute inset-0 z-[3] bg-linear-to-t from-deep via-deep/55 to-deep/10" />
        <div className="absolute inset-0 z-[3] bg-linear-to-r from-deep/70 via-deep/20 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 items-end gap-10 px-4 pt-28 pb-8 sm:px-8 lg:pb-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(3.4rem,11vw,6rem)] leading-[0.86] font-extrabold tracking-[0.01em] uppercase">
            {["Ocean", "Marine", "Services"].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            <p className="mt-6 font-head text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.25] font-semibold">
              Reliable supply. Professional service. Portside support.
            </p>
            <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-white/85">
              Ship chandling, marine supply and port support for vessels calling at Karachi Port and Port Qasim, plus
              provisions and stores for foreign-going airlines.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#quotation"
                className="inline-flex h-12 items-center rounded-[3px] bg-signal px-6 font-head text-xl font-bold text-ink no-underline shadow-[0_10px_30px_-12px_rgb(244_194_13/0.7)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-signal-hi"
              >
                Request a quotation
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center rounded-[3px] border-2 border-white/80 px-6 font-head text-xl font-bold text-white no-underline transition-colors duration-200 hover:bg-white hover:text-ink"
              >
                See our services
              </a>
            </div>
          </motion.div>
        </div>

        {/* Signal hoist: the company initials in International Code of Signals flags. */}
        <div className="relative ml-auto hidden self-center pl-6 md:block" aria-label="Signal flags O, M and S, the company initials">
          <motion.span
            className="absolute top-[-3rem] bottom-[-2rem] left-0 w-[3px] origin-top rounded-full bg-white/85"
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease }}
            aria-hidden="true"
          />
          <ul className="flex flex-col gap-4">
            {flagSet.map(({ Flag, letter, name }, i) => (
              <motion.li
                key={letter}
                className="flex items-center gap-3"
                initial={reduce ? false : { y: 160, rotate: -4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.35 + (2 - i) * 0.1, ease }}
              >
                <Flag className="h-auto w-[clamp(70px,8vw,120px)] shadow-[0_12px_24px_-10px_rgb(0_0_0/0.6)]" />
                <span className="font-head text-lg font-semibold text-white/85">
                  <b className="text-white">{letter}</b> {name}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Slide rail */}
      <div className="border-t border-white/20 bg-deep/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8 sm:py-4">
          <div className="w-full min-w-0 sm:w-auto sm:flex-1" aria-live="polite">
            <p className="font-head text-lg leading-tight font-bold">{slide.place}</p>
            <p className="text-sm text-white/75 tabular-nums">
              {slide.detail}
              {slide.coord && <span className="ml-3 hidden whitespace-pre text-white/60 sm:inline">{slide.coord}</span>}
            </p>
          </div>

          <div className={cn("flex flex-1 items-center gap-2 sm:flex-none", paused && "rail-paused")}>
            {heroSlides.map((s, i) => (
              <button
                key={s.detail}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}: ${s.detail}`}
                aria-current={i === index}
                className="group relative h-11 flex-1 sm:w-14 sm:flex-none"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45">
                  {i < index && <span className="absolute inset-0 bg-white/70" />}
                  {i === index && (
                    <span
                      key={`${index}-${cycle}`}
                      className={cn("absolute inset-0 bg-signal", reduce ? "" : "rail-fill")}
                      style={{ ["--rail-duration" as string]: `${SLIDE_MS}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <RailButton label="Previous slide" onClick={() => go(index - 1)}>
              <ChevronLeft className="size-5" />
            </RailButton>
            <RailButton label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </RailButton>
            <RailButton label="Next slide" onClick={() => go(index + 1)}>
              <ChevronRight className="size-5" />
            </RailButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function RailButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-[3px] border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
    >
      {children}
    </button>
  )
}
