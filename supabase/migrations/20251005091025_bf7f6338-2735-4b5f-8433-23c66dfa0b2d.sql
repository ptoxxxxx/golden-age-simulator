-- Remove happiness column and add new life parameters
ALTER TABLE public.player_states
DROP COLUMN IF EXISTS happiness;

ALTER TABLE public.player_states
ADD COLUMN IF NOT EXISTS career INTEGER DEFAULT 50 CHECK (career >= 0 AND career <= 100),
ADD COLUMN IF NOT EXISTS education_level INTEGER DEFAULT 50 CHECK (education_level >= 0 AND education_level <= 100),
ADD COLUMN IF NOT EXISTS entertainment INTEGER DEFAULT 50 CHECK (entertainment >= 0 AND entertainment <= 100);

COMMENT ON COLUMN public.player_states.career IS 'Career satisfaction and progress (0-100)';
COMMENT ON COLUMN public.player_states.education_level IS 'Educational development and learning (0-100)';
COMMENT ON COLUMN public.player_states.entertainment IS 'Leisure, hobbies, and fun activities (0-100)';