export const INITIAL_PLAYER_STATE = {
  age: 20,
  education: "high_school",
  health: 80,
  happiness: 70,
  relationships: 60,
  saldo: 1000,
  zus_account: 0,
  zus_contributions: 0,
  zus_type: "standard",
  private_investments: 0,
  savings: 0,
  insurance_status: "none",
  risk_level: 50,
};

export const sanitizeFilename = (userId: string, filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  return `${userId}-${timestamp}.${ext}`.replace(/[^a-z0-9-_.]/gi, "-");
};

export const applyEffects = (
  state: any,
  effects: Record<string, number>
): any => {
  const newState = { ...state };
  
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof newState[key] === "number") {
      // Clamp percentage values (health, happiness, relationships, risk_level)
      if (['health', 'happiness', 'relationships', 'risk_level'].includes(key)) {
        newState[key] = Math.max(0, Math.min(100, newState[key] + value));
      } else {
        // For financial values, just add (no clamping)
        newState[key] = newState[key] + value;
      }
    }
  });
  
  return newState;
};

export const TEMPO_PROFILES = {
  realistic: { ageIncrement: 1, label: "Realistic (1 year/turn)" },
  fast: { ageIncrement: 2, label: "Fast (2 years/turn)" },
  custom: { ageIncrement: 1, label: "Custom" },
};

export const calculateAgeIncrement = (tempoProfile: string, customConfig?: any): number => {
  if (tempoProfile === "custom" && customConfig?.ageIncrement) {
    return customConfig.ageIncrement;
  }
  return TEMPO_PROFILES[tempoProfile as keyof typeof TEMPO_PROFILES]?.ageIncrement || 1;
};

export const isGameOver = (age: number): boolean => {
  return age >= 100;
};
