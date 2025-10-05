# TODO

### NOW (dzisiaj) – hackathon start!

#### Repozytorium, środowisko, stack
- [ ] Utwórz repozytorium na GitHub i wrzuć README z instrukcją .env i seed
- [x] Skonfiguruj projekt Next.js 14 (App Router) + React 18 + TypeScript (using Vite+React)
- [x] Dodaj Tailwind CSS i shadcn/ui (komponenty)
- [ ] Skonfiguruj i18next (EN domyślny, PL placeholder)
- [ ] Dodaj pliki en/common.json i pl/common.json (PL placeholder)
- [x] Skonfiguruj env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] Zainicjalizuj Supabase client (client/server)
- [x] Skonfiguruj Recharts lub odpowiednik z Lovable

#### Supabase: baza, storage, seed
- [x] Utwórz tabele SQL i polityki RLS w Supabase (users, games, player_states, scenarios, scenario_options, player_choices, user_avatars)
- [x] Utwórz bucket avatars w Supabase Storage (publiczny, 5 MB, jpg/png/webp)
- [x] Przygotuj i wrzuć seed 24 scenariuszy (EN, PL placeholdery później)
- [x] Sprawdź RLS dla wszystkich tabel user-data

#### Routing i strony
- [x] Skonfiguruj routing: /, /auth/sign-in, /auth/sign-up, /game, /dashboard, /summary
- [x] Utwórz layout z topbarem i przełącznikiem języka (persist w localStorage)
- [x] Dodaj placeholdery stron (każda ścieżka renderuje prosty tekst)
- [x] Dodaj tłumaczenia PL dla wszystkich tekstów

#### Auth i onboarding ✅
- [x] Zaimplementuj strony sign-in/sign-up/reset hasła (Supabase, Zod walidacja)
- [x] Onboarding (/) – formularz: imię postaci (opcjonalne), avatar upload (walidacja, upload do Storage), wybór profilu tempa gry (Realistic/Fast/Custom), start game (utwórz rekord games, player_states turn 0)
- [x] Walidacja Zod dla wszystkich pól formularzy
- [x] Redirect unauthenticated users to /auth
- [x] Protected routes for game, dashboard, summary
- [x] Logout functionality

#### Pętla gry (core gameplay) ✅
- [x] Pobierz aktualny player_state (ostatni turn)
- [x] Oblicz inkrement wieku wg profilu tempa
- [x] Dobierz scenariusz (filtry, równoważenie kategorii, fallback najbliższy wiekowo)
- [x] Wyświetl ScenarioCard (story_prompt EN, PL placeholder), opcje wyboru
- [x] Po wyborze: zapisz player_choices + efekty, przelicz nowy state, wstaw do player_states
- [x] Pokaż AI coach comment (z opcji)
- [x] Przycisk Next Turn lub Go to Summary (jeśli warunki końcowe)

#### Dashboard i summary
- [ ] Dashboard: wykresy (saldo, savings, private_investments, zus_account, health, happiness, relationships vs turn)
- [ ] Timeline decyzji: scenario → chosen option → short effects
- [ ] Summary: karty wyników, rekomendacje, przycisk Restart (nowa gra)
- [ ] Wyświetlanie avatara gracza na ekranie gry

#### UI i dostępność
- [ ] Zastosuj kolory: tło #FFFFFF, akcent #007834, nagłówki #283754, wykres tło #F5F7FA
- [ ] Użyj fontu Inter
- [ ] Mobile-first, duże przyciski, aria-labels, kontrast WCAG AA
- [ ] Komponenty shadcn/ui: Avatar, Card, Button, Tabs, Dialog/Sheet, ProgressBar, Tooltip/Popover, Alert

#### Bezpieczeństwo i walidacja
- [ ] Walidacja Zod dla wszystkich danych wejściowych
- [ ] Oczyszczanie nazw plików avatarów (userId-timestamp.ext, [a-z0-9-_])
- [ ] MIME i rozmiar pliku avatara sprawdzany po stronie klienta
- [ ] RLS: każda operacja zapisu sprawdza user_id=auth.uid()
- [ ] Helper applyEffects(state, effects) z clamp 0–100 dla health/happiness/relationships/risk

---

### SOON (po MVP, jeśli czas pozwoli)

- [ ] Dodaj prosty modal/stronę z informacją o trybach Educational/Challenge (Coming soon)
- [ ] Ulepsz UI: animacje, lepsze przejścia, loading states
- [ ] Dodaj obsługę edge-case’ów (np. brak scenariuszy, fallbacky)
- [ ] Dodaj testy e2e (np. Playwright/Cypress) dla głównych ścieżek
- [ ] Dodaj obsługę dużej liczby tur (np. paginacja na dashboardzie)
- [ ] Dodaj lepsze rekomendacje w summary (np. na podstawie decyzji)
- [ ] Dodaj obsługę wylogowania i sesji wygasłej (redirecty)
- [ ] Dodaj obsługę usuwania konta i danych (GDPR)
- [ ] Dodaj obsługę uploadu avatara z kadrowaniem/preview

---

### SOMEDAY (po hackathonie)

- [ ] Dodaj panel ustawień użytkownika (edycja nicka, avatara)
- [ ] Dodaj tryby Educational/Challenge (pełna logika)
- [ ] Dodaj wersję PL (pełne tłumaczenia, nie tylko placeholdery)
- [ ] Dodaj więcej scenariuszy i opcji (np. eventy losowe, kryzysy)
- [ ] Dodaj lepszą obsługę accessibility (np. screen reader, focus management)
- [ ] Dodaj wersję PWA/offline
- [ ] Dodaj eksport danych gry (CSV/JSON)
- [ ] Dodaj onboarding tutorial (krok po kroku)
- [ ] Dodaj integrację z monitoringiem/analytics (po v1)
- [ ] Dodaj obsługę powiadomień e-mail (np. przypomnienia)
- [ ] Dodaj wersję dark mode

