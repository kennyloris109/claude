import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { PortCall } from "@/components/site/port-call"
import { Quotation } from "@/components/site/quotation"
import { Coverage, Services } from "@/components/site/services"
import { Airline, Commitment, Stores, WhyUs } from "@/components/site/stores"

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Header />
      <main id="top">
        <Hero />
        <div id="main" />
        <Coverage />
        <Services />
        <PortCall />
        <Stores />
        <Airline />
        <WhyUs />
        <Commitment />
        <Quotation />
      </main>
      <Footer />
      <Toaster position="bottom-center" richColors={false} />
    </>
  )
}
