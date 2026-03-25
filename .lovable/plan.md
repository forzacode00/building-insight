

# VirtualHouse Simulator — Implementation Plan

## Overview
A premium physics-based building systems simulation platform for Norwegian construction, designed as an investor demo. Dark navy theme, Norwegian UI, hardcoded demo data.

## Phase 1: App Shell & First Impression

### 1. Navigation Sidebar
- Fixed left sidebar with dark navy (#0A1628) background
- VirtualHouse logo (house icon with circuit traces) at top
- Project name "Parkveien Kontorbygg" with green "Simulering fullført ✓" badge
- All 9 nav items with icons, active state highlighting
- "NY" badges on Nettverkskart and SD Live
- "Portefølje" greyed out with lock icon
- Collapsible on mobile

### 2. Screen 0: Driftsmorgen (Default Home)
- Morning greeting bar with date/time
- **Nattlige hendelser**: 2 alert cards (yellow warning, red critical) with colored borders and "Undersøk →" buttons
- **Energistatus i går**: Energy comparison (2,340 vs 2,180 kWh), sparkline chart via Recharts, energy label badge
- **Tid spart**: Time savings comparison banner
- **Hurtighandlinger**: 3 large action buttons with icons
- **Prosjekthistorikk**: Timeline of 3 past actions with dates and results

### 3. Design System Setup
- CSS variables for dark theme (bg #0A1628, cards #111827, borders #1F2937)
- Color system: Red (Varme), Blue (Kjøling), Green (OK), Yellow (Warning), Purple (Automasjon)
- Framer Motion for smooth page transitions and card animations
- Typography: clean, premium SaaS aesthetic

### 4. Remaining Screens (placeholder pages)
- Stub pages for Prosjekt, Datainput, Simulering, Sammenligning, Nettverkskart, SD Live, Priser — with headers only, ready for future implementation

