# Ocean Marine Services website

Marketing site for Ocean Marine Services, ship chandler and marine supplier at Karachi Port and Port Qasim.

Built with React + TypeScript (Vite), Tailwind CSS v4, shadcn/ui (Radix), Motion and Embla Carousel.

## Run it

```bash
cd website
npm install
npm run dev      # local dev server
npm run build    # production build into website/dist
npm run preview  # serve the production build
```

The build uses relative asset paths, so `website/dist` can be uploaded to any static host (GitHub Pages, Netlify, Cloudflare Pages) or opened from a subfolder.

## Where things live

| What | File |
|---|---|
| All copy, services, categories, image list and credits | `src/content.ts` |
| Colours and fonts | `src/index.css` (`@theme` block) |
| Page sections | `src/components/site/` |
| shadcn/ui components | `src/components/ui/` |
| Photos (WebP) | `public/images/` |

## Sections

1. Hero slider: real Karachi Harbour photos, pause and arrow controls, per-slide timers.
2. Port coverage strip with coordinates.
3. Services slider (drag, swipe or arrows).
4. Port call: scroll moves a vessel along the 1918 Admiralty chart of Karachi Harbour while the four supply steps advance.
5. Supply categories as photo tabs.
6. Airline provisions and stores.
7. Why choose us, and the company commitment.
8. Quotation form: validates the IMO check digit, previews the email, opens the visitor's email app or copies the request.

Animations respect the visitor's reduced-motion setting.

## Contact form

There is no server. "Email this request" opens the visitor's email app addressed to oceanmarineservices.pk@gmail.com with the request filled in; "Copy request" copies the same text.

## Image credits

- Karachi container terminal, tanker berth, tanker and Manora launches: A. Savin, Wikimedia Commons, Free Art License.
- Admiralty Chart No. 40, Karachi Harbour (1906, new edition 1918): UK Hydrographic Office, public domain.
- Stores on the quay: U.S. Navy (USNS Supply at Souda Bay), public domain.
- Engine room: "Pulau Pinang Engine Room 46" by LEE 003, CC BY 4.0.
- All other photographs: Unsplash, Unsplash License.

Each image in `public/images` has a `.json` sidecar recording its exact source. Credits are also shown in the site footer.

## To replace with your own material

- Your own photos of deliveries, launches, stores and staff (swap files in `public/images` and update `src/content.ts`).
- A logo, if you have one. The header currently uses the O-M-S signal flags as the mark.
- Phone or WhatsApp number and office address, when you want them shown.
