import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"
import { ADDRESS_LINES, EMAIL, MAPS_URL, PHONE, PHONE_DISPLAY } from "@/content"

const ease = [0.16, 1, 0.3, 1] as const

export function Contact() {
  const reduce = useReducedMotion()
  const rows = [
    {
      key: "phone",
      Icon: Phone,
      label: "Call",
      value: <span className="tabular-nums">{PHONE_DISPLAY}</span>,
      copy: PHONE,
      action: { href: `tel:${PHONE}`, text: "Call now" },
    },
    {
      key: "email",
      Icon: Mail,
      label: "Email",
      value: (
        <span className="break-words">
          {EMAIL.split("@")[0]}
          <wbr />@{EMAIL.split("@")[1]}
        </span>
      ),
      copy: EMAIL,
      action: { href: `mailto:${EMAIL}`, text: "Send an email" },
    },
    {
      key: "office",
      Icon: MapPin,
      label: "Office",
      value: (
        <span>
          {ADDRESS_LINES.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </span>
      ),
      copy: ADDRESS_LINES.join(", "),
      action: { href: MAPS_URL, text: "Open in Google Maps", external: true },
    },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div>
          <h2 id="contact-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            Contact us
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-steel">
            Call, email or visit our Karachi office. For a quotation, include the vessel name, IMO number, port, ETA and
            the items or quantities you need.
          </p>
          <a
            href="#quotation"
            className="mt-8 inline-flex h-12 items-center rounded-[3px] bg-signal px-6 font-head text-xl font-bold text-ink no-underline transition-colors hover:bg-signal-hi"
          >
            Request a quotation
          </a>
        </div>

        <ul className="border-t-2 border-ink">
          {rows.map((r, i) => (
            <motion.li
              key={r.key}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="group grid gap-4 border-b border-rule py-7 sm:grid-cols-[7rem_1fr_auto] sm:items-start sm:gap-6"
            >
              <span className="flex items-center gap-2 font-head text-lg font-bold text-steel">
                <r.Icon className="size-5 text-ink" aria-hidden="true" />
                {r.label}
              </span>
              <span className="min-w-0 font-head text-[clamp(1.3rem,2.2vw,1.75rem)] leading-tight font-bold">{r.value}</span>
              <span className="flex flex-wrap gap-2 sm:justify-end">
                <a
                  href={r.action.href}
                  {...(r.action.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex h-11 items-center gap-2 rounded-[3px] border-2 border-ink px-4 font-head text-lg font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-chart"
                >
                  {r.action.text}
                  {r.action.external && <ExternalLink className="size-4" aria-hidden="true" />}
                </a>
                <CopyButton text={r.copy} label={r.label} />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      toast.success(`${label === "Office" ? "Address" : label === "Call" ? "Phone number" : "Email"} copied`)
      window.setTimeout(() => setDone(false), 1800)
    } catch {
      toast.error("Copying is blocked in this browser", { description: "Select the text and copy it manually." })
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${label === "Office" ? "address" : label === "Call" ? "phone number" : "email address"}`}
      className="inline-flex size-11 items-center justify-center rounded-[3px] border-2 border-rule text-ink transition-colors hover:border-ink"
    >
      {done ? <Check className="size-5 text-[#1E6B45]" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
    </button>
  )
}
