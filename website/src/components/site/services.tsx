export { Services } from "./services-slider"


export function Coverage() {
  const places = [
    { name: "Karachi Port", coord: "24°50′N 66°59′E" },
    { name: "Port Qasim", coord: "24°46′N 67°20′E" },
    { name: "Jinnah International Airport", coord: "24°54′N 67°10′E" },
  ]
  return (
    <section aria-label="Where we supply" className="border-b border-rule bg-shoal">
      <ul className="mx-auto grid max-w-[1320px] gap-x-10 gap-y-4 px-4 py-6 sm:grid-cols-3 sm:px-8">
        {places.map((p) => (
          <li key={p.name} className="flex items-baseline justify-between gap-4 sm:block">
            <span className="block font-head text-xl font-bold">{p.name}</span>
            <span className="text-on-shoal tabular-nums">{p.coord}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

