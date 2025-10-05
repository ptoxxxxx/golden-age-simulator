-- Add Polish translations for all scenarios and options

-- Update scenario areas to Polish
UPDATE scenarios SET area_pl = 'Edukacja' WHERE area = 'Education';
UPDATE scenarios SET area_pl = 'Kariera' WHERE area = 'Career';
UPDATE scenarios SET area_pl = 'Finanse' WHERE area = 'Finance';
UPDATE scenarios SET area_pl = 'Emerytura' WHERE area = 'Retirement';
UPDATE scenarios SET area_pl = 'Zdrowie' WHERE area = 'Health';
UPDATE scenarios SET area_pl = 'Relacje' WHERE area = 'Relationships';
UPDATE scenarios SET area_pl = 'Styl życia' WHERE area = 'Lifestyle';
UPDATE scenarios SET area_pl = 'Mieszkanie' WHERE area = 'Housing';
UPDATE scenarios SET area_pl = 'Inwestycje' WHERE area = 'Investment';

-- Update scenario story prompts to Polish
UPDATE scenarios SET story_prompt_pl = 'Właśnie ukończyłeś szkołę średnią. Przed Tobą ważna decyzja - co dalej?' WHERE id = 1;
UPDATE scenarios SET story_prompt_pl = 'Skończyłeś studia i masz oferty pracy. Co wybierzesz?' WHERE id = 2;
UPDATE scenarios SET story_prompt_pl = 'Zacząłeś zarabiać pierwsze pieniądze. Jak je wykorzystasz?' WHERE id = 3;
UPDATE scenarios SET story_prompt_pl = 'Twój pracodawca oferuje podwyżkę, ale musisz zmienić stanowisko. Decydujesz się...' WHERE id = 4;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad zabezpieczeniem emerytalnym. Jak podejdziesz do tego tematu?' WHERE id = 5;
UPDATE scenarios SET story_prompt_pl = 'Czujesz się ostatnio gorzej. Co zrobisz?' WHERE id = 6;
UPDATE scenarios SET story_prompt_pl = 'Rozważasz zmianę pracy. Jaka będzie Twoja decyzja?' WHERE id = 7;
UPDATE scenarios SET story_prompt_pl = 'Masz dodatkowe pieniądze - jak je wykorzystasz?' WHERE id = 8;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad kupnem mieszkania. Co wybierzesz?' WHERE id = 9;
UPDATE scenarios SET story_prompt_pl = 'Twoja firma oferuje szkolenie zawodowe. Jak zareagujesz?' WHERE id = 10;
UPDATE scenarios SET story_prompt_pl = 'Rodzina potrzebuje wsparcia finansowego. Co zrobisz?' WHERE id = 11;
UPDATE scenarios SET story_prompt_pl = 'Bliscy czują się zaniedbani z powodu Twojej pracy. Jak to rozwiążesz?' WHERE id = 12;
UPDATE scenarios SET story_prompt_pl = 'Przeszedłeś na emeryturę. Jak spędzisz czas?' WHERE id = 13;
UPDATE scenarios SET story_prompt_pl = 'Masz możliwość zainwestowania oszczędności. Jaki będzie Twój wybór?' WHERE id = 14;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad ubezpieczeniem na życie. Co zdecydujesz?' WHERE id = 15;
UPDATE scenarios SET story_prompt_pl = 'Ktoś z rodziny zachorował. Jak to wpłynie na Twoją sytuację?' WHERE id = 16;
UPDATE scenarios SET story_prompt_pl = 'Masz wybór między stabilnością a wyższymi zarobkami. Co wybierzesz?' WHERE id = 17;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad dietą i aktywnością fizyczną. Jak się zdecydujesz?' WHERE id = 18;
UPDATE scenarios SET story_prompt_pl = 'Wybierasz nowe miejsce zamieszkania. Co będzie priorytetem?' WHERE id = 19;
UPDATE scenarios SET story_prompt_pl = 'Na emeryturze planujesz podróże. Jak do tego podejdziesz?' WHERE id = 20;
UPDATE scenarios SET story_prompt_pl = 'Rozważasz sporządzenie testamentu. Co zrobisz?' WHERE id = 21;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad swoim rozwojem osobistym. Jak zainwestujesz w siebie?' WHERE id = 22;
UPDATE scenarios SET story_prompt_pl = 'Twoje zdrowie wymaga regularnych badań. Co zrobisz?' WHERE id = 23;
UPDATE scenarios SET story_prompt_pl = 'Zastanawiasz się nad poziomem ryzyka w inwestycjach. Jak je rozłożysz?' WHERE id = 24;

-- Update option texts to Polish
UPDATE scenario_options SET option_text_pl = 'Idziesz na studia.' WHERE option_text = 'Go to university.';
UPDATE scenario_options SET option_text_pl = 'Zaczynasz pracować od razu.' WHERE option_text = 'Start working immediately.';
UPDATE scenario_options SET option_text_pl = 'Bierzesz rok przerwy (gap year).' WHERE option_text = 'Take a gap year.';

UPDATE scenario_options SET option_text_pl = 'Przyjmujesz stabilną pracę korporacyjną.' WHERE option_text = 'Accept a stable corporate job.';
UPDATE scenario_options SET option_text_pl = 'Zakładasz własną firmę (start-up).' WHERE option_text = 'Start your own business (start-up).';
UPDATE scenario_options SET option_text_pl = 'Podróżujesz i pracujesz zdalnie.' WHERE option_text = 'Travel and work remotely.';

UPDATE scenario_options SET option_text_pl = 'Oszczędzasz w banku.' WHERE option_text = 'Save in a bank.';
UPDATE scenario_options SET option_text_pl = 'Inwestujesz w akcje/fundusze.' WHERE option_text = 'Invest in stocks/funds.';
UPDATE scenario_options SET option_text_pl = 'Wydajesz na rozrywkę i gadżety.' WHERE option_text = 'Spend on entertainment and gadgets.';

UPDATE scenario_options SET option_text_pl = 'Odkładasz 10% pensji na przyszłość.' WHERE option_text = 'Save 10% of your salary for the future.';
UPDATE scenario_options SET option_text_pl = 'Bierzesz kredyt na mieszkanie.' WHERE option_text = 'Take a mortgage.';
UPDATE scenario_options SET option_text_pl = 'Dajesz sobie podwyżkę jako bonus.' WHERE option_text = 'Give yourself a raise as a bonus.';

UPDATE scenario_options SET option_text_pl = 'Wpłacasz do ZUS (obowiązkowe).' WHERE option_text = 'Contribute to ZUS (mandatory).';
UPDATE scenario_options SET option_text_pl = 'Zapisujesz się do PPK (Pracownicze Plany Kapitałowe).' WHERE option_text = 'Join PPK (Employee Capital Plans).';
UPDATE scenario_options SET option_text_pl = 'Oszczędzasz prywatnie (np. IKE, IKZE).' WHERE option_text = 'Save privately (e.g., IKE, IKZE).';

UPDATE scenario_options SET option_text_pl = 'Wykupujesz prywatne ubezpieczenie zdrowotne.' WHERE option_text = 'Get private health insurance.';
UPDATE scenario_options SET option_text_pl = 'Zaczynasz regularnie ćwiczyć i jeść zdrowiej.' WHERE option_text = 'Start exercising regularly and eating healthier.';
UPDATE scenario_options SET option_text_pl = 'Oszczędzasz i korzystasz tylko z publicznej służby zdrowia.' WHERE option_text = 'Save money and use only public healthcare.';

UPDATE scenario_options SET option_text_pl = 'Zostajesz w obecnej firmie.' WHERE option_text = 'Stay at your current company.';
UPDATE scenario_options SET option_text_pl = 'Zmieniasz pracę na lepiej płatną.' WHERE option_text = 'Switch to a better-paying job.';
UPDATE scenario_options SET option_text_pl = 'Podejmujesz dodatkową pracę (freelancing).' WHERE option_text = 'Take on additional work (freelancing).';

UPDATE scenario_options SET option_text_pl = 'Inwestujesz w zdrowy styl życia.' WHERE option_text = 'Invest in a healthy lifestyle.';
UPDATE scenario_options SET option_text_pl = 'Pozwalasz sobie na przyjemności.' WHERE option_text = 'Allow yourself some pleasures.';
UPDATE scenario_options SET option_text_pl = 'Odkładasz na czarną godzinę.' WHERE option_text = 'Save for a rainy day.';

UPDATE scenario_options SET option_text_pl = 'Kupujesz mieszkanie (kredyt/gotówka).' WHERE option_text = 'Buy an apartment (mortgage/cash).';
UPDATE scenario_options SET option_text_pl = 'Wynajmujesz mieszkanie.' WHERE option_text = 'Rent an apartment.';
UPDATE scenario_options SET option_text_pl = 'Mieszkasz z rodziną.' WHERE option_text = 'Live with family.';

UPDATE scenario_options SET option_text_pl = 'Inwestujesz w dalsze kształcenie.' WHERE option_text = 'Invest in further education.';
UPDATE scenario_options SET option_text_pl = 'Skupiasz się na obecnej pracy.' WHERE option_text = 'Focus on your current job.';
UPDATE scenario_options SET option_text_pl = 'Poświęcasz czas na hobby i relaks.' WHERE option_text = 'Dedicate time to hobbies and relaxation.';

UPDATE scenario_options SET option_text_pl = 'Zachowujesz rezerwę finansową (fundusz awaryjny).' WHERE option_text = 'Maintain a financial reserve (emergency fund).';
UPDATE scenario_options SET option_text_pl = 'Inwestujesz większość oszczędności.' WHERE option_text = 'Invest most of your savings.';
UPDATE scenario_options SET option_text_pl = 'Pomagasz finansowo rodzinie.' WHERE option_text = 'Help your family financially.';

UPDATE scenario_options SET option_text_pl = 'Poświęcasz więcej czasu rodzinie i przyjaciołom.' WHERE option_text = 'Spend more time with family and friends.';
UPDATE scenario_options SET option_text_pl = 'Skupiasz się na karierze.' WHERE option_text = 'Focus on your career.';
UPDATE scenario_options SET option_text_pl = 'Znajdujesz balans między pracą a życiem prywatnym.' WHERE option_text = 'Find a balance between work and personal life.';

UPDATE scenario_options SET option_text_pl = 'Cieszysz się emeryturą bez pracy.' WHERE option_text = 'Enjoy retirement without working.';
UPDATE scenario_options SET option_text_pl = 'Pracujesz w niepełnym wymiarze.' WHERE option_text = 'Work part-time.';
UPDATE scenario_options SET option_text_pl = 'Angażujesz się społecznie (wolontariat, etc.).' WHERE option_text = 'Get involved socially (volunteering, etc.).';

UPDATE scenario_options SET option_text_pl = 'Inwestujesz w fundusze indeksowe (niskie ryzyko).' WHERE option_text = 'Invest in index funds (low risk).';
UPDATE scenario_options SET option_text_pl = 'Trzymasz pieniądze w bezpiecznych obligacjach.' WHERE option_text = 'Keep money in safe bonds.';
UPDATE scenario_options SET option_text_pl = 'Inwestujesz agresywnie (akcje, kryptowaluty).' WHERE option_text = 'Invest aggressively (stocks, cryptocurrencies).';

UPDATE scenario_options SET option_text_pl = 'Wykupujesz ubezpieczenie na życie.' WHERE option_text = 'Get life insurance.';
UPDATE scenario_options SET option_text_pl = 'Prowadzisz minimalistyczny styl życia.' WHERE option_text = 'Lead a minimalist lifestyle.';
UPDATE scenario_options SET option_text_pl = 'Pozwalasz sobie na luksus.' WHERE option_text = 'Allow yourself luxury.';

UPDATE scenario_options SET option_text_pl = 'Jesteś dyplomatyczny/a i szukasz kompromisu.' WHERE option_text = 'Be diplomatic and seek compromise.';
UPDATE scenario_options SET option_text_pl = 'Stanowczo bronisz swojego zdania.' WHERE option_text = 'Firmly defend your opinion.';
UPDATE scenario_options SET option_text_pl = 'Pozostajesz neutralny/a.' WHERE option_text = 'Remain neutral.';

UPDATE scenario_options SET option_text_pl = 'Unikasz używek i dbasz o zdrowie.' WHERE option_text = 'Avoid addictions and take care of your health.';
UPDATE scenario_options SET option_text_pl = 'Pozwalasz sobie na przyjemności w umiarkowanych ilościach.' WHERE option_text = 'Allow yourself pleasures in moderation.';
UPDATE scenario_options SET option_text_pl = 'Żyjesz pełnią życia bez ograniczeń.' WHERE option_text = 'Live life to the fullest without limits.';

UPDATE scenario_options SET option_text_pl = 'Regularnie wykonujesz badania profilaktyczne.' WHERE option_text = 'Regularly undergo preventive check-ups.';
UPDATE scenario_options SET option_text_pl = 'Leczysz się tylko gdy zachorujesz.' WHERE option_text = 'Get treated only when you get sick.';
UPDATE scenario_options SET option_text_pl = 'Ufasz naturalnym metodom leczenia.' WHERE option_text = 'Trust natural healing methods.';

UPDATE scenario_options SET option_text_pl = 'Wybierasz bezpieczne, niskie ryzyko.' WHERE option_text = 'Choose safe, low risk.';
UPDATE scenario_options SET option_text_pl = 'Balans - średnie ryzyko, średnie zyski.' WHERE option_text = 'Balance - medium risk, medium returns.';
UPDATE scenario_options SET option_text_pl = 'Wysokie ryzyko, wysokie potencjalne zyski.' WHERE option_text = 'High risk, high potential returns.';

UPDATE scenario_options SET option_text_pl = 'Zachowujesz obecne mieszkanie.' WHERE option_text = 'Keep your current apartment.';
UPDATE scenario_options SET option_text_pl = 'Przenosisz się do rodziny.' WHERE option_text = 'Move in with family.';
UPDATE scenario_options SET option_text_pl = 'Przenosisz się do domu opieki.' WHERE option_text = 'Move to a nursing home.';

UPDATE scenario_options SET option_text_pl = 'Podróżujesz po świecie.' WHERE option_text = 'Travel the world.';
UPDATE scenario_options SET option_text_pl = 'Wypoczywasz w domu.' WHERE option_text = 'Rest at home.';
UPDATE scenario_options SET option_text_pl = 'Angażujesz się w działalność społeczną.' WHERE option_text = 'Get involved in social activities.';

UPDATE scenario_options SET option_text_pl = 'Sporządzasz testament.' WHERE option_text = 'Make a will.';
UPDATE scenario_options SET option_text_pl = 'Przekazujesz majątek za życia.' WHERE option_text = 'Transfer assets during your lifetime.';
UPDATE scenario_options SET option_text_pl = 'Wydajesz swoje oszczędności na życie.' WHERE option_text = 'Spend your savings on living.';

UPDATE scenario_options SET option_text_pl = 'Inwestujesz w kursy i rozwój osobisty.' WHERE option_text = 'Invest in courses and personal development.';
UPDATE scenario_options SET option_text_pl = 'Oszczędzasz na przyszłość.' WHERE option_text = 'Save for the future.';
UPDATE scenario_options SET option_text_pl = 'Koncentrujesz się na codziennym szczęściu.' WHERE option_text = 'Focus on daily happiness.';

UPDATE scenario_options SET option_text_pl = 'Robisz to.' WHERE option_text = 'Do it.';
UPDATE scenario_options SET option_text_pl = 'Pomiń.' WHERE option_text = 'Skip.';

UPDATE scenario_options SET option_text_pl = 'Regularnie dbasz o kondycję fizyczną.' WHERE option_text = 'Regularly take care of physical fitness.';
UPDATE scenario_options SET option_text_pl = 'Dbasz o relacje społeczne.' WHERE option_text = 'Take care of social relationships.';
UPDATE scenario_options SET option_text_pl = 'Koncentrujesz się na spokoju wewnętrznym.' WHERE option_text = 'Focus on inner peace.';