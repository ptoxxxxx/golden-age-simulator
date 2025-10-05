-- Insert 25 scenarios with their options for the Golden Age game

-- Scenario 1: Uncle's off-the-books job (Work)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Work', 20, 25, 'high_school', 0, '{}', 'Your uncle offers a well-paid job off the books. What do you do?', 'sandbox', ARRAY['cash', 'no-contract'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Take it for quick cash', '{"saldo": 1500, "zus_contributions": 0, "risk_level": 10}'::jsonb, 'More cash now, but no contributions — plan for retirement yourself.' FROM new_scenario
UNION ALL SELECT id, 'Say no and find legal job', '{"saldo": 800, "zus_contributions": 300, "risk_level": -5}'::jsonb, 'Less cash now, but safer and contributes to your pension.' FROM new_scenario
UNION ALL SELECT id, 'Ask family for help first', '{"saldo": 1000, "happiness": -5}'::jsonb, 'Support helps, but you trade some independence.' FROM new_scenario;

-- Scenario 2: B2B contract (Work)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Work', 20, 30, 'high_school', 0, '{}', 'Employer proposes B2B instead of employment contract.', 'sandbox', ARRAY['B2B'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Accept B2B for higher net pay', '{"saldo": 1200, "risk_level": 5}'::jsonb, 'Higher net today, but you must handle your own contributions.' FROM new_scenario
UNION ALL SELECT id, 'Ask for full employment', '{"saldo": 700, "zus_contributions": 400, "risk_level": 0}'::jsonb, 'Lower net now, higher long-term security.' FROM new_scenario;

-- Scenario 3: Gym vs overtime (Health)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Health', 25, 30, NULL, 0, '{}', 'Gym with friends or paid overtime?', 'sandbox', ARRAY['balance'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Take overtime', '{"saldo": 500, "health": -10, "happiness": -5, "risk_level": 5}'::jsonb, 'More money, but your health debt grows.' FROM new_scenario
UNION ALL SELECT id, 'Go to the gym', '{"health": 10, "happiness": 5}'::jsonb, 'No extra money, but you invest in health.' FROM new_scenario;

-- Scenario 4: Study abroad (Education)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Education', 19, 22, 'high_school', 0, '{}', 'You got into dream studies abroad.', 'sandbox', ARRAY['study-abroad'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Move and invest in education', '{"saldo": -3000, "private_investments": 0, "risk_level": 5}'::jsonb, 'Pain now, but unlocks higher pay later.' FROM new_scenario
UNION ALL SELECT id, 'Stay and start working', '{"saldo": 1000}'::jsonb, 'Income starts sooner, but salary ceiling may be lower.' FROM new_scenario;

-- Scenario 5: Having a child (Family)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Family', 30, 35, NULL, 0, '{}', 'Your partner wants a child, you are unsure.', 'sandbox', ARRAY['family'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Have a child', '{"saldo": -2000, "happiness": 10, "relationships": 10}'::jsonb, 'Costs increase but so can happiness and support.' FROM new_scenario
UNION ALL SELECT id, 'Postpone', '{"saldo": 1000, "happiness": -2}'::jsonb, 'More time for work and savings, but uncertainty grows.' FROM new_scenario;

-- Scenario 6: Bank investment (Savings)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Savings', 28, 35, NULL, 0, '{}', 'Bank calls: 6% deposit vs investment fund.', 'sandbox', ARRAY['invest'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Deposit (safe)', '{"savings": 1000}'::jsonb, 'Slow and steady growth.' FROM new_scenario
UNION ALL SELECT id, 'Fund (risky)', '{"private_investments": 1200, "risk_level": 5}'::jsonb, 'Higher upside, but value may go down too.' FROM new_scenario;

-- Scenario 7: Accident with broken leg (Risk)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Risk', 20, 60, NULL, 0, '{}', 'Accident — you broke your leg.', 'sandbox', ARRAY['insurance'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'You have insurance', '{"saldo": 0, "health": -15}'::jsonb, 'Insurance cushions the blow.' FROM new_scenario
UNION ALL SELECT id, 'No insurance', '{"saldo": -1500, "health": -15, "happiness": -5}'::jsonb, 'Emergency fund helps in such moments.' FROM new_scenario;

-- Scenario 8: New job switch (Work)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Work', 22, 28, 'high_school', 0, '{}', 'Switch to a new job with lower stability but higher pay?', 'sandbox', ARRAY['career'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Switch', '{"saldo": 1000, "risk_level": 5}'::jsonb, 'Higher pay means more savings potential.' FROM new_scenario
UNION ALL SELECT id, 'Stay', '{"saldo": 200, "risk_level": -2}'::jsonb, 'Stability has its own value.' FROM new_scenario;

-- Scenario 9: Freelance gig (Work)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Work', 26, 35, NULL, 0, '{}', 'Freelance gig after hours.', 'sandbox', ARRAY['side-hustle'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Take it', '{"saldo": 800, "happiness": -2}'::jsonb, 'Extra income, but work-life balance suffers.' FROM new_scenario
UNION ALL SELECT id, 'Decline', '{"happiness": 2}'::jsonb, 'Rest is important too.' FROM new_scenario;

-- Scenario 10: Negotiating a raise (Work)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Work', 30, 40, NULL, 0, '{}', 'Negotiating a raise.', 'sandbox', ARRAY['salary'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Negotiate', '{"saldo": 500}'::jsonb, 'Know your worth!' FROM new_scenario
UNION ALL SELECT id, 'Avoid', '{"happiness": -1}'::jsonb, 'Missed opportunity for growth.' FROM new_scenario;

-- Scenario 11: Fast food vs home cooking (Health)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Health', 20, 30, NULL, 0, '{}', 'Fast food vs home cooking.', 'sandbox', ARRAY['diet'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Fast food', '{"saldo": -50, "health": -5}'::jsonb, 'Quick but unhealthy long-term.' FROM new_scenario
UNION ALL SELECT id, 'Cook at home', '{"saldo": -30, "health": 5}'::jsonb, 'Better for health and wallet.' FROM new_scenario;

-- Scenario 12: Routine check-up (Health)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Health', 30, 50, NULL, 0, '{}', 'Routine check-up.', 'sandbox', ARRAY['checkup'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Do it', '{"saldo": -200, "health": 5}'::jsonb, 'Prevention is better than cure.' FROM new_scenario
UNION ALL SELECT id, 'Skip', '{"risk_level": 5}'::jsonb, 'Gambling with your health.' FROM new_scenario;

-- Scenario 13: Back pain treatment (Health)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Health', 35, 60, NULL, 0, '{}', 'Chronic back pain treatment.', 'sandbox', ARRAY['therapy'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Physio sessions', '{"saldo": -600, "health": 10}'::jsonb, 'Invest in your body.' FROM new_scenario
UNION ALL SELECT id, 'Ignore', '{"health": -10}'::jsonb, 'Pain compounds over time.' FROM new_scenario;

-- Scenario 14: Bootcamp vs self-study (Education)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Education', 23, 35, 'high_school', 0, '{}', 'Bootcamp or self-study?', 'sandbox', ARRAY['upskill'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Bootcamp', '{"saldo": -4000, "happiness": -2}'::jsonb, 'Structured learning has value.' FROM new_scenario
UNION ALL SELECT id, 'Self-study', '{"saldo": -500}'::jsonb, 'Self-discipline is key.' FROM new_scenario;

-- Scenario 15: Part-time master's (Education)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Education', 25, 40, 'high_school', 0, '{}', 'Part-time master''s degree.', 'sandbox', ARRAY['masters'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Enroll', '{"saldo": -6000}'::jsonb, 'Long-term career investment.' FROM new_scenario
UNION ALL SELECT id, 'Skip', '{"saldo": 0}'::jsonb, 'Experience can teach too.' FROM new_scenario;

-- Scenario 16: Certificate exam (Education)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Education', 20, 28, 'high_school', 0, '{}', 'Certificate exam fee.', 'sandbox', ARRAY['certificate'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Pay and take exam', '{"saldo": -800}'::jsonb, 'Credentials can open doors.' FROM new_scenario
UNION ALL SELECT id, 'Wait', '{"saldo": 0}'::jsonb, 'Timing matters.' FROM new_scenario;

-- Scenario 17: Move in with partner (Family)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Family', 25, 40, NULL, 0, '{}', 'Move in with partner.', 'sandbox', ARRAY['relationship'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Move in', '{"saldo": 300, "relationships": 10}'::jsonb, 'Sharing expenses helps.' FROM new_scenario
UNION ALL SELECT id, 'Stay separate', '{"saldo": -200, "relationships": -5}'::jsonb, 'Independence has costs.' FROM new_scenario;

-- Scenario 18: Support elderly parent (Family)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Family', 35, 55, NULL, 0, '{}', 'Support an elderly parent.', 'sandbox', ARRAY['care'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Provide support', '{"saldo": -500, "relationships": 10}'::jsonb, 'Family bonds strengthen.' FROM new_scenario
UNION ALL SELECT id, 'Limited help', '{"relationships": -5}'::jsonb, 'Difficult but understandable.' FROM new_scenario;

-- Scenario 19: Adopt a pet (Family)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Family', 28, 45, NULL, 0, '{}', 'Adopt a pet.', 'sandbox', ARRAY['pet'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Adopt', '{"saldo": -300, "happiness": 5}'::jsonb, 'Companionship has value.' FROM new_scenario
UNION ALL SELECT id, 'Not now', '{"happiness": -1}'::jsonb, 'Responsibility is real.' FROM new_scenario;

-- Scenario 20: Emergency fund (Savings)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Savings', 22, 50, NULL, 0, '{}', 'Build emergency fund.', 'sandbox', ARRAY['emergency-fund'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Save monthly', '{"savings": 500}'::jsonb, 'Financial safety net is crucial.' FROM new_scenario
UNION ALL SELECT id, 'Skip for now', '{"risk_level": 5}'::jsonb, 'Living on the edge.' FROM new_scenario;

-- Scenario 21: Pay off debt (Savings)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Savings', 30, 60, NULL, 0, '{}', 'Pay off high-interest debt.', 'sandbox', ARRAY['debt'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Repay aggressively', '{"saldo": -1000, "risk_level": -5}'::jsonb, 'Freedom from debt is powerful.' FROM new_scenario
UNION ALL SELECT id, 'Minimum only', '{"risk_level": 5}'::jsonb, 'Interest compounds against you.' FROM new_scenario;

-- Scenario 22: Real estate down payment (Savings)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Savings', 35, 60, NULL, 0, '{}', 'Real estate down payment.', 'sandbox', ARRAY['real-estate'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Save for down payment', '{"savings": 2000}'::jsonb, 'Building towards ownership.' FROM new_scenario
UNION ALL SELECT id, 'Rent longer', '{"saldo": -200}'::jsonb, 'Flexibility has its merits.' FROM new_scenario;

-- Scenario 23: Market downturn (Risk)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Risk', 25, 60, NULL, 0, '{}', 'Market downturn affects investments.', 'sandbox', ARRAY['market'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Hold', '{"private_investments": -500}'::jsonb, 'Long-term thinking pays off.' FROM new_scenario
UNION ALL SELECT id, 'Sell in panic', '{"saldo": -200, "happiness": -3}'::jsonb, 'Panic selling locks in losses.' FROM new_scenario;

-- Scenario 24: Job loss risk (Risk)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Risk', 30, 60, NULL, 0, '{}', 'Job loss risk increases.', 'sandbox', ARRAY['job-risk'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Build runway', '{"savings": 1000, "risk_level": -5}'::jsonb, 'Financial cushion provides security.' FROM new_scenario
UNION ALL SELECT id, 'Ignore', '{"risk_level": 10}'::jsonb, 'Hope is not a strategy.' FROM new_scenario;

-- Scenario 25: Unexpected medical bill (Risk)
WITH new_scenario AS (
  INSERT INTO public.scenarios (area, min_age, max_age, min_education, min_health, other_conditions, story_prompt, mode, tags)
  VALUES ('Risk', 40, 65, NULL, 0, '{}', 'Unexpected medical bill.', 'sandbox', ARRAY['bill'])
  RETURNING id
)
INSERT INTO public.scenario_options (scenario_id, option_text, effects, ai_coach_comment) SELECT id, 'Use emergency fund', '{"savings": -800}'::jsonb, 'This is what emergency funds are for.' FROM new_scenario
UNION ALL SELECT id, 'Borrow', '{"saldo": -800, "happiness": -2}'::jsonb, 'Debt adds stress to health issues.' FROM new_scenario;