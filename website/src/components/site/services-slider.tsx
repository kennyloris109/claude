import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"
import { services } from "@/content"
import { cn } from "@/lib/utils"

const SLIDE_MS = 6500
const PARALLAX = 0.18
const ease = [0.16, 1, 0.3, 1] as const

export function Services() {
  const reduce = useReducedMotion()
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false, duration: 32 })
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [cycle, setCycle] = useState(0)
  const parallaxNodes = useRef<HTMLElement[]>([])
  const frameNodes = useRef<HTMLElement[]>([])

  // Cursor badge that follows the pointer over the slider (fine pointers only).
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const sx = useSpring(cx, { stiffness: 420, damping: 38, mass: 0.5 })
  const sy = useSpring(cy, { stiffness: 420, damping: 38, mass: 0.5 })

  const setNodes = useCallback((a: EmblaCarouselType) => {
    parallaxNodes.current = a.slideNodes().map((n) => n.querySelector("[data-parallax]") as HTMLElement)
    frameNodes.current = a.slideNodes().map((n) => n.querySelector("[data-frame]") as HTMLElement)
  }, [])

  // Parallax + depth: images drift against the drag; side slides recede and dim.
  const tween = useCallback(
    (a: EmblaCarouselType, event?: EmblaEventType) => {
      if (reduce) return
      const engine = a.internalEngine()
      const progress = a.scrollProgress()
      const inView = a.slidesInView()
      const isScroll = event === "scroll"
      const factor = PARALLAX * a.scrollSnapList().length

      a.scrollSnapList().forEach((snap, snapIndex) => {
        let diff = snap - progress
        engine.slideRegistry[snapIndex].forEach((slideIndex) => {
          if (isScroll && !inView.includes(slideIndex)) return
          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((lp) => {
              const target = lp.target()
              if (slideIndex === lp.index && target !== 0) {
                const sign = Math.sign(target)
                if (sign === -1) diff = snap - (1 + progress)
                if (sign === 1) diff = snap + (1 - progress)
              }
            })
          }
          const p = parallaxNodes.current[slideIndex]
          const f = frameNodes.current[slideIndex]
          if (p) p.style.transform = `translate3d(${diff * -1 * factor * 100}%,0,0)`
          if (f) {
            const d = Math.min(1, Math.abs(diff) * a.scrollSnapList().length)
            f.style.transform = `scale(${1 - d * 0.08})`
            f.style.filter = `brightness(${1 - d * 0.45}) saturate(${1 - d * 0.35})`
          }
        })
      })
    },
    [reduce],
  )

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setSelected(api.selectedScrollSnap())
      setCycle((c) => c + 1)
    }
    setNodes(api)
    tween(api)
    onSelect()
    api
      .on("select", onSelect)
      .on("reInit", setNodes)
      .on("reInit", tween)
      .on("scroll", tween)
      .on("slideFocus", tween)
    return () => {
      api.off("select", onSelect).off("reInit", setNodes).off("reInit", tween).off("scroll", tween).off("slideFocus", tween)
    }
  }, [api, setNodes, tween])

  const halted = paused || hovering || !!reduce

  const onRailEnd = () => {
    if (!halted) api?.scrollNext()
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    cx.set(e.clientX - r.left)
    cy.set(e.clientY - r.top)
  }

  return (
    <section id="services" aria-labelledby="services-title" className="overflow-hidden bg-chart py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 id="services-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
              Everything a vessel needs, from the galley to the engine room
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-steel">Six services, one supplier at Karachi Port and Port Qasim.</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="mr-2 font-head text-2xl font-semibold tabular-nums" aria-live="polite">
              <span className="text-ink">{String(selected + 1).padStart(2, "0")}</span>
              <span className="text-steel"> / {String(services.length).padStart(2, "0")}</span>
            </p>
            <CtrlButton label="Previous service" onClick={() => api?.scrollPrev()}>
              <ArrowLeft className="size-5" />
            </CtrlButton>
            <CtrlButton label={paused ? "Play services" : "Pause services"} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </CtrlButton>
            <CtrlButton label="Next service" onClick={() => api?.scrollNext()}>
              <ArrowRight className="size-5" />
            </CtrlButton>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div
        className="relative mt-12 md:cursor-none"
        onPointerMove={onMove}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocusCapture={() => setHovering(true)}
        onBlurCapture={() => setHovering(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Services. Use the left and right arrow keys to move between services."
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") api?.scrollPrev()
          if (e.key === "ArrowRight") api?.scrollNext()
        }}
      >
        <div ref={viewportRef} className="overflow-hidden">
          <div className="flex touch-pan-y [backface-visibility:hidden]">
            {services.map((s, i) => {
              const active = i === selected
              return (
                <div
                  key={s.id}
                  className="min-w-0 flex-[0_0_88%] pl-4 sm:flex-[0_0_78%] sm:pl-6 lg:flex-[0_0_66%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${services.length}: ${s.title}`}
                >
                  <article
                    data-frame
                    className="relative overflow-hidden rounded-[3px] bg-deep shadow-[0_30px_60px_-30px_rgb(10_33_48/0.55)] will-change-transform"
                  >
                    {/* Photo with parallax room on both sides */}
                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9]">
                      <div data-parallax className="absolute inset-y-0 -left-[18%] w-[136%] will-change-transform">
                        <img
                          src={s.image}
                          alt={s.alt}
                          draggable={false}
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                          className={cn(
                            "size-full object-cover transition-transform duration-[2400ms] ease-out-expo",
                            active && !reduce ? "scale-[1.04]" : "scale-100",
                          )}
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-deep/95 via-deep/35 to-transparent md:bg-linear-to-r md:from-deep/90 md:via-deep/45 md:to-transparent" />

                      {/* Overlay copy (tablet and up) */}
                      <div className="absolute inset-0 hidden flex-col justify-end p-8 text-white md:flex lg:p-10">
                        <SlideCopy s={s} active={active} reduce={!!reduce} />
                      </div>
                      {/* Title only on phones; details sit below */}
                      <h3 className="absolute right-5 bottom-5 left-5 font-head text-[1.9rem] leading-[1.02] font-bold text-white md:hidden">
                        {s.title}
                      </h3>
                    </div>
                    <div className="bg-deep p-5 text-white md:hidden">
                      <p className="text-white/85">{s.summary}</p>
                      {s.items && (
                        <ul className="mt-3 grid gap-1.5">
                          {s.items.map((it) => (
                            <li key={it} className="relative pl-4 text-[0.95rem] text-white/75 before:absolute before:top-[0.6em] before:left-0 before:size-[6px] before:bg-signal">
                              {it}
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.note && <p className="mt-3 text-sm text-white/65">{s.note}</p>}
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drag badge */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
            style={{ x: sx, y: sy }}
          >
            <motion.span
              className="flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal font-head text-lg font-bold text-ink shadow-[0_10px_30px_-10px_rgb(10_33_48/0.6)]"
              animate={{ scale: hovering ? 1 : 0, opacity: hovering ? 1 : 0 }}
              transition={{ duration: 0.3, ease }}
            >
              Drag
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Chapter strip with autoplay timers */}
      <div className="mx-auto mt-10 max-w-[1320px] px-4 sm:px-8">
        <ol className={cn("-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-4 sm:overflow-visible sm:px-0", halted && "rail-paused")}>
          {services.map((s, i) => (
            <li key={s.id} className="min-w-[44%] snap-start sm:min-w-0">
              <button
                type="button"
                onClick={() => {
                  api?.scrollTo(i)
                }}
                aria-current={i === selected}
                className="group block w-full pt-3 text-left"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-rule">
                  {i === selected ? (
                    <span
                      key={`${i}-${cycle}`}
                      className={cn("absolute inset-0 bg-signal", !reduce && "rail-fill")}
                      style={{ ["--rail-duration" as string]: `${SLIDE_MS}ms` }}
                      onAnimationEnd={onRailEnd}
                    />
                  ) : (
                    <span className="absolute inset-0 origin-left scale-x-0 bg-ink/50 transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </span>
                <span
                  className={cn(
                    "mt-3 block font-head text-lg leading-tight font-bold transition-colors duration-300",
                    i === selected ? "text-ink" : "text-steel group-hover:text-ink",
                  )}
                >
                  {s.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function SlideCopy({ s, active, reduce }: { s: (typeof services)[number]; active: boolean; reduce: boolean }) {
  const show = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: active ? 1 : 0.35 } }
      : {
          initial: false as const,
          animate: active
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 18, filter: "blur(4px)" },
          transition: { duration: 0.7, delay: active ? delay : 0, ease },
        }

  return (
    <div className="max-w-[40rem]">
      <motion.h3 {...show(0.05)} className="font-head text-[clamp(2rem,3.4vw,3.2rem)] leading-[0.98] font-bold">
        {s.title}
      </motion.h3>
      <motion.p {...show(0.15)} className="mt-3 max-w-[52ch] text-lg text-white/85">
        {s.summary}
      </motion.p>
      {s.items && (
        <ul className="mt-5 grid max-w-[36rem] grid-cols-2 gap-x-6 gap-y-1.5">
          {s.items.map((it, k) => (
            <motion.li
              key={it}
              {...show(0.25 + k * 0.035)}
              className="relative pl-4 text-[0.95rem] leading-snug text-white/80 before:absolute before:top-[0.55em] before:left-0 before:size-[6px] before:bg-signal"
            >
              {it}
            </motion.li>
          ))}
        </ul>
      )}
      {s.note && (
        <motion.p {...show(0.3)} className="mt-4 text-sm text-white/70">
          {s.note}
        </motion.p>
      )}
    </div>
  )
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-12 items-center justify-center rounded-[3px] border-2 border-ink text-ink transition-colors duration-200 hover:bg-ink hover:text-chart"
    >
      {children}
    </button>
  )
}
