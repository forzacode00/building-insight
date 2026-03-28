

# Story.tsx Flow Restructuring

## Overview
Restructure the narrative flow by replacing ProblemSection/SolutionSection with PainBandSection/TheFlipSection, moving WowDemo into TheFlipSection, making Section height flexible, adding personalized CTA, and adjusting section heights.

## Changes (all in `src/pages/Story.tsx`)

### 1. Make Section flexible
Remove `min-h-screen` and `py-24` from the default Section component. Each section sets its own height via `className`.

### 2. Update Story return block
Replace `ProblemSection` → `PainBandSection`, `SolutionSection` → `TheFlipSection`. Same 6 sections total.

### 3. New PainBandSection (replaces ProblemSection)
- Compact `py-16` section (not full-screen)
- 3-column stats row at top (30%, 15–25%, 6–12 mnd) — all `text-5xl text-destructive`
- Below: vertical single-column timeline (Prosjektering → Bygging with red glow → Testing)
- Bygging box has merged badge: "12–18 mnd · 20–80 MNOK"
- No 2-column layout, no separate right-side stats

### 4. New TheFlipSection (replaces SolutionSection)
- Keep ALL existing SolutionSection logic (transformRef, inView, timeText, timeline cards, motion animations)
- Set `min-h-screen py-24` via className
- Add `mb-14` to the timeline wrapper
- After the "18 måneder → 3 minutter" pill, add WowDemo with a label "Slik ser det ut i praksis"

### 5. Update SimulatorSection
- Remove `<WowDemo />` call and the "Nå er det din tur:" FadeIn
- Replace heading to "Nå er det din tur" with subtitle "Du har sett hva vi finner. Test ditt eget bygg — på 3 minutter."
- Set `<Section className="min-h-screen py-24">`

### 6. Update AdvancedSection
- Change to `<Section className="py-20">`
- New heading: "Men bygget ditt lever ikke i et laboratorium"
- New subtitle: "Den simuleringen du akkurat kjørte er et ideelt utgangspunkt. Nå — hva skjer i virkeligheten?"

### 7. Update CTASection
- Change to `<Section className="py-24">`
- Add `useSimResult()` and `useSimInput()` imports
- Add personalized summary card above the CTA when simulation has been run (shows building type, BRA, energy, cost, TEK17 status)
- Add "VirtualHouse™ Investor Demo — v1.0" footer (already exists, keep it)

## Technical Details

**No new imports needed.** All components (WowDemo, SimResults, etc.) remain unchanged. Only the section-level functions are restructured.

**Section component change:**
```tsx
function Section({ children, className = "" }: { ... }) {
  return <section className={`relative flex flex-col items-center justify-center px-6 ${className}`}>{children}</section>;
}
```

**HeroSection:** Add `className="min-h-screen py-24"` to its `<Section>`.

**CTASection personalization:** Derives `buildingLabel` from `input.bra` (6000→Kontor, 8000→Skole, 12000→Sykehus) and shows energy/cost summary only when `result.totalEnergyKwhM2 > 0`.

