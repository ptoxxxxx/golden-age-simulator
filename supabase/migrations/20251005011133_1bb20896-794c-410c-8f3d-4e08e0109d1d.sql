-- Create users profile table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mode text DEFAULT 'sandbox' CHECK (mode IN ('sandbox')),
  status text DEFAULT 'active' CHECK (status IN ('active','finished')),
  tempo_profile text DEFAULT 'realistic' CHECK (tempo_profile IN ('realistic','fast','custom')),
  tempo_custom_config jsonb,
  created_at timestamp with time zone DEFAULT now(),
  finished_at timestamp with time zone
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own games" ON public.games
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create player_states table
CREATE TABLE IF NOT EXISTS public.player_states (
  id bigserial PRIMARY KEY,
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  turn_number int NOT NULL,
  age int NOT NULL,
  education text,
  health int,
  happiness int,
  relationships int,
  saldo int,
  zus_account int,
  zus_contributions int,
  zus_type text,
  private_investments int,
  savings int,
  insurance_status text,
  risk_level int,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(game_id, turn_number)
);

ALTER TABLE public.player_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own player states" ON public.player_states
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.games g 
      WHERE g.id = game_id AND g.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.games g 
      WHERE g.id = game_id AND g.user_id = auth.uid()
    )
  );

-- Create scenarios table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id bigserial PRIMARY KEY,
  area text CHECK (area IN ('Work','Health','Education','Family','Savings','Risk')),
  min_age int,
  max_age int,
  min_education text,
  min_health int,
  other_conditions jsonb,
  story_prompt text NOT NULL,
  mode text DEFAULT 'sandbox',
  tags text[],
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenarios are publicly readable" ON public.scenarios
  FOR SELECT USING (true);

-- Create scenario_options table
CREATE TABLE IF NOT EXISTS public.scenario_options (
  id bigserial PRIMARY KEY,
  scenario_id bigint REFERENCES public.scenarios(id) ON DELETE CASCADE NOT NULL,
  option_text text NOT NULL,
  effects jsonb,
  ai_coach_comment text,
  next_scenario_id bigint
);

ALTER TABLE public.scenario_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenario options are publicly readable" ON public.scenario_options
  FOR SELECT USING (true);

-- Create player_choices table
CREATE TABLE IF NOT EXISTS public.player_choices (
  id bigserial PRIMARY KEY,
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  turn_number int NOT NULL,
  scenario_id bigint REFERENCES public.scenarios(id),
  option_id bigint REFERENCES public.scenario_options(id),
  effects jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.player_choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own choices" ON public.player_choices
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create user_avatars table
CREATE TABLE IF NOT EXISTS public.user_avatars (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age_group int,
  mood text,
  background text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  extra_params jsonb
);

ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own avatars" ON public.user_avatars
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX idx_games_user_id ON public.games(user_id);
CREATE INDEX idx_player_states_game_id ON public.player_states(game_id);
CREATE INDEX idx_player_choices_game_id ON public.player_choices(game_id);
CREATE INDEX idx_player_choices_user_id ON public.player_choices(user_id);
CREATE INDEX idx_scenario_options_scenario_id ON public.scenario_options(scenario_id);
CREATE INDEX idx_scenarios_area ON public.scenarios(area);
CREATE INDEX idx_user_avatars_user_id ON public.user_avatars(user_id);