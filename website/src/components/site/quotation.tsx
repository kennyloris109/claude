import { useMemo, useState } from "react"
import { Copy, Mail } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EMAIL } from "@/content"
import { cn } from "@/lib/utils"

type Kind = "vessel" | "airline"
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
}

export function Quotation() {
  const [kind, setKind] = useState<Kind>("vessel")
  const [f, setF] = useState(empty)
  const [tried, setTried] = useState(false)
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  const imo = imoState(f.imo)
  const imoNum = f.imo.replace(/^IMO\s*/i, "").trim()

  const subject =
    kind === "airline"
      ? `Quotation request: airline stores${f.airline ? `, ${f.airline}` : ""}${f.flight ? ` ${f.flight}` : ""}`
      : `Quotation request: ${f.vessel || "vessel"}${imoNum ? ` (IMO ${imoNum})` : ""}, ${f.port}`

  const body = useMemo(() => {
    const lines = ["Dear Ocean Marine Services,", "", "Please quote for the items below.", ""]
    if (kind === "airline") {
      lines.push(`Airline: ${f.airline || "-"}`, `Flight: ${f.flight || "-"}`, `Required by: ${fmtTime(f.required) || "-"}`, "Airport: Jinnah International Airport, Karachi")
    } else {
      lines.push(`Vessel: ${f.vessel || "-"}`, `IMO: ${imoNum || "-"}`, `Port: ${f.port}`, `ETA: ${fmtTime(f.eta) || "-"}`)
    }
    lines.push("", "Required items:", f.items.trim() || "-", "", `Contact: ${f.company || "-"}`)
    if (f.reply) lines.push(`Reply to: ${f.reply}`)
    return lines.join("\n")
  }, [kind, f, imoNum])

  const full = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`

  const missing: string[] = []
  if (kind === "vessel") {
    if (!f.vessel.trim()) missing.push("vessel name")
    if (imo === "length" || imo === "check") missing.push("a valid IMO number")
  } else if (!f.airline.trim()) missing.push("airline")
  if (!f.items.trim()) missing.push("required items")

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
            Need provisions, stores, lubricants or marine supplies? Send us your vessel name, IMO number, port, ETA and
            required items, and our team will prepare a quotation according to your requirements.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 rounded-[3px] border border-rule bg-white p-5 shadow-[0_24px_60px_-40px_rgb(14_42_59/0.45)] sm:p-8"
          >
            <Tabs value={kind} onValueChange={(v) => setKind(v as Kind)}>
              <TabsList className="h-11 rounded-[3px] bg-shoal p-1">
                {(["vessel", "airline"] as const).map((k) => (
                  <TabsTrigger
                    key={k}
                    value={k}
                    className="rounded-[2px] px-5 font-head text-lg font-bold capitalize data-active:bg-ink data-active:text-chart data-active:shadow-none"
                  >
                    {k}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {kind === "vessel" ? (
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

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="company" label="Your name and company">
                <Input id="company" value={f.company} onChange={set("company")} placeholder="Name, agency or ship manager" autoComplete="organization" className={fieldCls} />
              </Field>
              <Field id="reply" label="Your email">
                <Input id="reply" type="email" value={f.reply} onChange={set("reply")} placeholder="you@company.com" autoComplete="email" className={fieldCls} />
              </Field>
              <div className="sm:col-span-2">
                <Field id="items" label="Required items" hint="One item per line with quantity and unit. You can also attach your own list to the email.">
                  <Textarea
                    id="items"
                    value={f.items}
                    onChange={set("items")}
                    aria-invalid={invalid(!f.items.trim())}
                    aria-describedby="items-hint"
                    placeholder={"Fresh eggs, 60 dozen\nHydraulic oil ISO VG 46, 4 x 20 L\nNitrile gloves, size L, 10 boxes"}
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
            </div>
            <div>
              <p className="font-semibold">For a fast quotation, include</p>
              <ul className="mt-3 grid gap-2">
                {["Vessel name and IMO number", "Port: Karachi Port or Port Qasim", "ETA", "Required items with quantities"].map((t) => (
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
