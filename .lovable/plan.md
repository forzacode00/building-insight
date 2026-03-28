

# Fix 5 Issues on Story Page

## Changes — all in `src/pages/Story.tsx`

### 1. Animated transformation in SolutionSection
Replace the static middle box with a `motion.div` that uses `useInView` to animate from dark/grey styling to blue/primary. Add a time badge that morphs from "12–18 mnd" to "3 min" using a state toggle triggered by `useInView`.

### 2. Year 1 vs Year 2 results in SimulatorSection
- Import `runSimulation` from `simulationEngine.ts` and `useMemo` from React
- When `showResults` is true, compute `year2Result` using degraded inputs (heatRecoveryEff × 0.94, sfpDesign × 1.15, cop × 0.95)
- Render two labeled rows: "År 1" with current result, "År 2" with year2Result
- Show delta arrows between key metrics

### 3. Functional "Årstidsvariasjoner" toggle
- Import `ResponsiveContainer`, `BarChart`, `Bar`, `XAxis` from `recharts`
- When `toggles.seasons` is active, render a 12-bar monthly energy chart using `result.monthlyKwh`
- Month labels: Jan–Des, styled consistently

### 4. Energy breakdown card in SimResults
- Add a 4th card with stacked horizontal mini-bars showing heating, fans, cooling, and "other" (lighting + equipment + DHW)
- Create a `MiniBar` helper component with label, proportional bar width, and value

### 5. Update SimResults grid
- Change grid from `sm:grid-cols-3` to `sm:grid-cols-2 lg:grid-cols-4`

### Technical Details

**File**: `src/pages/Story.tsx`

**New imports**:
- `useMemo` from React
- `runSimulation, SimInput` from `@/lib/simulationEngine`
- `ResponsiveContainer, BarChart, Bar, XAxis` from `recharts`

**SolutionSection** rewrite: Break out the middle box from the `.map()` loop. Use a `useRef`/`useInView` pair. The box starts with `initial={{ borderColor, backgroundColor }}` matching the Problem section's dark "Bygging" box, then animates to primary/blue. A separate state `timeText` flips from "12–18 mnd" to "3 minutter" after a 0.8s delay when in view.

**SimulatorSection**: Add `year2Input` derived from `input` with degraded values. Compute `year2Result = useMemo(() => runSimulation(year2Input), [...deps])`. Render `<SimResults>` twice with "År 1"/"År 2" labels and delta indicators.

**AdvancedSection**: Add the seasonal bar chart inside a `motion.div` when `toggles.seasons` is true.

**SimResults**: Add `MiniBar` component. Update grid class. Add 4th energy breakdown card.

