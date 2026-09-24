export const EMAIL = "oceanmarineservices.pk@gmail.com"

export const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}.webp`

export type HeroSlide = {
  image: string
  alt: string
  place: string
  detail: string
  coord?: string
}

// Karachi photos are real (Wikimedia Commons). The aircraft slide is a stock photo and is not captioned as Karachi.
export const heroSlides: HeroSlide[] = [
  {
    image: img("karachi-container-terminal"),
    alt: "Ship-to-shore cranes at the container terminal, Karachi Harbour",
    place: "Karachi Port",
    detail: "Container terminal, Karachi Harbour",
    coord: "24°50′N 66°59′E",
  },
  {
    image: img("karachi-tanker-berth"),
    alt: "Tanker alongside with a floating crane and harbour craft, Karachi",
    place: "Karachi Harbour",
    detail: "Tanker berth and floating crane",
    coord: "24°49′N 66°59′E",
  },
  {
    image: img("manora-harbour-launches"),
    alt: "Harbour launches moored off Manora with a tanker in the distance, Karachi",
    place: "Manora, Karachi",
    detail: "Harbour launches off Manora",
    coord: "24°48′N 66°58′E",
  },
  {
    image: img("aircraft-stand"),
    alt: "Airliner at the stand at sunset with ground service vehicles",
    place: "Airline provisions",
    detail: "Provisions and stores for foreign-going airlines",
  },
]

export type Service = {
  id: string
  title: string
  summary: string
  items?: string[]
  note?: string
  image: string
  alt: string
}

export const services: Service[] = [
  {
    id: "chandling",
    title: "Ship chandling",
    summary: "Complete supply solutions for vessels calling at Karachi Port and Port Qasim.",
    items: [
      "Fresh, frozen and dry provisions",
      "Meat, poultry, seafood and dairy products",
      "Fruits and vegetables",
      "Beverages and bottled water",
      "Deck stores",
      "Engine stores",
      "Cabin and housekeeping stores",
      "Galley and catering equipment",
      "Safety and general consumables",
      "Bonded stores, where applicable",
    ],
    image: img("stores-alongside"),
    alt: "Pallets of stores on the quay beside a ship, with a forklift at the gangway",
  },
  {
    id: "equipment",
    title: "Marine equipment supply",
    summary: "We source and supply a wide range of marine equipment and consumables according to vessel requirements.",
    items: [
      "Engine-room equipment",
      "Pumps and pump spares",
      "Valves and fittings",
      "Hoses and couplings",
      "Electrical items",
      "Hand and power tools",
      "PPE and safety equipment",
      "Maintenance consumables",
      "General marine hardware",
    ],
    image: img("welding"),
    alt: "Welder at work with sparks flying",
  },
  {
    id: "lubricants",
    title: "Lubricants and technical consumables",
    summary:
      "Supply of marine lubricants, greases and technical consumables based on vessel specifications and manufacturer requirements.",
    image: img("engine-room"),
    alt: "Ship's engine room with machinery behind yellow guard rails",
  },
  {
    id: "port-support",
    title: "Port and vessel support",
    summary: "Professional assistance for vessels during their port stay.",
    items: [
      "Ship supply coordination",
      "Delivery and transportation",
      "Launch and boat delivery coordination",
      "Port-side logistics",
      "Urgent and last-minute supply support",
      "Coordination with vessel representatives and agents",
    ],
    image: img("tugs-aerial"),
    alt: "Aerial view of a container ship assisted by tugs in a harbour",
  },
  {
    id: "tank-cleaning",
    title: "Tank cleaning support",
    summary: "Coordination and supply support for tank cleaning operations.",
    note: "Subject to applicable port, environmental and regulatory requirements.",
    image: img("karachi-tanker"),
    alt: "Red-hulled tanker alongside in Karachi Harbour",
  },
  {
    id: "waste",
    title: "Waste management support",
    summary: "We coordinate waste-related services for vessels through appropriate authorized service providers.",
    note: "Subject to applicable regulations and port requirements.",
    image: img("port-aerial"),
    alt: "Aerial view of a busy container port with cranes and quays",
  },
]

export type Category = {
  id: string
  name: string
  items: string[]
  image: string
  alt: string
}

export const categories: Category[] = [
  {
    id: "provisions",
    name: "Provisions",
    items: ["Fresh", "Frozen", "Dry", "Dairy", "Meat", "Seafood", "Fruits and vegetables", "Beverages"],
    image: img("stores-on-quay"),
    alt: "Wrapped pallets of stores on a quay waiting to be loaded onto a ship",
  },
  {
    id: "deck",
    name: "Deck stores",
    items: ["Ropes", "Paints", "Brushes", "Hardware", "Tools", "Safety equipment", "PPE"],
    image: img("tools"),
    alt: "Rack of pliers and hand tools",
  },
  {
    id: "engine",
    name: "Engine stores",
    items: ["Gaskets", "Filters", "Valves", "Hoses", "Fittings", "Maintenance consumables", "Tools"],
    image: img("engine-room"),
    alt: "Ship's engine room with machinery behind yellow guard rails",
  },
  {
    id: "cabin",
    name: "Cabin stores",
    items: ["Cleaning supplies", "Linen", "Toiletries", "Housekeeping items", "Galley supplies"],
    image: img("warehouse"),
    alt: "Tall warehouse shelving stacked with boxed stores",
  },
  {
    id: "lubricants",
    name: "Lubricants",
    items: ["Marine oils", "Hydraulic oils", "Greases", "Technical fluids"],
    image: img("karachi-tanker-berth"),
    alt: "Tanker alongside the oil berth in Karachi Harbour",
  },
  {
    id: "equipment",
    name: "Marine equipment",
    items: ["Pumps", "Valves", "Electrical items", "Mechanical equipment", "General marine hardware"],
    image: img("ppe"),
    alt: "Technician in a hard hat and gloves working on equipment",
  },
]

export const airlineItems = [
  "Fresh food ingredients",
  "Dry food products",
  "Fruits and vegetables",
  "Meat and poultry",
  "Dairy products",
  "Beverages and bottled water",
  "Galley and catering consumables",
  "Cabin supplies",
  "Cleaning and housekeeping consumables",
  "General operational stores",
]

export const reasons = [
  {
    title: "One-stop supply",
    body: "From provisions to technical stores, we aim to provide a single reliable source for vessel requirements.",
  },
  {
    title: "Fast response",
    body: "Vessels operate on strict schedules. Our team focuses on quick quotation, procurement and delivery coordination.",
  },
  {
    title: "Quality and reliability",
    body: "We work with established suppliers to source products suitable for marine and aviation requirements.",
  },
  {
    title: "Port-focused service",
    body: "Our operations are designed around the requirements of vessels calling at Karachi Port and Port Qasim.",
  },
  {
    title: "Compliance-focused",
    body: "We work in accordance with applicable customs, port, environmental, safety and other regulatory requirements.",
  },
]

// A real sequence: the order is the information.
export const portCallSteps = [
  {
    where: "Examination Anchorage",
    title: "Send your requisition",
    body: "Vessel name, IMO number, port, ETA and the items you need. Email it or use the form below.",
  },
  {
    where: "Approaching Manora",
    title: "Quotation",
    body: "Our team prepares a quotation according to your requirements, with quick turnaround for vessels on a schedule.",
  },
  {
    where: "Manora Channel",
    title: "Procurement and packing",
    body: "Provisions, stores and spares are sourced from established suppliers and prepared for delivery.",
  },
  {
    where: "Kiamari wharves",
    title: "Delivered alongside or by launch",
    body: "We coordinate delivery with the vessel's representatives and agents, including urgent and last-minute supply.",
  },
]

export const credits = [
  { what: "Karachi container terminal, tanker berth, tanker and Manora launches", who: "A. Savin", license: "Free Art License", href: "https://commons.wikimedia.org/wiki/User:A.Savin" },
  { what: "Admiralty Chart No. 40, Karachi Harbour (1906, new edition 1918)", who: "UK Hydrographic Office", license: "Public domain", href: "https://commons.wikimedia.org/wiki/File:Admiralty_Chart_No_40_Karachi_Harbour,_Published_1906,_New_Edition_1918.jpg" },
  { what: "Stores on the quay (USNS Supply at Souda Bay)", who: "U.S. Navy", license: "Public domain", href: "https://commons.wikimedia.org/wiki/File:USNS_Supply_(T-AOE_6)_visits_Souda_Bay_(7040155).jpg" },
  { what: "Engine room (Pulau Pinang)", who: "LEE 003", license: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Pulau_Pinang_Engine_Room_46.jpg" },
  { what: "Other photographs", who: "Unsplash contributors", license: "Unsplash License", href: "https://unsplash.com/license" },
]
