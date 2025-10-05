-- Add Polish translation columns to scenarios table
ALTER TABLE scenarios 
ADD COLUMN story_prompt_pl TEXT,
ADD COLUMN area_pl TEXT;

-- Add Polish translation column to scenario_options table
ALTER TABLE scenario_options
ADD COLUMN option_text_pl TEXT,
ADD COLUMN ai_coach_comment_pl TEXT;

-- Update scenarios with Polish translations
UPDATE scenarios SET 
  story_prompt_pl = 'Twój wujek oferuje dobrze płatną pracę na czarno. Co zrobisz?',
  area_pl = 'Praca'
WHERE id = 1;

UPDATE scenarios SET 
  story_prompt_pl = 'Pracodawca proponuje B2B zamiast umowy o pracę.',
  area_pl = 'Praca'
WHERE id = 2;

UPDATE scenarios SET 
  story_prompt_pl = 'Siłownia ze znajomymi czy płatne nadgodziny?',
  area_pl = 'Zdrowie'
WHERE id = 3;

UPDATE scenarios SET 
  story_prompt_pl = 'Dostałeś się na wymarzone studia za granicą.',
  area_pl = 'Edukacja'
WHERE id = 4;

UPDATE scenarios SET 
  story_prompt_pl = 'Twój partner chce dziecko, ty nie jesteś pewien.',
  area_pl = 'Rodzina'
WHERE id = 5;

-- Update scenario_options with Polish translations
UPDATE scenario_options SET option_text_pl = 'Weź to dla szybkiej gotówki' WHERE id = 1;
UPDATE scenario_options SET option_text_pl = 'Odmów i znajdź legalną pracę' WHERE id = 2;
UPDATE scenario_options SET option_text_pl = 'Najpierw poproś rodzinę o pomoc' WHERE id = 3;
UPDATE scenario_options SET option_text_pl = 'Zaakceptuj B2B dla wyższej pensji netto' WHERE id = 4;
UPDATE scenario_options SET option_text_pl = 'Poproś o pełne zatrudnienie' WHERE id = 5;
UPDATE scenario_options SET option_text_pl = 'Weź nadgodziny' WHERE id = 6;
UPDATE scenario_options SET option_text_pl = 'Idź na siłownię' WHERE id = 7;
UPDATE scenario_options SET option_text_pl = 'Przeprowadź się i zainwestuj w edukację' WHERE id = 8;
UPDATE scenario_options SET option_text_pl = 'Zostań i zacznij pracować' WHERE id = 9;
UPDATE scenario_options SET option_text_pl = 'Miej dziecko' WHERE id = 10;