-- Add new financial columns to player_states table
ALTER TABLE player_states
ADD COLUMN IF NOT EXISTS salary integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS planned_retirement_age integer DEFAULT 67,
ADD COLUMN IF NOT EXISTS estimated_pension integer DEFAULT 0;

COMMENT ON COLUMN player_states.salary IS 'Monthly salary/income';
COMMENT ON COLUMN player_states.planned_retirement_age IS 'Age when player plans to retire';
COMMENT ON COLUMN player_states.estimated_pension IS 'Estimated monthly pension amount';