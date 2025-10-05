-- Seed data for Golden Age game scenarios
-- 24 scenarios covering different life stages and areas

-- Scenario 1: Education - Early Career Choice (Age 18-25)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags, min_education)
VALUES (
  'You''ve just graduated high school. Your parents offer to pay for university, but you also have a job offer at a local company with decent pay. University would take 5 years and cost money, but could lead to better career opportunities.',
  18, 25, 'Education', 'sandbox',
  ARRAY['education', 'career', 'investment'],
  NULL
);

-- Get the ID of the last inserted scenario for options
DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Go to university - invest in education', 
   '{"saldo": -50000, "education": "higher", "happiness": 10, "future_income_multiplier": 1.5}'::jsonb,
   'Education is a long-term investment. While costly now, it typically increases earning potential significantly.'),
  
  (scenario_id, 'Take the job - start earning immediately',
   '{"saldo": 30000, "savings": 10000, "happiness": 5, "relationships": 5}'::jsonb,
   'Starting work early gives you income and experience, but may limit future opportunities without further education.');
END $$;

-- Scenario 2: Work - First Salary (Age 22-30)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags, min_education)
VALUES (
  'You''ve received your first real salary! It''s exciting to have money, but you''re not sure how to manage it. Should you save, invest, or enjoy your youth?',
  22, 30, 'Work', 'sandbox',
  ARRAY['finance', 'savings', 'lifestyle'],
  NULL
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Save 50% of salary in a savings account',
   '{"saldo": -15000, "savings": 15000, "happiness": -5, "risk_level": -10}'::jsonb,
   'Saving is crucial for financial security. The 50% rule is aggressive but builds a strong foundation.'),
  
  (scenario_id, 'Invest 30% in ZUS, 20% in private investments',
   '{"saldo": -15000, "zus_contributions": 9000, "private_investments": 6000, "risk_level": 5}'::jsonb,
   'Diversifying between public and private retirement is smart. Starting early maximizes compound growth.'),
  
  (scenario_id, 'Spend most on lifestyle, save 10%',
   '{"saldo": -10000, "savings": 3000, "happiness": 15, "relationships": 10, "health": 5}'::jsonb,
   'Enjoying life is important, but be careful not to sacrifice your future for present pleasures.');
END $$;

-- Scenario 3: Health - Gym Membership (Age 25-45)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your friend invites you to join a gym. The membership costs 200 PLN/month. You''ve been feeling sluggish lately and know exercise would help.',
  25, 45, 'Health', 'sandbox',
  ARRAY['health', 'finance', 'lifestyle']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Join the gym - invest in health',
   '{"saldo": -2400, "health": 20, "happiness": 10, "relationships": 5}'::jsonb,
   'Health is wealth! Regular exercise reduces future medical costs and improves quality of life significantly.'),
  
  (scenario_id, 'Exercise for free outdoors',
   '{"saldo": 0, "health": 10, "happiness": 5}'::jsonb,
   'Free exercise is great! While gyms offer more variety, outdoor exercise is effective and budget-friendly.'),
  
  (scenario_id, 'Skip it - save the money',
   '{"saldo": 2400, "savings": 2400, "health": -5}'::jsonb,
   'Be careful - health issues later in life can be far more expensive than preventive measures now.');
END $$;

-- Scenario 4: Relationships - Social Life (Age 25-35)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your friends are going out every weekend - dinners, parties, trips. It''s expensive but fun. You''re worried about your budget but also don''t want to miss out.',
  25, 35, 'Relationships', 'sandbox',
  ARRAY['relationships', 'finance', 'happiness']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Join all activities - YOLO!',
   '{"saldo": -8000, "happiness": 20, "relationships": 20, "savings": -8000}'::jsonb,
   'Social connections are valuable, but overspending on entertainment can harm long-term financial health.'),
  
  (scenario_id, 'Choose selectively - balance budget and fun',
   '{"saldo": -3000, "happiness": 10, "relationships": 10, "savings": -3000}'::jsonb,
   'Perfect balance! Maintaining relationships while managing finances wisely is key to long-term happiness.'),
  
  (scenario_id, 'Decline most invitations - focus on saving',
   '{"saldo": 5000, "savings": 5000, "happiness": -10, "relationships": -15}'::jsonb,
   'While saving is important, relationships are crucial for well-being. Don''t become isolated for money.');
END $$;

-- Scenario 5: Housing - Rent or Buy Decision (Age 28-40)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags, min_education)
VALUES (
  'You''re tired of renting. You could take a 30-year mortgage and buy your own apartment, or continue renting and invest the difference. The mortgage would be 3000 PLN/month, rent is 2000 PLN/month.',
  28, 40, 'Housing', 'sandbox',
  ARRAY['housing', 'finance', 'investment'],
  NULL
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Buy with mortgage - own your home',
   '{"saldo": -36000, "happiness": 15, "risk_level": 10, "private_investments": -36000}'::jsonb,
   'Homeownership builds equity over time, but ties up capital and limits flexibility. Good if you''re settled.'),
  
  (scenario_id, 'Continue renting - invest the difference',
   '{"saldo": -24000, "private_investments": 12000, "happiness": -5, "risk_level": 5}'::jsonb,
   'Renting and investing offers flexibility and potentially higher returns, but no property ownership.'),
  
  (scenario_id, 'Move back with parents - save aggressively',
   '{"saldo": 24000, "savings": 24000, "happiness": -20, "relationships": -10}'::jsonb,
   'Maximum savings strategy, but significant lifestyle impact. Consider if independence is worth the cost.');
END $$;

-- Scenario 6: Career - Job Change Opportunity (Age 30-45)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'A recruiter offers you a position at a new company with 30% higher salary, but it''s less stable - a startup with great potential but risk. Your current job is secure but routine.',
  30, 45, 'Work', 'sandbox',
  ARRAY['career', 'finance', 'risk']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Take the startup job - risk for reward',
   '{"saldo": 40000, "happiness": 15, "risk_level": 20, "stress": 15}'::jsonb,
   'Higher risk, higher reward. Startups can pay off big, but job security is lower. Good if you can afford risk.'),
  
  (scenario_id, 'Stay in current job - stability first',
   '{"saldo": 30000, "happiness": -5, "risk_level": -5, "stress": -10}'::jsonb,
   'Stability is valuable, especially if you have financial obligations. But don''t let fear prevent growth.'),
  
  (scenario_id, 'Negotiate raise at current company',
   '{"saldo": 35000, "happiness": 5, "relationships": 5, "risk_level": 0}'::jsonb,
   'Smart negotiation! Using external offers as leverage can improve your situation without jumping ship.');
END $$;

-- Scenario 7: Health - Medical Checkup (Age 35-50)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags, min_health)
VALUES (
  'Your doctor recommends annual health screenings and preventive tests. They''re not covered by basic insurance and will cost 1500 PLN/year. You feel fine though.',
  35, 50, 'Health', 'sandbox',
  ARRAY['health', 'finance', 'prevention'],
  NULL
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Get full checkups - prevention is key',
   '{"saldo": -1500, "health": 10, "risk_level": -10, "peace_of_mind": 15}'::jsonb,
   'Excellent decision! Early detection saves lives and money. Preventive care is the best healthcare investment.'),
  
  (scenario_id, 'Basic checkup only - save some money',
   '{"saldo": -500, "health": 3, "risk_level": 0}'::jsonb,
   'Reasonable compromise. Some prevention is better than none, though comprehensive screening is ideal.'),
  
  (scenario_id, 'Skip it - you feel healthy',
   '{"saldo": 1500, "savings": 1500, "health": 0, "risk_level": 15}'::jsonb,
   'Risky choice. Many serious conditions have no symptoms until advanced. Don''t gamble with your health.');
END $$;

-- Scenario 8: Family - Having Children (Age 28-40)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You and your partner are considering having a child. Children bring joy but also significant expenses - around 2000 PLN/month for basics, plus education costs later.',
  28, 40, 'Relationships', 'sandbox',
  ARRAY['family', 'finance', 'relationships', 'life_choice']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Have a child now - family first',
   '{"saldo": -24000, "happiness": 25, "relationships": 20, "risk_level": 10, "stress": 15}'::jsonb,
   'Children are life-changing. Financially challenging but emotionally rewarding. Plan for increased expenses.'),
  
  (scenario_id, 'Wait a few years - build more savings first',
   '{"saldo": 20000, "savings": 20000, "happiness": -5, "relationships": -5}'::jsonb,
   'Smart financial planning! More savings provides security, but don''t wait too long - biology has limits.'),
  
  (scenario_id, 'Focus on career and freedom',
   '{"saldo": 40000, "private_investments": 20000, "happiness": 10, "relationships": -10}'::jsonb,
   'Valid choice! Not everyone wants children. More resources for other goals and relationships.');
END $$;

-- Scenario 9: Insurance - Life and Health Insurance (Age 30-50)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'An insurance agent presents comprehensive life and health insurance plans. They''ll cost 500 PLN/month but provide significant coverage for major health events and family protection.',
  30, 50, 'Finance', 'sandbox',
  ARRAY['insurance', 'finance', 'risk_management']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Get comprehensive coverage',
   '{"saldo": -6000, "risk_level": -20, "happiness": 5, "peace_of_mind": 20}'::jsonb,
   'Good protection! Insurance is about managing catastrophic risk. The cost is worth the peace of mind.'),
  
  (scenario_id, 'Basic coverage only',
   '{"saldo": -2400, "risk_level": -5, "peace_of_mind": 10}'::jsonb,
   'Reasonable middle ground. Some protection is better than none, but gaps in coverage exist.'),
  
  (scenario_id, 'No extra insurance - self-insure through savings',
   '{"saldo": 6000, "savings": 6000, "risk_level": 20}'::jsonb,
   'Risky strategy. Unless you have substantial emergency funds, unexpected events could devastate finances.');
END $$;

-- Scenario 10: Education - Professional Development (Age 30-50)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'A professional certification course relevant to your field costs 15,000 PLN and takes 6 months. It could boost your career prospects and earning potential significantly.',
  30, 50, 'Education', 'sandbox',
  ARRAY['education', 'career', 'investment']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Take the course - invest in skills',
   '{"saldo": -15000, "happiness": 10, "future_income_boost": 20000, "career_prospects": 20}'::jsonb,
   'Lifelong learning pays dividends! Professional development keeps you competitive and can significantly boost income.'),
  
  (scenario_id, 'Learn through free online resources',
   '{"saldo": 0, "happiness": 5, "career_prospects": 5}'::jsonb,
   'Self-learning is valuable! While certifications add credibility, knowledge is what truly matters.'),
  
  (scenario_id, 'Focus on current job - skip the course',
   '{"saldo": 15000, "savings": 15000, "career_prospects": -5, "stagnation_risk": 10}'::jsonb,
   'Be careful of complacency. Markets change, and skills can become obsolete. Keep learning.');
END $$;

-- Scenario 11: Retirement Planning - ZUS vs Private (Age 35-50)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You''re reviewing your retirement strategy. You can increase ZUS contributions (guaranteed but lower returns), invest in private retirement fund (higher potential but more risk), or split between both.',
  35, 50, 'Finance', 'sandbox',
  ARRAY['retirement', 'investment', 'zus']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Maximize ZUS contributions - safety first',
   '{"saldo": -20000, "zus_contributions": 20000, "zus_account": 22000, "risk_level": -10}'::jsonb,
   'ZUS provides stability but historically lower returns. Good for risk-averse, but diversification is wise.'),
  
  (scenario_id, 'Split 50/50 between ZUS and private',
   '{"saldo": -20000, "zus_contributions": 10000, "zus_account": 11000, "private_investments": 11000, "risk_level": 5}'::jsonb,
   'Excellent diversification! Balance security and growth potential. The recommended approach for most people.'),
  
  (scenario_id, 'Maximize private investments - growth focus',
   '{"saldo": -20000, "private_investments": 24000, "risk_level": 15, "potential_returns": 30}'::jsonb,
   'Aggressive strategy. Higher potential returns but also higher risk. Only if you can handle volatility.');
END $$;

-- Scenario 12: Lifestyle - Car Purchase (Age 25-45)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your old car broke down. You could buy a new car (200,000 PLN loan), a used car (50,000 PLN), or rely on public transport and car-sharing services.',
  25, 45, 'Finance', 'sandbox',
  ARRAY['lifestyle', 'finance', 'transportation']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Buy new car with loan',
   '{"saldo": -40000, "happiness": 15, "risk_level": 15, "debt": 160000, "stress": 10}'::jsonb,
   'New car is nice but expensive. High depreciation and interest costs. Consider if prestige is worth the price.'),
  
  (scenario_id, 'Buy used car cash',
   '{"saldo": -50000, "savings": -50000, "happiness": 10, "risk_level": 5}'::jsonb,
   'Smart financial choice! Used cars offer good value. Avoid debt while maintaining mobility.'),
  
  (scenario_id, 'Use public transport and car-sharing',
   '{"saldo": 30000, "savings": 30000, "happiness": -5, "health": 5, "stress": -5}'::jsonb,
   'Most economical! Cars cost more than people think. Public transport and sharing can be liberating.');
END $$;

-- Scenario 13: Health Crisis - Unexpected Medical Event (Age 40-60)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You''ve been diagnosed with a health condition that requires treatment. Public healthcare has a 6-month wait. Private treatment costs 30,000 PLN but you can start immediately.',
  40, 60, 'Health', 'sandbox',
  ARRAY['health', 'finance', 'crisis']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Pay for private treatment immediately',
   '{"saldo": -30000, "savings": -30000, "health": 20, "happiness": 10, "stress": -15}'::jsonb,
   'Health comes first! Early treatment prevents complications. This is why emergency funds are crucial.'),
  
  (scenario_id, 'Wait for public healthcare',
   '{"saldo": 0, "health": -10, "happiness": -10, "stress": 20, "condition_worsening": 15}'::jsonb,
   'Risky decision. Some conditions worsen with delays. Don''t gamble with your health to save money.'),
  
  (scenario_id, 'Negotiate payment plan with private clinic',
   '{"saldo": -10000, "health": 15, "happiness": 5, "stress": 0, "debt": 20000}'::jsonb,
   'Good compromise! Many clinics offer payment plans. Get treatment while managing financial impact.');
END $$;

-- Scenario 14: Career - Side Business Opportunity (Age 30-50)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You have an idea for a side business. It would require 40,000 PLN initial investment and 20 hours/week. Success could double your income, but it might fail too.',
  30, 50, 'Work', 'sandbox',
  ARRAY['business', 'risk', 'career', 'investment']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Start the business - take the risk',
   '{"saldo": -40000, "happiness": 20, "risk_level": 30, "stress": 25, "potential_income": 50000}'::jsonb,
   'Entrepreneurship is exciting but risky. Ensure you can afford to lose the investment and handle extra work.'),
  
  (scenario_id, 'Test with minimal investment first',
   '{"saldo": -5000, "happiness": 10, "risk_level": 10, "stress": 10, "validation_learning": 15}'::jsonb,
   'Smart! Test your idea with minimal investment. Many businesses fail due to rushing in without validation.'),
  
  (scenario_id, 'Skip it - focus on main career',
   '{"saldo": 40000, "private_investments": 20000, "happiness": -10, "stress": -15, "potential_missed": 20}'::jsonb,
   'Safe choice, but you''ll never know what could have been. Sometimes the biggest risk is not taking one.');
END $$;

-- Scenario 15: Relationships - Elderly Parents Care (Age 40-60)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your parents are getting older and need assistance. You could: hire professional care (5000 PLN/month), take care of them yourself (reduce work hours), or help them move to assisted living (8000 PLN/month).',
  40, 60, 'Relationships', 'sandbox',
  ARRAY['family', 'care', 'finance', 'relationships']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Hire professional home care',
   '{"saldo": -60000, "happiness": -10, "relationships": 10, "stress": -5, "career_maintained": true}'::jsonb,
   'Balanced solution. Parents get care, you maintain career. Expensive but preserves quality of life for all.'),
  
  (scenario_id, 'Reduce work to care personally',
   '{"saldo": -30000, "happiness": 5, "relationships": 25, "stress": 15, "career_impact": -20}'::jsonb,
   'Noble choice! Strong family bonds but significant career and financial impact. Ensure long-term sustainability.'),
  
  (scenario_id, 'Quality assisted living facility',
   '{"saldo": -96000, "happiness": -5, "relationships": 5, "stress": -10, "guilt": 10}'::jsonb,
   'Professional care can be excellent. Don''t feel guilty - good facilities provide better medical care than family can.');
END $$;

-- Scenario 16: Housing - Renovation Investment (Age 35-55)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your apartment needs renovation. Basic repairs cost 30,000 PLN. Full modern renovation costs 100,000 PLN but increases property value by 150,000 PLN. Or you could sell as-is.',
  35, 55, 'Housing', 'sandbox',
  ARRAY['housing', 'investment', 'property']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Full renovation - maximize value',
   '{"saldo": -100000, "savings": -100000, "property_value": 150000, "happiness": 20, "stress": 15}'::jsonb,
   'Good investment if selling or if you''ll enjoy the improvements. Calculate if the increased value justifies cost.'),
  
  (scenario_id, 'Basic repairs only - functional approach',
   '{"saldo": -30000, "property_value": 20000, "happiness": 5, "stress": 5}'::jsonb,
   'Practical choice! Essential repairs maintain value without overspending. Good if not selling soon.'),
  
  (scenario_id, 'Sell as-is - avoid renovation hassle',
   '{"saldo": 400000, "savings": 200000, "private_investments": 200000, "happiness": -15, "stress": 20}'::jsonb,
   'Valid if you''re moving anyway. But unrenovated properties sell for less and take longer to sell.');
END $$;

-- Scenario 17: Work - Burnout Risk (Age 35-55)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags, min_health)
VALUES (
  'You''re feeling burned out from work. Your health is suffering, relationships strained. You could take unpaid leave (lose 3 months salary), reduce hours, or push through.',
  35, 55, 'Health', 'sandbox',
  ARRAY['health', 'work', 'mental_health', 'balance'],
  NULL
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Take 3-month sabbatical',
   '{"saldo": -45000, "health": 30, "happiness": 25, "relationships": 20, "stress": -40, "career_reset": true}'::jsonb,
   'Excellent choice! Burnout recovery takes time. Investing in mental health prevents catastrophic breakdown.'),
  
  (scenario_id, 'Reduce to part-time work',
   '{"saldo": -20000, "health": 15, "happiness": 15, "relationships": 10, "stress": -20}'::jsonb,
   'Good compromise! Maintain some income while recovering. Part-time can be long-term solution too.'),
  
  (scenario_id, 'Push through - tough it out',
   '{"saldo": 0, "health": -20, "happiness": -25, "relationships": -15, "stress": 30, "burnout_risk": 40}'::jsonb,
   'Dangerous! Severe burnout can lead to chronic health issues and forced unemployment. Don''t ignore warning signs.');
END $$;

-- Scenario 18: Investment - Market Crash (Age 35-60)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'The stock market has crashed by 40%. Your private investments have dropped significantly. Do you panic sell to stop losses, hold through the downturn, or buy more at low prices?',
  35, 60, 'Finance', 'sandbox',
  ARRAY['investment', 'crisis', 'risk', 'strategy']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Panic sell - cut losses',
   '{"private_investments": -40, "saldo": 30000, "stress": 20, "future_regret": 50}'::jsonb,
   'Classic mistake! Selling low locks in losses. Markets historically recover. Only sell if you need the money.'),
  
  (scenario_id, 'Hold steady - wait for recovery',
   '{"private_investments": 0, "stress": 15, "emotional_resilience": 20}'::jsonb,
   'Smart! Market downturns are temporary. Historical data shows patience is usually rewarded.'),
  
  (scenario_id, 'Buy more - dollar cost averaging',
   '{"saldo": -30000, "savings": -30000, "private_investments": 60, "stress": 5, "future_wealth": 50}'::jsonb,
   'Brilliant! Buying low is how wealth is built. Only if you have emergency funds and can wait for recovery.');
END $$;

-- Scenario 19: Retirement Planning - Early Retirement Option (Age 50-60)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your company offers early retirement package. You''d get 250,000 PLN buyout but reduced pension. You''re 55. You could retire now, work 5 more years, or decline and work to 67.',
  50, 60, 'Work', 'sandbox',
  ARRAY['retirement', 'finance', 'life_choice', 'career']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Take early retirement - enjoy life now',
   '{"saldo": 250000, "savings": 150000, "private_investments": 100000, "happiness": 30, "reduced_pension": -20, "stress": -30}'::jsonb,
   'Life is short! If financially secure, early retirement lets you enjoy health while you have it. Calculate carefully.'),
  
  (scenario_id, 'Work 5 more years to 60',
   '{"saldo": 300000, "zus_contributions": 100000, "happiness": 0, "stress": 10, "health": -5}'::jsonb,
   'Balanced approach. More financial security, better pension, but five more working years. Good if you like your job.'),
  
  (scenario_id, 'Work full term to 67',
   '{"saldo": 700000, "zus_account": 150000, "happiness": -20, "stress": 20, "health": -15, "max_pension": true}'::jsonb,
   'Maximum financial security but 12 more working years. Are you sacrificing your best years for money you may not enjoy?');
END $$;

-- Scenario 20: Health - Preventive Surgery (Age 50-65)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Genetic tests show high risk for a serious condition. Preventive surgery could reduce risk by 90% but costs 80,000 PLN and has 6-month recovery. Or you could monitor annually.',
  50, 65, 'Health', 'sandbox',
  ARRAY['health', 'prevention', 'risk', 'medical']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Get preventive surgery',
   '{"saldo": -80000, "savings": -80000, "health": 20, "risk_level": -40, "stress": 20, "longevity": 15}'::jsonb,
   'Proactive health management! If risk is high, prevention is worth it. Discuss thoroughly with doctors.'),
  
  (scenario_id, 'Regular monitoring - watch and wait',
   '{"saldo": -5000, "health": 5, "risk_level": 20, "stress": 25, "vigilance": 20}'::jsonb,
   'Reasonable if risk is moderate. But requires discipline for regular checkups. Don''t skip appointments!'),
  
  (scenario_id, 'Do nothing - hope for the best',
   '{"saldo": 5000, "savings": 5000, "health": 0, "risk_level": 45, "stress": 40, "future_regret_risk": 60}'::jsonb,
   'Very risky! You''re gambling with your life. Treatment after diagnosis is harder and more expensive.');
END $$;

-- Scenario 21: Family - Financial Help for Adult Children (Age 55-70)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'Your adult child wants to buy their first apartment and needs help with down payment (100,000 PLN). You have the money but it''s part of your retirement fund.',
  55, 70, 'Relationships', 'sandbox',
  ARRAY['family', 'finance', 'relationships', 'generational']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Give full amount as gift',
   '{"saldo": -100000, "savings": -100000, "happiness": 10, "relationships": 30, "retirement_impact": -20}'::jsonb,
   'Generous but risky! Ensure your own retirement security first. You can''t help anyone if you''re struggling.'),
  
  (scenario_id, 'Loan with formal repayment terms',
   '{"saldo": -100000, "savings": -100000, "relationships": 10, "stress": 10, "loan_receivable": 100000}'::jsonb,
   'Protects your finances while helping. But family loans can strain relationships. Have clear written agreement.'),
  
  (scenario_id, 'Partial help - 30,000 PLN',
   '{"saldo": -30000, "savings": -30000, "happiness": 5, "relationships": 15, "retirement_security": 5}'::jsonb,
   'Balanced approach! Help without jeopardizing retirement. They can manage the rest with their own mortgage.'),
  
  (scenario_id, 'Decline - they need to manage independently',
   '{"saldo": 0, "happiness": -10, "relationships": -20, "retirement_security": 10, "tough_love": true}'::jsonb,
   'Sometimes saying no is right. Adult children need to build their own financial independence.');
END $$;

-- Scenario 22: Retirement - Pension Strategy (Age 60-67)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You can claim pension at 60 (reduced by 30%), wait until 65 (reduced by 10%), or work until 67 (full pension). Each year of work adds to the pension amount.',
  60, 67, 'Finance', 'sandbox',
  ARRAY['retirement', 'pension', 'planning', 'zus']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Retire at 60 - early but reduced',
   '{"saldo": 0, "monthly_pension": 2000, "happiness": 25, "health": 10, "stress": -30, "lifetime_total": -200000}'::jsonb,
   'More years of retirement but less money. Good if health is priority and you''ve saved well.'),
  
  (scenario_id, 'Retire at 65 - balanced approach',
   '{"saldo": 300000, "monthly_pension": 2800, "happiness": 10, "health": 0, "stress": -10, "lifetime_total": -50000}'::jsonb,
   'Good compromise! Higher pension with earlier retirement than 67. Most popular choice.'),
  
  (scenario_id, 'Work until 67 - maximum pension',
   '{"saldo": 600000, "monthly_pension": 3200, "happiness": -10, "health": -10, "stress": 10, "lifetime_total": 0}'::jsonb,
   'Maximum financial security. But two more working years. Break-even is around 75-80 years old.');
END $$;

-- Scenario 23: Lifestyle - Retirement Travel Plans (Age 60-75)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You''ve always dreamed of traveling in retirement. A world tour would cost 150,000 PLN. You could do it now while healthy, take smaller trips, or save the money for care later.',
  60, 75, 'Happiness', 'sandbox',
  ARRAY['retirement', 'lifestyle', 'happiness', 'travel']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Take the world tour - YOLO',
   '{"saldo": -150000, "savings": -150000, "happiness": 40, "relationships": 15, "health": 10, "memories": 50}'::jsonb,
   'Life is about experiences! You can''t take money with you. If affordable, travel while you''re able.'),
  
  (scenario_id, 'Multiple smaller trips over years',
   '{"saldo": -60000, "savings": -60000, "happiness": 30, "relationships": 10, "health": 5, "spread_enjoyment": true}'::jsonb,
   'Wise! Spread joy over time. Less strain on budget and health. Plus, anticipation is part of the pleasure.'),
  
  (scenario_id, 'Save for potential care needs',
   '{"saldo": 150000, "savings": 150000, "happiness": -20, "stress": 15, "future_security": 20}'::jsonb,
   'Prudent but sad to miss experiences. Consider: will you regret not traveling when you can''t anymore?');
END $$;

-- Scenario 24: Legacy - Estate Planning (Age 65-80)
INSERT INTO scenarios (story_prompt, min_age, max_age, area, mode, tags)
VALUES (
  'You''re thinking about your legacy. You could: leave everything to children (800,000 PLN estate), donate 50% to charity, or spend it all on quality of life improvements.',
  65, 80, 'Relationships', 'sandbox',
  ARRAY['legacy', 'family', 'charity', 'life_purpose']
);

DO $$
DECLARE
  scenario_id bigint;
BEGIN
  SELECT id INTO scenario_id FROM scenarios ORDER BY id DESC LIMIT 1;
  
  INSERT INTO scenario_options (scenario_id, option_text, effects, ai_coach_comment)
  VALUES 
  (scenario_id, 'Leave full estate to family',
   '{"saldo": 0, "happiness": 10, "relationships": 30, "family_future": 50, "legacy_impact": 20}'::jsonb,
   'Traditional choice. Helps family but consider: are you giving them money or robbing them of building their own success?'),
  
  (scenario_id, 'Split 50% family, 50% charity',
   '{"saldo": -400000, "happiness": 20, "relationships": 15, "legacy_impact": 40, "social_impact": 50}'::jsonb,
   'Balanced legacy! Help family while making broader impact. Charity can be very fulfilling.'),
  
  (scenario_id, 'Use for quality of life - enjoy it yourself',
   '{"saldo": -800000, "happiness": 35, "health": 20, "relationships": 10, "quality_care": 50, "memories": 40}'::jsonb,
   'Your money, your life! You earned it. Family will be fine. Invest in your comfort and joy in final years.');
END $$;

-- Note: This seed file includes 24 diverse scenarios covering all major life stages and decision areas.
-- Each scenario has multiple meaningful options with different effects on player stats.
-- AI coach comments provide educational insights about financial planning and life decisions.
