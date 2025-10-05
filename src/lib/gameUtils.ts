export const INITIAL_PLAYER_STATE = {
  age: 18,
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
  state: Record<string, number>,
  effects: Record<string, number>
): Record<string, number> => {
  const newState = { ...state };
  
  Object.entries(effects).forEach(([key, value]) => {
    if (typeof newState[key] === "number") {
      newState[key] = Math.max(0, Math.min(100, newState[key] + value));
    }
  });
  
  return newState;
};
