import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useReducedMotion } from "motion/react"
import { img, portCallSteps } from "@/content"
import { cn } from "@/lib/utils"

// Route traced on the 1918 Admiralty chart crop (viewBox matches the 1400 x 1800 image):
// Examination Anchorage, up the channel east of Manora, to the Kiamari wharves.
const ROUTE =
  "M385 1195 C450 1100 540 1020 554 965 C568 900 530 820 508 757 C480 670 450 580 431 505 C410 420 390 360 377 298 C368 250 352 200 346 161"

// Where each step sits along the route (0 to 1) and the scroll point where it becomes active.
const STATIONS = [0, 0.3, 0.62, 1]
const THRESHOLDS = [0, 0.22, 0.5, 0.8]

export function PortCall() {
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)
  const [step, setStep] = useState(0)
  const [ship, setShip] = useState({ x: 385, y: 1195, a: -40 })
  const [stationPts, setStationPts] = useState<{ x: number; y: number }[]>([])

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const p = path.current
    if (!p) return
    const len = p.getTotalLength()
    setStationPts(STATIONS.map((t) => {
      const pt = p.getPointAtLength(t * len)
      return { x: pt.x, y: pt.y }
    }))
  }, [])

  useMotionValueEvent(reduce ? scrollYProgress : progress, "change", (v) => {
    const t = Math.max(0, Math.min(1, v))
    const p = path.current
    if (p) {
      const len = p.getTotalLength()
      const a = p.getPointAtLength(t * len)
      const b = p.getPointAtLength(Math.min(len, t * len + 4))
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      setShip({ x: a.x, y: a.y, a: t >= 0.999 ? ship.a : angle })
    }
    let s = 0
    THRESHOLDS.forEach((th, i) => {
      if (t >= th) s = i
    })
    setStep(s)
  })

  return (
    <section
      id="port-call"
      ref={section}
      aria-labelledby="port-call-title"
      className="relative h-[320svh] bg-ink text-white lg:h-[360svh]"
    >
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row">
          {/* Copy and steps */}
          <div className="relative z-10 flex flex-col justify-end px-4 pt-20 pb-6 sm:px-8 lg:w-[46%] lg:justify-center lg:py-24 lg:pr-12 lg:pl-[max(2rem,calc((100vw-1320px)/2+2rem))]">
            <h2 id="port-call-title" className="font-head text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[0.98] font-bold">
              A port call, supplied
            </h2>
            <p className="mt-4 hidden max-w-[48ch] text-lg text-white/75 sm:block">
              From the anchorage to the wharf: how a requisition becomes stores delivered alongside at Karachi.
            </p>

            <ol className="mt-6 hidden lg:mt-10 lg:grid lg:gap-1">
              {portCallSteps.map((s, i) => (
                <li
                  key={s.title}
                  className={cn(
                    "grid grid-cols-[3rem_1fr] gap-x-4 border-t py-4 transition-colors duration-500",
                    i === step ? "border-signal" : "border-white/15",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-4xl leading-none font-extrabold tabular-nums transition-colors duration-500",
                      i === step ? "text-signal" : i < step ? "text-white/60" : "text-white/30",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        "font-head text-2xl leading-tight font-bold transition-colors duration-500",
                        i === step ? "text-white" : i < step ? "text-white/70" : "text-white/45",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className={cn("text-sm transition-colors duration-500", i === step ? "text-signal" : "text-white/55")}>
                      {s.where}
                    </p>
                    <motion.div
                      initial={false}
                      animate={{ height: i === step ? "auto" : 0, opacity: i === step ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2 pb-1 max-w-[46ch] text-white/80">{s.body}</p>
                    </motion.div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Mobile: one step at a time under the chart */}
            <div className="mt-4 min-h-[9.5rem] lg:hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t-2 border-signal pt-3"
                >
                  <span className="font-display text-4xl leading-none font-extrabold text-signal">{step + 1}</span>
                  <div>
                    <h3 className="font-head text-2xl leading-tight font-bold">{portCallSteps[step].title}</h3>
                    <p className="text-sm text-signal">{portCallSteps[step].where}</p>
                    <p className="mt-1 text-[0.98rem] text-white/80">{portCallSteps[step].body}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Chart */}
          <div className="relative order-first flex min-h-0 flex-1 items-center justify-center bg-chart pt-16 lg:order-none lg:pt-0">
            <div className="relative aspect-[1400/1800] h-full max-h-full lg:h-[88svh]">
              <img
                src={img("admiralty-chart-karachi-1918")}
                alt="Admiralty Chart No. 40 of Karachi Harbour, 1918 edition, showing Manora, the harbour channel and Kiamari"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-contain mix-blend-multiply"
              />
              <svg viewBox="0 0 1000 1286" className="absolute inset-0 size-full" aria-hidden="true">
                <path d={ROUTE} fill="none" stroke="#0E2A3B" strokeOpacity="0.28" strokeWidth="5" strokeDasharray="4 12" strokeLinecap="round" />
                <motion.path
                  ref={path}
                  d={ROUTE}
                  fill="none"
                  stroke="#C8102E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{ pathLength: reduce ? scrollYProgress : progress }}
                />
                {stationPts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={i <= step ? 13 : 10} fill={i <= step ? "#F4C20D" : "#F2F5F3"} stroke="#0E2A3B" strokeWidth="4" />
                  </g>
                ))}
                <g transform={`translate(${ship.x} ${ship.y}) rotate(${ship.a})`}>
                  <path d="M26 0 L8 -11 L-22 -11 L-22 11 L8 11 Z" fill="#0E2A3B" stroke="#F2F5F3" strokeWidth="3" />
                  <rect x="-14" y="-6" width="12" height="12" fill="#F4C20D" />
                </g>
              </svg>
              <p className="absolute right-2 bottom-2 rounded-[2px] bg-chart/90 px-2 py-1 text-[0.72rem] leading-tight text-ink/80">
                Admiralty Chart No. 40, Karachi Harbour, 1918. Not for navigation.
              </p>
            </div>
          </div>
        </div>
    </section>
  )
}
