# Product Requirements Document (PRD)


Budujemy demo web app (responsive web+mobile) „Golden Age (Złoty Wiek)”: edukacyjny symulator dorosłego życia. Użytkownik gra w trybie Sandbox, podejmuje decyzje w scenariuszach i obserwuje wpływ na finanse, ZUS, zdrowie, szczęście i relacje. Język UI: EN (domyślny), PL (placeholder). Kolory: background #FFFFFF, accent green #007834, headings #283754, chart bg #F5F7FA.
Ekrany v1: Start/Onboarding, Game (główna rozgrywka: ScenarioCard + wskaźniki + coach), Dashboard (analizy), Summary (podsumowanie), Auth (Sign in/Sign up).
Tryby: tylko Sandbox w v1. Widoczny przełącznik trybów z etykietą „Coming soon” dla Educational/Challenge (bez logiki).
Brak panelu admin w v1.
Hosting: Lovable. Backend/DB/Auth/Storage: Supabase. Repo: GitHub.
Stack i biblioteki

Next.js 14 (App Router) + React 18 + TypeScript
Tailwind CSS + shadcn/ui (komponenty)
Supabase (Auth, Postgres, Storage) z RLS
Zod (walidacja), i18next (EN domyślny, PL placeholder)
Recharts (wykresy) lub odpowiednik wbudowany w Lovable
Brak analytics/monitoringu w v1
Zadanie

Utwórz kompletny projekt z routingiem, stanem i UI.
Skonfiguruj Supabase (Auth/DB/Storage) i przygotuj SQL do utworzenia tabel + RLS.
Zaimplementuj pętlę gry: wybór scenariusza zależnie od stanu, wybory użytkownika, efekty, zapis historii i aktualizacja stanu.
Dodaj profile tempa gry: Realistic, Fast, Custom (inkrement wieku/tury).
Dodaj seed 24 scenariuszy (EN, prosta treść; PL placeholdery).
Zadbaj o prostotę (demo) i minimalne, bezpieczne domyślne praktyki (Supabase Auth, RLS, walidacja danych).
Ograniczenia i wytyczne

Prosto, ale wdrażalnie: żadnych zbędnych warstw.
Brak panelu admin.
Logowanie e-mail+hasło min. 8 znaków (bez dodatkowej złożoności). Reset hasła przez e-mail (Supabase).
Brak dodatkowej analityki/monitoringu.
Avatary: upload do Supabase Storage (jpg/png/webp, max 5 MB, max 1024x1024, bezpieczne nazwy).
i18n: EN jako domyślny język; PL jako fallback/placeholder (prosty przełącznik języka).
Bezpieczeństwo (minimalne, zgodne z OWASP dla demo): walidacja danych Zod, oczyszczanie nazw plików, RLS dla wszystkich tabel user-data, brak wstrzykiwania HTML, CORS domyślny (ta sama domena), brak zewnętrznych skryptów.
GDPR: region EU (Supabase). Retencja danych gry 24 miesiące, avatary do czasu usunięcia konta.
Skala (cele, bez skomplikowanej infra): do 500 równoległych użytkowników, do 50 RPS.
Architektura aplikacji (wysokopoziomowa)

Strony:
/ (Start/Onboarding): imię postaci (opcjonalne), avatar, wybór profilu tempa gry (Realistic/Fast/Custom), ustawienia startowe (domyślne, edytowalne), przycisk Start Game.
/auth/sign-in, /auth/sign-up: e-mail+hasło, reset hasła.
/game: główna rozgrywka; ScenarioCard, opcje A/B/C, panel wskaźników (health, happiness, relationships, cash/saldo, ZUS account/contrib/type, savings, private_investments, risk_level), CoachPopover; przycisk Next Turn; dostęp do Dashboard (modal lub strona).
/dashboard: wykresy (Recharts), historia decyzji (timeline), statystyki.
/summary: końcowe podsumowanie sesji gry, rekomendacje i Restart.
Komponenty (shadcn/ui): Avatar, Card, Button, Tabs, Dialog/Sheet, ProgressBar, Tooltip/Popover (Coach), Alert.
Style: Tailwind; akcenty #007834, nagłówki #283754, tło #FFFFFF, wykres tło #F5F7FA; font Inter.
Logika gry

Profile tempa (select na Start):
Realistic: age increment per turn = 2 lata dla 20–29, 3 dla 30–49, 5 dla 50+.
Fast: age increment per turn = 5 lat.
Custom: konfiguracja progów w UI Start (minim. 1 próg + wartość).
Selektor scenariuszy:
Filtruj scenariusze po: min_age ≤ age ≤ max_age, min_education, min_health, other_conditions (JSON), tags.
Równoważ odwiedzanie kategorii: w ciągu każdych 5 tur wybierz min. 1 scenariusz z każdego z: Work/Health/Education/Family/Savings/ Risk, jeśli to możliwe.
Możliwość losowego zdarzenia kryzysowego z niskim prawdopodobieństwem (np. 5%), jeśli risk_level wysoki.
Efekty wyborów:
Każda opcja ma effects JSON: modyfikacje salda, zus_account, zus_contributions, zus_type, health, happiness, relationships, private_investments, savings, insurance_status, risk_level.
Zapisz wybór, pokaż krótkie wyjaśnienie (AI coach) i zaktualizuj panel wskaźników.
Domyślne parametry startowe (edytowalne)

age 20; health 80; happiness 70; relationships 70; saldo 2000; zus_account 0; zus_contributions 0; zus_type "none"; savings 0; private_investments 0; insurance_status "none"; risk_level 10; education "secondary" (przykład).
Supabase – SQL: Tabele i RLS Uruchom w Supabase SQL (Database) — utwórz tabele i polityki. Używaj uuid dla kluczy i powiązań z auth.users.

sql


-- users (profil rozszerzający auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  created_at timestamp with time zone default now()
);
alter table public.users enable row level security;
create policy "own profile read" on public.users for select using (auth.uid() = id);
create policy "own profile upsert" on public.users for insert with check (auth.uid() = id);
create policy "own profile update" on public.users for update using (auth.uid() = id);

-- games (sesje gry)
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  mode text check (mode in ('sandbox')),
  status text default 'active' check (status in ('active','finished')),
  tempo_profile text default 'realistic' check (tempo_profile in ('realistic','fast','custom')),
  created_at timestamp with time zone default now(),
  finished_at timestamp with time zone
);
alter table public.games enable row level security;
create policy "game owner" on public.games for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- player_states (stan w turze)
create table if not exists public.player_states (
  id bigserial primary key,
  game_id uuid references public.games(id) on delete cascade,
  turn_number int not null,
  age int not null,
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
  created_at timestamp with time zone default now()
);
alter table public.player_states enable row level security;
create policy "state by owner" on public.player_states
  for all using (exists (select 1 from public.games g where g.id = game_id and g.user_id = auth.uid()))
  with check (exists (select 1 from public.games g where g.id = game_id and g.user_id = auth.uid()));

-- scenarios (karta scenariusza)
create table if not exists public.scenarios (
  id bigserial primary key,
  area text check (area in ('Work','Health','Education','Family','Savings','Risk')),
  min_age int,
  max_age int,
  min_education text,
  min_health int,
  other_conditions jsonb,
  story_prompt text,
  mode text default 'sandbox',
  tags text[],
  created_at timestamp with time zone default now()
);
alter table public.scenarios enable row level security;
create policy "scenarios readable" on public.scenarios for select using (true);

-- scenario_options (opcje wyboru)
create table if not exists public.scenario_options (
  id bigserial primary key,
  scenario_id bigint references public.scenarios(id) on delete cascade,
  option_text text,
  effects jsonb,
  ai_coach_comment text,
  next_scenario_id bigint
);
alter table public.scenario_options enable row level security;
create policy "scenario options readable" on public.scenario_options for select using (true);

-- player_choices (historia wyborów)
create table if not exists public.player_choices (
  id bigserial primary key,
  game_id uuid references public.games(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  turn_number int not null,
  scenario_id bigint references public.scenarios(id),
  option_id bigint references public.scenario_options(id),
  effects jsonb,
  created_at timestamp with time zone default now()
);
alter table public.player_choices enable row level security;
create policy "choices by owner" on public.player_choices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_avatars (warianty avatarów)
create table if not exists public.user_avatars (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  age_group int,
  mood text,
  background text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  extra_params jsonb
);
alter table public.user_avatars enable row level security;
create policy "avatars by owner" on public.user_avatars
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
Supabase Storage

Utwórz bucket publiczny avatars z ograniczeniem rozmiaru 5 MB i dopuszczalnymi typami image/jpeg, image/png, image/webp. Nazwy plików sanitizuj: tylko [a-z0-9-_], zamieniaj spacje na myślniki.
Seed scenariuszy (24)

Wgraj do public.scenarios i public.scenario_options. Poniżej przykładowy insert JSON do przetworzenia przez skrypt seed (Node) lub ręcznie (SQL). Treści EN, proste; PL placeholdery można dodać później.
json


[
  {
    "area":"Work","min_age":20,"max_age":25,"min_education":"secondary","min_health":0,"other_conditions":{},"story_prompt":"Your uncle offers a well-paid job off the books. What do you do?","mode":"sandbox","tags":["cash","no-contract"],
    "options":[
      {"option_text":"Take it for quick cash","effects":{"saldo":1500,"zus_contributions":0,"risk_level":10},"ai_coach_comment":"More cash now, but no contributions — plan for retirement yourself."},
      {"option_text":"Say no and find legal job","effects":{"saldo":800,"zus_contributions":300,"risk_level":-5},"ai_coach_comment":"Less cash now, but safer and contributes to your pension."},
      {"option_text":"Ask family for help first","effects":{"saldo":1000,"happiness":-5},"ai_coach_comment":"Support helps, but you trade some independence."}
    ]
  },
  {
    "area":"Work","min_age":20,"max_age":30,"min_education":"secondary","min_health":0,"other_conditions":{},"story_prompt":"Employer proposes B2B instead of employment contract.","mode":"sandbox","tags":["B2B"],
    "options":[
      {"option_text":"Accept B2B for higher net pay","effects":{"saldo":1200,"zus_type":"minimal","risk_level":5},"ai_coach_comment":"Higher net today, but you must handle your own contributions."},
      {"option_text":"Ask for full employment","effects":{"saldo":700,"zus_type":"full","zus_contributions":400},"ai_coach_comment":"Lower net now, higher long-term security."}
    ]
  },
  {
    "area":"Health","min_age":25,"max_age":30,"min_education":"any","min_health":0,"other_conditions":{},"story_prompt":"Gym with friends or paid overtime?","mode":"sandbox","tags":["balance"],
    "options":[
      {"option_text":"Take overtime","effects":{"saldo":500,"health":-10,"happiness":-5,"risk_level":5},"ai_coach_comment":"More money, but your health debt grows."},
      {"option_text":"Go to the gym","effects":{"health":10,"happiness":5},"ai_coach_comment":"No extra money, but you invest in health."}
    ]
  },
  {
    "area":"Education","min_age":19,"max_age":22,"min_education":"secondary","min_health":0,"other_conditions":{},"story_prompt":"You got into dream studies abroad.","mode":"sandbox","tags":["study-abroad"],
    "options":[
      {"option_text":"Move and invest in education","effects":{"saldo":-3000,"private_investments":0,"risk_level":5},"ai_coach_comment":"Pain now, but unlocks higher pay later."},
      {"option_text":"Stay and start working","effects":{"saldo":1000},"ai_coach_comment":"Income starts sooner, but salary ceiling may be lower."}
    ]
  },
  {
    "area":"Family","min_age":30,"max_age":35,"min_education":"any","min_health":0,"other_conditions":{},"story_prompt":"Your partner wants a child, you are unsure.","mode":"sandbox","tags":["family"],
    "options":[
      {"option_text":"Have a child","effects":{"saldo":-2000,"happiness":10,"relationships":10},"ai_coach_comment":"Costs increase but so can happiness and support."},
      {"option_text":"Postpone","effects":{"saldo":1000,"happiness":-2},"ai_coach_comment":"More time for work and savings, but uncertainty grows."}
    ]
  },
  {
    "area":"Savings","min_age":28,"max_age":35,"min_education":"any","min_health":0,"other_conditions":{},"story_prompt":"Bank calls: 6% deposit vs investment fund.","mode":"sandbox","tags":["invest"],
    "options":[
      {"option_text":"Deposit (safe)","effects":{"savings":1000},"ai_coach_comment":"Slow and steady growth."},
      {"option_text":"Fund (risky)","effects":{"private_investments":1200,"risk_level":5},"ai_coach_comment":"Higher upside, but value may go down too."}
    ]
  },
  {
    "area":"Risk","min_age":20,"max_age":60,"min_education":"any","min_health":0,"other_conditions":{},"story_prompt":"Accident — you broke your leg.","mode":"sandbox","tags":["insurance"],
    "options":[
      {"option_text":"You have insurance","effects":{"saldo":0,"health":-15},"ai_coach_comment":"Insurance cushions the blow."},
      {"option_text":"No insurance","effects":{"saldo":-1500,"health":-15,"happiness":-5},"ai_coach_comment":"Emergency fund helps in such moments."}
    ]
  },

  // Dalsze 18 scenariuszy uproszczonych — zachowaj rozkład 4x w każdej kategorii
  {"area":"Work","min_age":22,"max_age":28,"min_education":"secondary","min_health":0,"other_conditions":{},"story_prompt":"Switch to a new job with lower stability but higher pay?","mode":"sandbox","tags":["career"],"options":[{"option_text":"Switch","effects":{"saldo":1000,"risk_level":5}},{"option_text":"Stay","effects":{"saldo":200,"risk_level":-2}}]},
  {"area":"Work","min_age":26,"max_age":35,"min_education":"any","min_health":0,"story_prompt":"Freelance gig after hours.","mode":"sandbox","tags":["side-hustle"],"options":[{"option_text":"Take it","effects":{"saldo":800,"happiness":-2}},{"option_text":"Decline","effects":{"happiness":2}}]},
  {"area":"Work","min_age":30,"max_age":40,"min_education":"any","min_health":0,"story_prompt":"Negotiating a raise.","mode":"sandbox","tags":["salary"],"options":[{"option_text":"Negotiate","effects":{"saldo":500}},{"option_text":"Avoid","effects":{"happiness":-1}}]},

  {"area":"Health","min_age":20,"max_age":30,"min_education":"any","min_health":0,"story_prompt":"Fast food vs home cooking.","mode":"sandbox","tags":["diet"],"options":[{"option_text":"Fast food","effects":{"saldo":-50,"health":-5}},{"option_text":"Cook at home","effects":{"saldo":-30,"health":5}}]},
  {"area":"Health","min_age":30,"max_age":50,"min_education":"any","min_health":0,"story_prompt":"Routine check-up.","mode":"sandbox","tags":["checkup"],"options":[{"option_text":"Do it","effects":{"saldo":-200,"health":5}},{"option_text":"Skip","effects":{"risk_level":5}}]},
  {"area":"Health","min_age":35,"max_age":60,"min_education":"any","min_health":0,"story_prompt":"Chronic back pain treatment.","mode":"sandbox","tags":["therapy"],"options":[{"option_text":"Physio sessions","effects":{"saldo":-600,"health":10}},{"option_text":"Ignore","effects":{"health":-10}}]},

  {"area":"Education","min_age":23,"max_age":35,"min_education":"secondary","min_health":0,"story_prompt":"Bootcamp or self-study?","mode":"sandbox","tags":["upskill"],"options":[{"option_text":"Bootcamp","effects":{"saldo":-4000,"happiness":-2}},{"option_text":"Self-study","effects":{"saldo":-500}}]},
  {"area":"Education","min_age":25,"max_age":40,"min_education":"secondary","min_health":0,"story_prompt":"Part-time master’s degree.","mode":"sandbox","tags":["masters"],"options":[{"option_text":"Enroll","effects":{"saldo":-6000}},{"option_text":"Skip","effects":{"saldo":0}}]},
  {"area":"Education","min_age":20,"max_age":28,"min_education":"secondary","min_health":0,"story_prompt":"Certificate exam fee.","mode":"sandbox","tags":["certificate"],"options":[{"option_text":"Pay and take exam","effects":{"saldo":-800}},{"option_text":"Wait","effects":{"saldo":0}}]},

  {"area":"Family","min_age":25,"max_age":40,"min_education":"any","min_health":0,"story_prompt":"Move in with partner.","mode":"sandbox","tags":["relationship"],"options":[{"option_text":"Move in","effects":{"saldo":300,"relationships":10}},{"option_text":"Stay separate","effects":{"saldo":-200,"relationships":-5}}]},
  {"area":"Family","min_age":35,"max_age":55,"min_education":"any","min_health":0,"story_prompt":"Support an elderly parent.","mode":"sandbox","tags":["care"],"options":[{"option_text":"Provide support","effects":{"saldo":-500,"relationships":10}},{"option_text":"Limited help","effects":{"relationships":-5}}]},
  {"area":"Family","min_age":28,"max_age":45,"min_education":"any","min_health":0,"story_prompt":"Adopt a pet.","mode":"sandbox","tags":["pet"],"options":[{"option_text":"Adopt","effects":{"saldo":-300,"happiness":5}},{"option_text":"Not now","effects":{"happiness":-1}}]},

  {"area":"Savings","min_age":22,"max_age":50,"min_education":"any","min_health":0,"story_prompt":"Build emergency fund.","mode":"sandbox","tags":["emergency-fund"],"options":[{"option_text":"Save monthly","effects":{"savings":500}},{"option_text":"Skip for now","effects":{"risk_level":5}}]},
  {"area":"Savings","min_age":30,"max_age":60,"min_education":"any","min_health":0,"story_prompt":"Pay off high-interest debt.","mode":"sandbox","tags":["debt"],"options":[{"option_text":"Repay aggressively","effects":{"saldo":-1000,"risk_level":-5}},{"option_text":"Minimum only","effects":{"risk_level":5}}]},
  {"area":"Savings","min_age":35,"max_age":60,"min_education":"any","min_health":0,"story_prompt":"Real estate down payment.","mode":"sandbox","tags":["real-estate"],"options":[{"option_text":"Save for down payment","effects":{"savings":2000}},{"option_text":"Rent longer","effects":{"saldo":-200}}]},

  {"area":"Risk","min_age":25,"max_age":60,"min_education":"any","min_health":0,"story_prompt":"Market downturn affects investments.","mode":"sandbox","tags":["market"],"options":[{"option_text":"Hold","effects":{"private_investments":-500}},{"option_text":"Sell in panic","effects":{"saldo":-200,"happiness":-3}}]},
  {"area":"Risk","min_age":30,"max_age":60,"min_education":"any","min_health":0,"story_prompt":"Job loss risk increases.","mode":"sandbox","tags":["job-risk"],"options":[{"option_text":"Build runway","effects":{"savings":1000,"risk_level":-5}},{"option_text":"Ignore","effects":{"risk_level":10}}]},
  {"area":"Risk","min_age":40,"max_age":65,"min_education":"any","min_health":0,"story_prompt":"Unexpected medical bill.","mode":"sandbox","tags":["bill"],"options":[{"option_text":"Use emergency fund","effects":{"savings":-800}},{"option_text":"Borrow","effects":{"saldo":-800,"happiness":-2}}]}
]
Implementacja aplikacji (zadania)

Skonfiguruj env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
Inicjalizuj Supabase client po stronie klienta i serwera (Next.js).
Auth: strony sign-in/sign-up, reset hasła (Supabase). Walidacja Zod (e-mail, hasło min. 8).
Onboarding (/): formularz z:
Imię postaci (opcjonalne, max 30 znaków)
Avatar upload (jpg/png/webp, max 5 MB, 1024x1024; zapis do Storage; adres do users.avatar_url)
Tempo gry: Realistic/Fast/Custom (dla Custom umożliw formularz z progami, np. 20–29:2, 30–49:3, 50+:5)
Start Game: utwórz rekord games, zapisz player_states turn 0 (start).
Game (/game):
Pobierz aktualny state (ostatni turn). Oblicz kolejny inkrement wieku wg profilu tempa.
Dobierz scenariusz (filtry i równoważenie kategorii). Jeśli brak pasującego, losuj najbliższy wiekowo.
Wyświetl ScenarioCard (story_prompt EN; PL placeholder), 2–3 opcje.
Po wyborze: zapisz player_choices + efekty; przelicz nowy state i wstaw do player_states.
Pokaż AI coach comment (tekst z opcji).
Przycisk Next Turn lub Go to Summary (jeśli spełnione warunki końcowe, np. age ≥ 65 lub X tur, przyjmij 10–12 tur w demo).
Dashboard (/dashboard):
Wykresy: saldo, savings, private_investments, zus_account, health, happiness, relationships vs turn.
Timeline decyzji: scenario → chosen option → short effects.
Summary (/summary):
Karty wyników (finanse, ZUS, zdrowie, szczęście, relacje), krótkie rekomendacje.
Przycisk Restart (nowa gra ze startu).
i18n

i18next: domyślnie EN. Przygotuj pliki en/common.json i pl/common.json (PL może być placeholder). Przełącznik języka w topbar (Persist w localStorage).
UI i dostępność

Mobile-first; duże przyciski wyborów; aria-labels dla przycisków i przełączników; kontrast zgodny z WCAG AA.
User Stories v1 z kryteriami akceptacji (min. 3 każde)

Jako użytkownik chcę zarejestrować się i zalogować e‑mailem/hasłem, aby móc zapisać gry i avatary.
Pozytywny: Przy poprawnych danych konto tworzy się, automatycznie loguje, przekierowanie do Start.
Negatywny: Przy błędnym haśle pokazuje się komunikat błędu bez ujawniania, czy e‑mail istnieje.
Brzegowy: Hasło krótsze niż 8 znaków jest odrzucone walidacją klienta i serwera.
Jako użytkownik chcę rozpocząć nową grę i wybrać profil tempa (Realistic/Fast/Custom), aby dopasować liczbę tur.
Pozytywny: Wybrany profil zapisuje się w games. Turn 0 stanu jest utworzony.
Negatywny: Brak wyboru profilu blokuje Start Game (disabled).
Brzegowy: Custom bez pełnych progów zgłasza walidację i nie pozwala wystartować.
Jako użytkownik chcę rozgrywać turę: przeczytać scenariusz, wybrać opcję i zobaczyć efekty oraz komentarz coacha.
Pozytywny: Po wyborze zapisuje się player_choices, tworzy się nowy player_state, a wskaźniki aktualizują się na ekranie.
Negatywny: Przy błędnym zapisie do DB pokazuje się Alert i brak utraty spójności (retry).
Brzegowy: Jeśli nie ma scenariusza w zakresie wieku, zostaje dobrany najbliższy dopuszczalny.
Jako użytkownik chcę obejrzeć dashboard z wykresami i historią decyzji.
Pozytywny: Wykresy renderują się na podstawie player_states; timeline prezentuje decyzje z player_choices.
Negatywny: Przy braku danych (nowa gra) widoczny placeholder „No history yet”.
Brzegowy: Dla dużej liczby tur (np. 50) wykresy nadal renderują się poniżej 200ms p95 na kliencie.
Jako użytkownik chcę zobaczyć podsumowanie gry i łatwo rozpocząć nową rozgrywkę.
Pozytywny: Summary pokazuje kluczowe wskaźniki i rekomendacje; przycisk Restart tworzy nową grę i przenosi do Start.
Negatywny: Gdy gra nie spełnia warunków zakończenia, przejście do Summary jest zablokowane.
Brzegowy: Jeśli użytkownik jest wylogowany, Summary wymaga ponownego logowania i po nim wraca do tego ekranu.
Niefunkcjonalne (cele)

Performance: LCP p75 < 2.5s; TTFB p75 < 0.8s; interakcje UI responsywne < 100ms p95.
Skalowanie: do 500 równoległych użytkowników i 50 RPS na endpointy Supabase.
Dostępność: klawiszowo dostępne akcje; aria-labels na kluczowych elementach.
Definicja ukończenia (DoD)

Aplikacja uruchamia się w Lovable.
Supabase: tabele, RLS, storage i seedy utworzone; można założyć konto, zalogować się i ukończyć min. 10 tur gry.
UI zgodny z kolorami i responsywny; komponenty shadcn.
Brak błędów runtime w konsoli na ścieżkach: /, /auth/sign-in, /game, /dashboard, /summary.
README z instrukcją .env i seed (opcjonalnie w repo).
Krótkie wskazówki implementacyjne dla AI (ważne)

Nie twórz panelu admin ani analytics.
Nie dodawaj zewnętrznych skryptów.
Zaimplementuj prosty helper applyEffects(state, effects) z bezpiecznym sumowaniem i clamp dla 0–100 (health/happiness/relationships/risk).
Scenariusz wybieraj deterministycznie przy równej ocenie (np. po id), aby minimalizować chaotyczność.
Waliduj wszystkie formularze Zod; nie wysyłaj pustych payloadów.
Dla upload avatarów: weryfikuj typ MIME i rozmiar po stronie klienta; nazwa pliku: userId-timestamp.ext.
RLS: w każdej operacji zapisu sprawdzaj, czy user_id=auth.uid().
