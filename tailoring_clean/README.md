# tailoring

AI-powered outbound prospecting tool for Teamtailor's sales team.
Built with Next.js · Deployable to Vercel in ~5 minutes.

---

## What it does

- Search ZoomInfo for TA leaders filtered by ATS, title, seniority, industry, country
- Enrich contacts with email + direct dial
- Generate AI-personalized cold pitches via Claude (ATS-specific angles)
- Export Salesloft-formatted CSV (one click)
- Open pitch directly in Gmail via mailto link

---

## Stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Frontend    | Next.js 14 + React 18         |
| Hosting     | Vercel                        |
| Contact data| ZoomInfo API                  |
| Enrichment  | Apollo.io API (backup)        |
| AI pitches  | Anthropic Claude (claude-sonnet-4) |
| Auth        | Simple password gate (v1)     |
| CSV export  | Salesloft People Import format|

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/ericklank/tailoring.git
cd tailoring
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
TAILORING_PASSWORD=choose_a_strong_password

ANTHROPIC_API_KEY=sk-ant-...

# ZoomInfo — ask your ZoomInfo admin for API credentials
# Settings > Integrations > API
ZOOMINFO_CLIENT_ID=your_client_id
ZOOMINFO_CLIENT_SECRET=your_client_secret

# Apollo — Settings > Integrations > API Keys
APOLLO_API_KEY=your_apollo_key
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your password.

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add them via:

```bash
vercel env add TAILORING_PASSWORD
vercel env add ANTHROPIC_API_KEY
vercel env add ZOOMINFO_CLIENT_ID
vercel env add ZOOMINFO_CLIENT_SECRET
vercel env add APOLLO_API_KEY
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub (your `ericklank` account)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add environment variables in the Vercel dashboard under **Settings > Environment Variables**
5. Deploy

Every `git push` to `main` auto-deploys.

---

## Getting API Keys

### ZoomInfo
Ask your ZoomInfo admin:
- Log into ZoomInfo → Settings → Integrations → API
- Generate Client ID + Secret
- Confirm your plan tier includes API access (some tiers gate this)

### Apollo
- Log into Apollo → Settings → Integrations → API Keys
- Copy your key
- Confirm your plan has API access (Basic+ plans)

### Anthropic (Claude)
- Already in use for Owlive — use same key
- Or create a new one at [console.anthropic.com](https://console.anthropic.com)

---

## Phase Roadmap

| Phase | Feature                              | Status    |
|-------|--------------------------------------|-----------|
| 1     | Core search + pitch + CSV export     | ✅ Done   |
| 2     | Salesloft API auto-enrollment        | 🔜 Next   |
| 3     | Nooks API dial-list push             | 🔜 Phase 3|
| 4     | Fake BDR inbox management            | 🔜 Phase 4|
| 5     | Salesforce pre-flight + write-back   | 🔜 Phase 5|

---

## File Structure

```
tailoring/
├── pages/
│   ├── index.tsx          # Main app UI
│   └── api/
│       ├── search.ts      # ZoomInfo contact search proxy
│       ├── pitch.ts       # Claude pitch generation
│       └── export.ts      # Salesloft CSV download
├── lib/
│   ├── types.ts           # Shared TypeScript types
│   ├── zoominfo.ts        # ZoomInfo API client
│   ├── apollo.ts          # Apollo API client
│   └── csv.ts             # Salesloft CSV formatter
├── styles/
│   └── globals.css        # Teamtailor pink brand tokens
├── .env.example           # Environment variable template
└── README.md
```

---

*built by eric for teamtailor · march 2026 · internal use only*
