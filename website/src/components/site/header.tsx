import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { EMAIL } from "@/content"
import { FlagMark } from "./flags"

const links = [
  { href: "#services", label: "Services" },
  { href: "#port-call", label: "How supply works" },
  { href: "#stores", label: "Supply categories" },
  { href: "#airline", label: "Airline supply" },
]

export function Header() {
  // Over the hero photo the bar is clear with light text; past it, it turns to chart paper.
  const [overHero, setOverHero] = useState(true)

  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setOverHero(e.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,color,box-shadow] duration-300",
        overHero
          ? "bg-linear-to-b from-deep/70 to-transparent text-white"
          : "bg-chart/95 text-ink shadow-[0_1px_0_var(--color-rule),0_8px_24px_-16px_rgb(14_42_59/0.35)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3 no-underline" aria-label="Ocean Marine Services, back to top">
          <FlagMark />
          <span className="font-head text-lg leading-none font-bold tracking-wide whitespace-nowrap sm:text-xl">Ocean Marine Services</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative font-medium no-underline after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quotation"
            className="inline-flex h-10 items-center rounded-[3px] bg-signal px-4 font-head text-lg font-bold text-ink no-underline transition-colors hover:bg-signal-hi"
          >
            Request a quotation
          </a>
        </nav>

        <Sheet>
          <SheetTrigger
            className="inline-flex size-11 items-center justify-center rounded-[3px] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm border-none bg-deep p-0 text-white">
            <div className="flex h-full flex-col px-6 pt-20 pb-8">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <FlagMark className="mb-6" />
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <a
                      href={l.href}
                      className="border-b border-white/15 py-4 font-head text-3xl font-semibold no-underline"
                    >
                      {l.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <a
                  href="#quotation"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-[3px] bg-signal font-head text-xl font-bold text-ink no-underline"
                >
                  Request a quotation
                </a>
              </SheetClose>
              <p className="mt-auto text-sm break-all text-mist">{EMAIL}</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
