// Simplified building energy calculation engine
// Based on ISO 13790 simplified hourly method principles
// Pure TypeScript — zero dependencies

export interface SimInput {
  bra: number;
  installedHeating: number;
  installedCooling: number;
  heatingTurRetur: [number, number];
  coolingTurRetur: [number, number];
  sfpDesign: number;
  airflowSupply: number;
  airflowExtract: number;
  heatRecoveryEff: number;
  numCoolingBaffles: number;
  baffleCapacity: number;
  cop: number;
  dut: number;
  setpointHeating: number;
  setpointCoolingMax: number;
  location: "oslo" | "bergen" | "trondheim";
}

export interface SimResult {
  totalEnergyKwhM2: number;
  heatingKwhM2: number;
  coolingKwhM2: number;
  fansKwhM2: number;
  lightingKwhM2: number;
  equipmentKwhM2: number;
  dhwKwhM2: number;
  annualCostNOK: number;
  co2Tonnes: number;
  hoursAbove26: number;
  hoursBelow19: number;
  avgCO2ppm: number;
  avgRHwinter: number;
  sfpActual: number;
  heatRecoveryActual: number;
  healthScore: number;
  monthlyKwh: number[];
  tek17Limit: number;
  exceedsTEK17: boolean;
  avvik: Avvik[];
}

export interface Avvik {
  nr: number;
  system: string;
  severity: "critical" | "warning" | "ok";
  title: string;
  description: string;
  tiltak: string;
}

// Monthly average outdoor temperatures (°C) — 1991–2020 normals (met.no/Wikipedia)
const CLIMATE: Record<SimInput["location"], number[]> = {
  oslo:       [-2.3, -1.9,  1.3, 6.2, 11.4, 15.3, 17.6, 16.5, 12.1,  6.5,  2.1, -1.4],
  bergen:     [ 2.6,  2.3,  3.8, 7.2, 10.7, 13.6, 15.6, 15.4, 12.6,  8.6,  5.3,  3.1],
  trondheim:  [-1.0, -1.2,  0.7, 4.6,  8.5, 11.8, 14.8, 14.1, 10.6,  5.5,  2.1, -0.9],
};

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const HOURS_IN_MONTH = DAYS_IN_MONTH.map((d) => d * 24);

const U_AVG = 0.55;           // W/(m²·K) normalized building heat loss per BRA (varmetapstall H'')
const INTERNAL_LOAD = 35;     // W/m² people + equipment
const OPERATING_HOURS = 3120; // 12h/day × 5 days × 52 weeks — NS 3031 normert
const ENERGY_PRICE = 1.20;    // NOK/kWh all-in commercial estimate (SSB/NVE 2025)
const GRID_CO2 = 0.018;       // kg CO₂/kWh Norwegian grid direct (NVE 2024, produksjonsmiks)
const LIGHTING_KWH_M2 = 18;
const EQUIPMENT_KWH_M2 = 20;
const DHW_KWH_M2 = 5;
const TEK17_OFFICE = 115;     // kWh/m²·yr

/**
 * Generate 8760 hourly outdoor temperatures from monthly averages
 * using sinusoidal daily variation (±5 °C).
 */
function generateHourlyTemps(monthlyAvg: number[]): number[] {
  const hours: number[] = [];
  for (let m = 0; m < 12; m++) {
    const avg = monthlyAvg[m];
    const hoursInM = HOURS_IN_MONTH[m];
    for (let h = 0; h < hoursInM; h++) {
      const hourOfDay = h % 24;
      // Peak at 14:00, trough at 02:00
      const diurnal = 5 * Math.sin(((hourOfDay - 2) / 24) * 2 * Math.PI);
      hours.push(avg + diurnal);
    }
  }
  return hours;
}

/**
 * Map each of 8760 hours to its month index (0-11).
 */
function hourToMonth(): number[] {
  const map: number[] = [];
  for (let m = 0; m < 12; m++) {
    for (let h = 0; h < HOURS_IN_MONTH[m]; h++) {
      map.push(m);
    }
  }
  return map;
}

export function runSimulation(input: SimInput): SimResult {
  const {
    bra, installedCooling, sfpDesign, airflowSupply,
    heatRecoveryEff, numCoolingBaffles, baffleCapacity,
    cop, setpointHeating, setpointCoolingMax, location,
  } = input;

  const monthlyAvg = CLIMATE[location];
  const hourlyTemp = generateHourlyTemps(monthlyAvg);
  const hToM = hourToMonth();

  // Ventilation fraction of total heat loss (~40% for typical office)
  const ventilationFraction = 0.4;
  const recoveryAdjust = 1 - heatRecoveryEff * ventilationFraction;
  const heatRecoveryActual = heatRecoveryEff * 0.93; // real-world degradation

  // --- Heating ---
  let heatingDegreeHours = 0;
  for (let h = 0; h < hourlyTemp.length; h++) {
    const diff = setpointHeating - hourlyTemp[h];
    if (diff > 0) heatingDegreeHours += diff;
  }
  const heatingKwh = (bra * U_AVG * heatingDegreeHours * recoveryAdjust) / 1000;
  const heatingKwhM2 = heatingKwh / bra;

  // --- Cooling ---
  const totalBaffleCapW = numCoolingBaffles * baffleCapacity;
  const totalBaffleCapKw = totalBaffleCapW / 1000;
  let coolingHours = 0;
  let hoursAbove26 = 0;

  for (let h = 0; h < hourlyTemp.length; h++) {
    const hourOfDay = h % 24;
    const isOccupied = hourOfDay >= 7 && hourOfDay <= 19;
    if (!isOccupied) continue;

    const internalContrib = (INTERNAL_LOAD * bra) / 1000; // kW
    const effectiveRoomTemp = hourlyTemp[h] + (isOccupied ? INTERNAL_LOAD * 0.15 : 0);
    // Room needs cooling when effective temp pushes above threshold
    if (effectiveRoomTemp > 18 || hourlyTemp[h] > 18) {
      const demand = Math.max(0, effectiveRoomTemp - setpointHeating) * bra * U_AVG / 1000;
      if (demand > 0) coolingHours++;
      // Check if cooling capacity can keep room below 26
      if (effectiveRoomTemp > setpointCoolingMax) {
        const coolingAvailable = Math.min(installedCooling, totalBaffleCapKw);
        const excess = (effectiveRoomTemp - setpointCoolingMax) * bra * U_AVG / 1000;
        if (excess > coolingAvailable) hoursAbove26++;
      }
    }
  }

  const avgLoadFactor = 0.55;
  const coolingKwh = (coolingHours * installedCooling * avgLoadFactor) / cop;
  const coolingKwhM2 = coolingKwh / bra;

  // --- Fans (SFP) ---
  const airflowM3s = airflowSupply / 3600;
  const sfpActual = sfpDesign * 1.15; // 15% real-world degradation
  const fansKwh = sfpActual * airflowM3s * OPERATING_HOURS;
  const fansKwhM2 = fansKwh / bra;

  // --- Fixed loads ---
  const lightingKwhM2 = LIGHTING_KWH_M2;
  const equipmentKwhM2 = EQUIPMENT_KWH_M2;
  const dhwKwhM2 = DHW_KWH_M2;

  // --- Totals ---
  const totalEnergyKwhM2 = heatingKwhM2 + coolingKwhM2 + fansKwhM2 + lightingKwhM2 + equipmentKwhM2 + dhwKwhM2;
  const exceedsTEK17 = totalEnergyKwhM2 > TEK17_OFFICE;
  const annualCostNOK = Math.round(totalEnergyKwhM2 * bra * ENERGY_PRICE);
  const co2Tonnes = Math.round((totalEnergyKwhM2 * bra * GRID_CO2) / 1000 * 10) / 10;

  // --- Comfort ---
  let hoursBelow19 = 0;
  for (let h = 0; h < hourlyTemp.length; h++) {
    // Near DUT conditions, heating may not keep up
    if (hourlyTemp[h] < input.dut + 5) {
      const heatCapKw = input.installedHeating;
      const heatDemandKw = (setpointHeating - hourlyTemp[h]) * bra * U_AVG / 1000 * recoveryAdjust;
      if (heatDemandKw > heatCapKw) hoursBelow19++;
    }
  }

  const airChangeRate = airflowSupply / bra; // m³/h per m²
  const avgCO2ppm = Math.max(400, Math.round(750 - (airChangeRate - 2) * 50));
  // RF avtar med økt ventilasjon om vinteren (mer tørr uteluft inn)
  const avgRHwinter = Math.max(10, Math.round((30 - airChangeRate * 1.5) * 10) / 10);

  // --- Monthly breakdown ---
  // Weight heating by degree-hours and cooling by warm hours per month
  const monthlyHeatingWeight: number[] = new Array(12).fill(0);
  const monthlyCoolingWeight: number[] = new Array(12).fill(0);
  for (let h = 0; h < hourlyTemp.length; h++) {
    const m = hToM[h];
    const heatDiff = Math.max(0, setpointHeating - hourlyTemp[h]);
    monthlyHeatingWeight[m] += heatDiff;
    if (hourlyTemp[h] > 18) monthlyCoolingWeight[m] += hourlyTemp[h] - 18;
  }

  const totalHeatingW = monthlyHeatingWeight.reduce((a, b) => a + b, 0) || 1;
  const totalCoolingW = monthlyCoolingWeight.reduce((a, b) => a + b, 0) || 1;
  const baseMonthlykWhM2 = (lightingKwhM2 + equipmentKwhM2 + dhwKwhM2) / 12;

  const monthlyKwh = Array.from({ length: 12 }, (_, m) => {
    const heat = heatingKwhM2 * (monthlyHeatingWeight[m] / totalHeatingW);
    const cool = coolingKwhM2 * (monthlyCoolingWeight[m] / totalCoolingW);
    const fans = fansKwhM2 / 12;
    return Math.round((heat + cool + fans + baseMonthlykWhM2) * 10) / 10;
  });

  // --- Health score ---
  let healthScore = 100;
  if (exceedsTEK17) healthScore -= 15;
  if (sfpActual > 1.5) healthScore -= 10;
  if (hoursAbove26 > 50) healthScore -= Math.round((hoursAbove26 - 50) * 0.1);
  if (heatRecoveryActual < 0.80) healthScore -= 5;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  // --- Avvik detection ---
  const avvik: Avvik[] = [];
  let avvikNr = 1;

  if (sfpActual > 1.5) {
    avvik.push({
      nr: avvikNr++,
      system: "36 Luftbehandling",
      severity: "critical",
      title: "SFP overskrider TEK17",
      description: `Simulert SFP ${sfpActual.toFixed(1)} kW/(m³/s) overskrider TEK17-krav ≤1.5 for kontorbygning. Skyldes høyt trykktap i kanalnett og filtermotstand.`,
      tiltak: "Optimaliser kanaldimensjoner. Vurder EC-motorer. Redusert trykktap kan gi SFP ~1.4.",
    });
  }

  if (exceedsTEK17) {
    const pctOver = Math.round(((totalEnergyKwhM2 - TEK17_OFFICE) / TEK17_OFFICE) * 100);
    avvik.push({
      nr: avvikNr++,
      system: "32/36 Energi",
      severity: "critical",
      title: "Energiramme overskredet",
      description: `Totalt netto energibehov ${Math.round(totalEnergyKwhM2)} kWh/m²·år overskrider TEK17-ramme ${TEK17_OFFICE} kWh/m²·år med ${pctOver}%.`,
      tiltak: `Øk gjenvinner-virkningsgrad til 85%, reduser SFP, installer behovsstyrt belysning. Estimert reduksjon: ${Math.round(totalEnergyKwhM2 - TEK17_OFFICE + 5)} kWh/m²·år.`,
    });
  }

  if (hoursAbove26 > 50) {
    avvik.push({
      nr: avvikNr++,
      system: "37 Kjøling",
      severity: "warning",
      title: "Overtemperatur sommer",
      description: `${hoursAbove26} timer >26°C i kontorer. Kjølekapasitet underdimensjonert for intern- og solbelastning.`,
      tiltak: "Øk kjølebafel-kapasitet med 25%, eller installer utvendig solavskjerming.",
    });
  }

  // Pump oversizing check (heuristic: if heating is >30% oversized vs demand)
  const peakHeatDemandKw = (setpointHeating - input.dut) * bra * U_AVG / 1000 * recoveryAdjust;
  if (input.installedHeating > peakHeatDemandKw * 1.5) {
    avvik.push({
      nr: avvikNr++,
      system: "32 Varme",
      severity: "warning",
      title: "Pumpe overdimensjonert",
      description: `Installert varmeeffekt ${input.installedHeating} kW er ${Math.round((input.installedHeating / peakHeatDemandKw - 1) * 100)}% over dimensjonerende behov. Pumpe kjører mye på dellast.`,
      tiltak: "Bytt til frekvensstyrte pumper med trykkregulering. Estimert besparelse: ~4 000 kWh/år.",
    });
  }

  // TEK17 designkrav: varmegjenvinning ≥ 80 % (prosjektert)
  if (heatRecoveryEff < 0.80) {
    avvik.push({
      nr: avvikNr++,
      system: "36 Luft",
      severity: "warning",
      title: "Gjenvinner oppfyller ikke TEK17-krav",
      description: `Prosjektert temperaturvirkningsgrad ${Math.round(heatRecoveryEff * 100)}% er under TEK17-krav ≥ 80%. Må økes for å oppnå samsvar.`,
      tiltak: "Bytt til roterende varmeveksler med ≥80% temperaturvirkningsgrad. Vurder motstrøms plateveksler.",
    });
  }
  // Driftsvarsel: faktisk gjenvinner under 76 % (unormal degradering)
  if (heatRecoveryActual < 0.76 && heatRecoveryEff >= 0.80) {
    avvik.push({
      nr: avvikNr++,
      system: "36 Luft",
      severity: "warning",
      title: "Gjenvinner degradert under driftsgrense",
      description: `Faktisk temperaturvirkningsgrad ${Math.round(heatRecoveryActual * 100)}% vs. prosjektert ${Math.round(heatRecoveryEff * 100)}%. Degradering større enn forventet.`,
      tiltak: "Rengjør gjenvinnerrotor. Kontroller tettinger. Planlegg utskifting innen 2 år.",
    });
  }

  return {
    totalEnergyKwhM2: Math.round(totalEnergyKwhM2 * 10) / 10,
    heatingKwhM2: Math.round(heatingKwhM2 * 10) / 10,
    coolingKwhM2: Math.round(coolingKwhM2 * 10) / 10,
    fansKwhM2: Math.round(fansKwhM2 * 10) / 10,
    lightingKwhM2,
    equipmentKwhM2,
    dhwKwhM2,
    annualCostNOK,
    co2Tonnes,
    hoursAbove26,
    hoursBelow19,
    avgCO2ppm,
    avgRHwinter,
    sfpActual: Math.round(sfpActual * 100) / 100,
    heatRecoveryActual: Math.round(heatRecoveryActual * 100) / 100,
    healthScore,
    monthlyKwh,
    tek17Limit: TEK17_OFFICE,
    exceedsTEK17,
    avvik,
  };
}
