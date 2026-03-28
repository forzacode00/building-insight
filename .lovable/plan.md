

# Restructure: Multi-page Dashboard to Storytelling Scroll Experience

## Overview

Transform the app from a sidebar-navigated multi-page dashboard into a single-page storytelling experience at `/`, with the full simulator preserved at `/simulator`.

## Architecture Changes

### 1. Update App.tsx routing

- Remove all individual page routes and AppLayout wrapper from `/`
- Two routes only:
  - `/` renders `<Story />` (no sidebar, no AppLayout)
  - `/simulator` renders `<AppLayout>` wrapping all existing pages (Simulering, Datainput, etc.) with sidebar navigation intact
- Keep SimProvider wrapping everything so the story page can use the simulation engine

### 2. Create `src/pages/Story.tsx` (new, ~500 lines)

Single scrollable page with 6 full-viewport sections, using framer-motion `whileInView` for scroll-triggered animations.

**Section 1 — Hero**
- `min-h-screen` dark navy bg, centered content
- Headline: "Test bygget ditt — for du bygger det"
- Subtitle explaining VirtualHouse
- Animated icon flow: Document -> VirtualHouse -> Checkmark (CSS/framer keyframes)
- Scroll indicator with bouncing arrow

**Section 2 — "Slik gjores det i dag" (Problem)**
- Two-column layout: left has 3 connected boxes (Prosjektering/Bygging/Testing), right has stats
- Boxes fade in sequentially via `whileInView` with stagger
- "Bygging" box styled as dark/scary, "Testing" box with red accent
- Stats appear with counter animation

**Section 3 — "Hva om du kunne hoppe over?" (Solution)**
- Same 3-box layout but middle box transforms to blue VirtualHouse branded
- Timeline compression animation: "18 maneder" shrinks to "3 minutter"
- Green checkmark on final box

**Section 4 — "Prov selv" (Interactive Simulator)**
- Building type selector: 3 large cards (Kontor/Skole/Sykehus) with icons
- On selection, show simplified PID diagram area + 4 friendly sliders:
  - Radiatortemperatur (40-70) -> updates `heatingTurRetur[0]`
  - Ventilasjonskraft (0.8-2.5) -> updates `sfpDesign`
  - Gjenvinning av varme (50-95%) -> updates `heatRecoveryEff`
  - Kjolekapasitet (100-600) -> updates `installedCooling`
- "Simuler 2 ar" button triggers result reveal
- Results: reuse ResultsEnergi, ResultsKomfort patterns (simplified cards showing key metrics from useSimResult)

**Section 5 — "Det virkelige blir interessant..." (Advanced)**
- Three toggle buttons that modify simulation inputs:
  - "Arstidsvariasjoner" — no-op visual (data already seasonal)
  - "Slitasje over 2 ar" — reduces heatRecoveryEff by 6%, increases sfpDesign by 15%
  - "Samtidig varme/kjole" — shows warning card about NOK 42,000/ar waste
- Results update live when toggles change

**Section 6 — CTA**
- Headline + two buttons:
  - "Last opp funksjonsbeskrivelse" -> navigates to `/simulator`
  - "Kontakt oss" -> mailto or placeholder
- Social proof logos row (placeholder company names as text badges)

### 3. Update AppLayout for `/simulator`

- Keep existing `AppLayout` with sidebar, but update the default route inside it
- The sidebar's "/" link changes to point to `/simulator` as the dashboard landing
- All existing pages (Driftsmorgen, Prosjekt, Datainput, Simulering, etc.) remain accessible under `/simulator/*` sub-routes

### 4. Files modified

| File | Change |
|------|--------|
| `src/App.tsx` | Replace routing: `/` = Story, `/simulator/*` = AppLayout with all existing routes |
| `src/pages/Story.tsx` | **New** — the full storytelling page |
| `src/components/AppSidebar.tsx` | Update nav paths to be prefixed with `/simulator` |
| `src/components/AppLayout.tsx` | Keep as-is (used by `/simulator` route) |

No existing simulation components are deleted. All are reused at `/simulator/*`.

