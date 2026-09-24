import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { services } from "@/content"

export function Coverage() {
  const places = [
    { name: "Karachi Port", coord: "24°50′ N  66°59′ E" },
    { name: "Port Qasim", coord: "24°46′ N  67°20′ E" },
    { name: "Jinnah International Airport", coord: "24°54′ N  67°10′ E" },
  ]
  return (
    <section aria-label="Where we supply" className="border-b border-rule bg-shoal">
      <ul className="mx-auto grid max-w-[1320px] gap-x-10 gap-y-4 px-4 py-6 sm:grid-cols-3 sm:px-8">
        {places.map((p) => (
          <li key={p.name} className="flex items-baseline justify-between gap-4 sm:block">
            <span className="block font-head text-xl font-bold">{p.name}</span>
            <span className="text-on-shoal whitespace-pre tabular-nums">{p.coord}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Services() {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const sync = useCallback((a: NonNullable<CarouselApi>) => {
    setSelected(a.selectedScrollSnap())
    setCanPrev(a.canScrollPrev())
    setCanNext(a.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return
    const onScroll = () => setProgress(Math.max(0, Math.min(1, api.scrollProgress())))
    sync(api)
    onScroll()
    api.on("select", sync).on("reInit", sync).on("scroll", onScroll).on("reInit", onScroll)
    return () => {
      api.off("select", sync).off("reInit", sync).off("scroll", onScroll).off("reInit", onScroll)
    }
  }, [api, sync])

  return (
    <section id="services" aria-labelledby="services-title" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 id="services-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
              Everything a vessel needs, from the galley to the engine room
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-steel">
              Six services, one supplier. Drag or use the arrows to move through them.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-head text-xl font-semibold tabular-nums" aria-live="polite">
              <span className="text-ink">{String(selected + 1).padStart(2, "0")}</span>
              <span className="text-steel"> / {String(services.length).padStart(2, "0")}</span>
            </p>
            <SliderButton label="Previous service" disabled={!canPrev} onClick={() => api?.scrollPrev()}>
              <ArrowLeft className="size-5" />
            </SliderButton>
            <SliderButton label="Next service" disabled={!canNext} onClick={() => api?.scrollNext()}>
              <ArrowRight className="size-5" />
            </SliderButton>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1320px] px-4 sm:px-8">
        <Carousel setApi={setApi} opts={{ align: "start", containScroll: "trimSnaps", dragFree: false }} aria-label="Services">
          <CarouselContent className="-ml-5 cursor-grab active:cursor-grabbing">
            {services.map((s) => (
              <CarouselItem key={s.id} className="basis-[88%] pl-5 sm:basis-[64%] lg:basis-[44%]">
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-ink">
                    <img
                      src={s.image}
                      alt={s.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="size-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-deep/80 to-transparent" />
                    <h3 className="absolute bottom-5 left-5 right-5 font-head text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.02] font-bold text-white">
                      {s.title}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 border-b-2 border-ink pt-5 pb-7">
                    <p className="max-w-[56ch] text-[1.0625rem]">{s.summary}</p>
                    {s.items && (
                      <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                        {s.items.map((it) => (
                          <li key={it} className="relative pl-4 text-[0.98rem] text-steel before:absolute before:top-[0.6em] before:left-0 before:size-[7px] before:bg-signal">
                            {it}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.note && <p className="text-sm text-steel">{s.note}</p>}
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-rule" aria-hidden="true">
          <div
            className="h-full origin-left bg-ink"
            style={{ transform: `scaleX(${Math.max(1 / services.length, progress)})` }}
          />
        </div>
      </div>
    </section>
  )
}

function SliderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-12 items-center justify-center rounded-[3px] border-2 border-ink text-ink transition-colors duration-200 hover:bg-ink hover:text-chart disabled:cursor-not-allowed disabled:border-rule disabled:text-rule disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
