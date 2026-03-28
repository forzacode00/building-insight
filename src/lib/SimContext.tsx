import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { runSimulation, type SimInput, type SimResult } from "./simulationEngine";

const defaultInput: SimInput = {
  bra: 6000,
  installedHeating: 150,     // kW — tilpasset modellens varmetapstall H''=0.55
  installedCooling: 200,      // kW — realistisk for 6000m² kontor
  heatingTurRetur: [55, 40],
  coolingTurRetur: [6, 12],
  sfpDesign: 1.5,
  airflowSupply: 42000,
  airflowExtract: 40500,
  heatRecoveryEff: 0.82,
  numCoolingBaffles: 200,     // stk kjølebafler
  baffleCapacity: 1000,       // W per bafel — gir 200 kW total, matcher installedCooling
  cop: 4.5,
  dut: -21.8,
  setpointHeating: 21,
  setpointCoolingMax: 26,
  location: "oslo",
};

// Optimized input for comparison page
const optimizedOverrides: Partial<SimInput> = {
  sfpDesign: 1.2,
  heatRecoveryEff: 0.85,
  numCoolingBaffles: 225, // +25%
  airflowSupply: 42000,
};

interface SimContextValue {
  input: SimInput;
  updateInput: <K extends keyof SimInput>(key: K, value: SimInput[K]) => void;
  resetInput: () => void;
  result: SimResult;
  optimizedResult: SimResult;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<SimInput>(defaultInput);

  const updateInput = useCallback(<K extends keyof SimInput>(key: K, value: SimInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetInput = useCallback(() => setInput(defaultInput), []);

  const result = useMemo(() => runSimulation(input), [input]);

  const optimizedResult = useMemo(() => {
    const optInput: SimInput = { ...input, ...optimizedOverrides };
    return runSimulation(optInput);
  }, [input]);

  const value = useMemo(
    () => ({ input, updateInput, result, optimizedResult, resetInput }),
    [input, updateInput, result, optimizedResult, resetInput]
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSimInput() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSimInput must be used within SimProvider");
  return { input: ctx.input, updateInput: ctx.updateInput, resetInput: ctx.resetInput };
}

export function useSimResult() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSimResult must be used within SimProvider");
  return ctx.result;
}

export function useOptimizedResult() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useOptimizedResult must be used within SimProvider");
  return ctx.optimizedResult;
}
