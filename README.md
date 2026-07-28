# Pinterest Pin Automation Agent

An n8n workflow that generates an image, writes an SEO-optimized caption, resizes/optimizes
the image for Pinterest, and posts it as a pin — on a schedule, fully automated.

## Pipeline

```
Schedule Trigger
      │
Pin Config (board_id, topic list, image style)
      │
Pick Topic (Code: choose one topic at random)
      │
Generate Image (OpenAI DALL-E 3)
      │
Optimize Image (resize to 1000x1500 / 2:3, re-encode JPEG q85)
      │
Generate Caption (OpenAI GPT-4o → title, description, alt text, hashtags as JSON)
      │
Prepare Pin Payload (Code: merge image + caption into Pinterest API body)
      │
Create Pinterest Pin (HTTP Request → POST /v5/pins)
```

## Prerequisites

- A running n8n instance (n8n Cloud, or self-hosted — self-hosted must have
  GraphicsMagick/ImageMagick available for the **Optimize Image** node; the official n8n
  Docker image includes it).
- An OpenAI API key with access to `dall-e-3` and `gpt-4o`.
- A Pinterest business account + developer app. See **[docs/pinterest-setup.md](docs/pinterest-setup.md)**
  for the full walkthrough (registering the app, OAuth flow, finding your board ID).

## Setup

1. **Import the workflow**: in n8n, Workflows → Import from File → select
   `workflows/pinterest-pin-automation.json`.
2. **OpenAI credential**: Credentials → New → OpenAI API → paste your API key. Open the
   **Generate Image** and **Generate Caption** nodes and select this credential.
3. **Pinterest credential**: follow `docs/pinterest-setup.md` section 4 to create the OAuth2
   credential, then assign it on the **Create Pinterest Pin** node.
4. **Configure content**: open the **Pin Config** node and set:
   - `board_id` — the Pinterest board to post to (see setup doc for how to find it).
   - `topics` — a JSON array of topics/niches to rotate through; a random one is picked each run.
   - `image_style` — a style suffix appended to every image prompt for visual consistency.
5. **Test**: click "Execute Workflow" to run it once manually and confirm a pin appears on
   your board.
6. **Activate**: toggle the workflow to Active so the Schedule Trigger runs it automatically
   (default: daily at 9am — edit the **Daily Schedule** node to change frequency).

## Notes / things to check after import

n8n node parameter names occasionally shift between versions. If a node shows a red
warning after import, open it — the field values are still there, they may just need
re-selecting from a dropdown (e.g. model name, image size) to "stick." The two nodes most
likely to need a look are **Optimize Image** (Edit Image node UI varies by n8n version) and
**Generate Image** (OpenAI node's size/quality options).

Pinterest's recommended pin format is a 2:3 portrait image (e.g. 1000×1500px). DALL-E 3 is
generated at 1024×1792 (its closest native portrait size) and then resized to exactly
1000×1500 by the Optimize Image node.

See `docs/pinterest-setup.md` for API rate limits and Pinterest's automated-content policy —
worth a read before turning up posting frequency.
