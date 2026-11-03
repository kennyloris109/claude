import { useEffect, useMemo, useState } from "react"
import { Copy, Mail } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EMAIL, PHONE, PHONE_DISPLAY } from "@/content"
import { cn } from "@/lib/utils"

type Kind = "vessel" | "bunker" | "fresh-water" | "airline"

const KINDS: { id: Kind; label: string }[] = [
  { id: "vessel", label: "Ship stores" },
  { id: "bunker", label: "Bunkers" },
  { id: "fresh-water", label: "Fresh water" },
  { id: "airline", label: "Airline" },
]

const isVessel = (k: Kind) => k !== "airline"
type ImoState = "empty" | "length" | "check" | "ok"

// IMO check digit: first six digits weighted 7..2; the last digit of the sum must equal the seventh digit.
function imoState(raw: string): ImoState {
  const d = raw.replace(/^IMO\s*/i, "").replace(/\s/g, "")
  if (!d) return "empty"
  if (!/^\d{7}$/.test(d)) return "length"
  let sum = 0
  for (let i = 0; i < 6; i++) sum += Number(d[i]) * (7 - i)
  return sum % 10 === Number(d[6]) ? "ok" : "check"
}

const imoMessage: Record<ImoState, string> = {
  empty: "7 digits. We check the last digit for typos.",
  length: "An IMO number has exactly 7 digits.",
  check: "This IMO number fails its check digit. Check it against the ship's certificate.",
  ok: "IMO number looks valid.",
}

function fmtTime(v: string) {
  if (!v) return ""
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return (
    d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) +
    " PKT"
  )
}

const empty = {
  vessel: "",
  imo: "",
  port: "Karachi Port",
  eta: "",
  airline: "",
  flight: "",
  required: "",
  company: "",
  reply: "",
  items: "",
  grade: "",
  qty: "",
  delivery: "Alongside at berth",
}

export function Quotation() {
  const [kind, setKind] = useState<Kind>("vessel")
  const [f, setF] = useState(empty)
  const [tried, setTried] = useState(false)
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  // Service sections open the form on their own tab.
  useEffect(() => {
    const on = (e: Event) => {
      const k = (e as CustomEvent<string>).detail as Kind
      if (KINDS.some((x) => x.id === k)) setKind(k)
    }
    window.addEventListener("oms:quote", on)
    return () => window.removeEventListener("oms:quote", on)
  }, [])

  const imo = imoState(f.imo)
  const imoNum = f.imo.replace(/^IMO\s*/i, "").trim()

  const what = kind === "bunker" ? "bunkers" : kind === "fresh-water" ? "fresh water" : "ship stores"
  const subject =
    kind === "airline"
      ? `Quotation request: airline stores${f.airline ? `, ${f.airline}` : ""}${f.flight ? ` ${f.flight}` : ""}`
      : `Quotation request (${what}): ${f.vessel || "vessel"}${imoNum ? ` (IMO ${imoNum})` : ""}, ${f.port}`

  const body = useMemo(() => {
    const ask = kind === "bunker" ? "bunker supply" : kind === "fresh-water" ? "bulk fresh water supply" : "the items below"
    const lines = ["Dear Ocean Marine Services,", "", `Please quote for ${ask}.`, ""]
    if (kind === "airline") {
      lines.push(`Airline: ${f.airline || "-"}`, `Flight: ${f.flight || "-"}`, `Required by: ${fmtTime(f.required) || "-"}`, "Airport: Jinnah International Airport, Karachi")
    } else {
      lines.push(`Vessel: ${f.vessel || "-"}`, `IMO: ${imoNum || "-"}`, `Port: ${f.port}`, `ETA: ${fmtTime(f.eta) || "-"}`)
    }
    if (kind === "bunker") lines.push(`Fuel grade: ${f.grade || "-"}`, `Quantity: ${f.qty ? `${f.qty} MT` : "-"}`, `Delivery: ${f.delivery}`)
    if (kind === "fresh-water") lines.push(`Quantity: ${f.qty ? `${f.qty} MT` : "-"}`, `Delivery: ${f.delivery}`)
    const needsItems = kind === "vessel" || kind === "airline"
    lines.push("", needsItems ? "Required items:" : "Notes:", f.items.trim() || "-", "", `Contact: ${f.company || "-"}`)
    if (f.reply) lines.push(`Reply to: ${f.reply}`)
    return lines.join("\n")
  }, [kind, f, imoNum])

  const full = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`

  const missing: string[] = []
  if (isVessel(kind)) {
    if (!f.vessel.trim()) missing.push("vessel name")
    if (imo === "length" || imo === "check") missing.push("a valid IMO number")
  } else if (!f.airline.trim()) missing.push("airline")
  if (kind === "bunker" && !f.grade.trim()) missing.push("fuel grade")
  if ((kind === "bunker" || kind === "fresh-water") && !f.qty.trim()) missing.push("quantity")
  if ((kind === "vessel" || kind === "airline") && !f.items.trim()) missing.push("required items")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (missing.length) {
      toast.error(`Add ${missing.join(", ")} before sending.`)
      return
    }
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast("Opening your email app", {
      description: `If nothing opens, use Copy request and email it to ${EMAIL}.`,
    })
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(full)
      toast.success("Request copied", { description: `Paste it into an email to ${EMAIL}.` })
    } catch {
      toast.error("Copying is blocked in this browser", { description: "Select the preview text and copy it manually." })
    }
  }

  const invalid = (cond: boolean) => (tried && cond ? true : undefined)

  return (
    <section id="quotation" aria-labelledby="quote-title" className="border-t-2 border-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-2xl">
          <h2 id="quote-title" className="font-head text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] font-bold">
            Request a quotation
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-steel">
            Need provisions, stores, lubricants, bunkers or fresh water? Send us your vessel name, IMO number, port, ETA
            and what you need, and our team will prepare a quotation according to your requirements.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 rounded-[3px] border border-rule bg-white p-5 shadow-[0_24px_60px_-40px_rgb(14_42_59/0.45)] sm:p-8"
          >
            <Tabs value={kind} onValueChange={(v) => setKind(v as Kind)}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-[3px] bg-shoal p-1 group-data-horizontal/tabs:h-auto sm:grid-cols-4">
                {KINDS.map((k) => (
                  <TabsTrigger
                    key={k.id}
                    value={k.id}
                    className="h-10! rounded-[2px] px-3 font-head text-lg font-bold data-active:bg-ink! data-active:text-chart! data-active:shadow-none"
                  >
                    {k.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isVessel(kind) ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="vessel" label="Vessel name">
                  <Input id="vessel" value={f.vessel} onChange={set("vessel")} placeholder="MV Example Star" autoComplete="off" aria-invalid={invalid(!f.vessel.trim())} className={fieldCls} />
                </Field>
                <Field
                  id="imo"
                  label="IMO number"
                  hint={imoMessage[imo]}
                  hintTone={imo === "length" || imo === "check" ? "error" : imo === "ok" ? "ok" : "muted"}
                >
                  <Input
                    id="imo"
                    value={f.imo}
                    onChange={set("imo")}
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="9074729"
                    aria-invalid={imo === "length" || imo === "check" ? true : undefined}
                    aria-describedby="imo-hint"
                    className={cn(fieldCls, "tracking-[0.06em] tabular-nums")}
                  />
                </Field>
                <Field id="port" label="Port">
                  <Select value={f.port} onValueChange={(v) => setF((s) => ({ ...s, port: v }))}>
                    <SelectTrigger id="port" className={cn(fieldCls, "w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Karachi Port">Karachi Port</SelectItem>
                      <SelectItem value="Port Qasim">Port Qasim</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="eta" label="ETA (local time)">
                  <Input id="eta" type="datetime-local" value={f.eta} onChange={set("eta")} className={fieldCls} />
                </Field>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="airline" label="Airline">
                  <Input id="airline" value={f.airline} onChange={set("airline")} placeholder="Airline name" autoComplete="organization" aria-invalid={invalid(!f.airline.trim())} className={fieldCls} />
                </Field>
                <Field id="flight" label="Flight number">
                  <Input id="flight" value={f.flight} onChange={set("flight")} placeholder="XX 123" autoComplete="off" className={fieldCls} />
                </Field>
                <Field id="required" label="Date and time required (local)">
                  <Input id="required" type="datetime-local" value={f.required} onChange={set("required")} className={fieldCls} />
                </Field>
                <Field id="airport" label="Airport">
                  <Input id="airport" value="Jinnah International Airport, Karachi" readOnly className={cn(fieldCls, "text-steel")} />
                </Field>
              </div>
            )}

            {(kind === "bunker" || kind === "fresh-water") && (
              <div className="grid gap-5 sm:grid-cols-2">
                {kind === "bunker" && (
                  <Field id="grade" label="Fuel grade" hint="As specified by the vessel, e.g. MGO DMA or VLSFO RMG 380.">
                    <Input id="grade" value={f.grade} onChange={set("grade")} placeholder="MGO DMA" autoComplete="off" aria-invalid={invalid(!f.grade.trim())} aria-describedby="grade-hint" className={fieldCls} />
                  </Field>
                )}
                <Field id="qty" label="Quantity (metric tons)">
                  <Input id="qty" value={f.qty} onChange={set("qty")} inputMode="decimal" placeholder={kind === "bunker" ? "150" : "200"} autoComplete="off" aria-invalid={invalid(!f.qty.trim())} className={cn(fieldCls, "tabular-nums")} />
                </Field>
                <Field id="delivery" label="Delivery">
                  <Select value={f.delivery} onValueChange={(v) => setF((s) => ({ ...s, delivery: v }))}>
                    <SelectTrigger id="delivery" className={cn(fieldCls, "w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alongside at berth">Alongside at berth</SelectItem>
                      <SelectItem value="At anchorage">At anchorage</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="company" label="Your name and company">
                <Input id="company" value={f.company} onChange={set("company")} placeholder="Name, agency or ship manager" autoComplete="organization" className={fieldCls} />
              </Field>
              <Field id="reply" label="Your email">
                <Input id="reply" type="email" value={f.reply} onChange={set("reply")} placeholder="you@company.com" autoComplete="email" className={fieldCls} />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  id="items"
                  label={kind === "vessel" || kind === "airline" ? "Required items" : "Notes (optional)"}
                  hint={kind === "vessel" || kind === "airline" ? "One item per line with quantity and unit. You can also attach your own list to the email." : "Anything else we should know, such as berth number or delivery window."}
                >
                  <Textarea
                    id="items"
                    value={f.items}
                    onChange={set("items")}
                    aria-invalid={invalid((kind === "vessel" || kind === "airline") && !f.items.trim())}
                    aria-describedby="items-hint"
                    placeholder={
                      kind === "bunker"
                        ? "Berth 12, delivery window 0800 to 1200"
                        : kind === "fresh-water"
                          ? "Domestic use, delivery after cargo completion"
                          : "Fresh eggs, 60 dozen\nHydraulic oil ISO VG 46, 4 x 20 L\nNitrile gloves, size L, 10 boxes"
                    }
                    className={cn(fieldCls, "min-h-40 leading-relaxed")}
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-signal px-6 font-head text-xl font-bold text-ink transition-colors hover:bg-signal-hi"
              >
                <Mail className="size-5" aria-hidden="true" />
                Email this request
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex h-12 items-center gap-2 rounded-[3px] border-2 border-ink px-6 font-head text-xl font-bold text-ink transition-colors hover:bg-ink hover:text-chart"
              >
                <Copy className="size-5" aria-hidden="true" />
                Copy request
              </button>
            </div>
          </form>

          <aside aria-label="What to send" className="flex flex-col gap-8">
            <div>
              <p className="text-steel">Send your requisition to</p>
              <p className="mt-1 font-head text-[clamp(1.4rem,3vw,2rem)] font-bold break-all select-all">{EMAIL}</p>
              <p className="mt-3 text-steel">
                or call{" "}
                <a href={`tel:${PHONE}`} className="font-semibold text-ink tabular-nums">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold">For a fast quotation, include</p>
              <ul className="mt-3 grid gap-2">
                {(kind === "bunker"
                  ? ["Vessel name and IMO number", "Port and ETA", "Fuel grade", "Quantity in metric tons", "Berth or anchorage"]
                  : kind === "fresh-water"
                    ? ["Vessel name and IMO number", "Port and ETA", "Quantity in metric tons", "Berth or anchorage"]
                    : kind === "airline"
                      ? ["Airline and flight number", "Date and time required", "Required items with quantities"]
                      : ["Vessel name and IMO number", "Port: Karachi Port or Port Qasim", "ETA", "Required items with quantities"]
                ).map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="size-3 shrink-0 border-2 border-ink" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <p id="preview-label" className="font-semibold">
                Your request so far
              </p>
              <pre
                aria-labelledby="preview-label"
                className="mt-3 max-h-[380px] flex-1 overflow-auto rounded-[3px] border border-dashed border-rule bg-shoal p-4 font-sans text-[0.95rem] leading-relaxed whitespace-pre-wrap text-ink tabular-nums"
              >
                {full}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

const fieldCls = "h-12 data-[size=default]:h-12 rounded-[3px] border-input bg-chart px-3 text-base md:text-base text-ink placeholder:text-steel/80 focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-signal/60"

function Field({
  id,
  label,
  hint,
  hintTone = "muted",
  children,
}: {
  id: string
  label: string
  hint?: string
  hintTone?: "muted" | "error" | "ok"
  children: React.ReactNode
}) {
  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={id} className="text-[0.98rem] font-semibold text-ink">
        {label}
      </Label>
      {children}
      {hint && (
        <p
          id={`${id}-hint`}
          className={cn("text-sm", hintTone === "error" ? "font-semibold text-destructive" : hintTone === "ok" ? "font-semibold text-[#1E6B45]" : "text-steel")}
        >
          {hint}
        </p>
      )}
    </div>
  )
}
