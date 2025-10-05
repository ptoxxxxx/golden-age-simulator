import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TempoProfileSelector from "@/components/onboarding/TempoProfileSelector";
import { INITIAL_PLAYER_STATE } from "@/lib/gameUtils";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const GameNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mode");

  // Step 1: Game mode
  const [gameMode, setGameMode] = useState("sandbox");

  // Step 2: Game settings
  const [tempoProfile, setTempoProfile] = useState("realistic");

  // Step 3: Initial state
  const [initialState, setInitialState] = useState(INITIAL_PLAYER_STATE);

  useEffect(() => {
    loadPreferredState();
  }, []);

  const loadPreferredState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("preferred_initial_state")
        .eq("id", user.id)
        .maybeSingle();

      if (userData?.preferred_initial_state && typeof userData.preferred_initial_state === 'object') {
        setInitialState({ ...INITIAL_PLAYER_STATE, ...(userData.preferred_initial_state as Record<string, any>) });
      }
    } catch (error) {
      console.error("Error loading preferred state:", error);
    }
  };

  const handleStateChange = (field: string, value: string | number) => {
    setInitialState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: t("auth.authentication_required"),
          description: t("auth.sign_in_to_play"),
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Save preferred state for future games
      await supabase
        .from("users")
        .update({ preferred_initial_state: initialState })
        .eq("id", user.id);

      // Create new game
      const { data: game, error: gameError } = await supabase
        .from("games")
        .insert({
          user_id: user.id,
          mode: "sandbox",
          tempo_profile: tempoProfile,
          status: "active",
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Create initial player state
      const { error: stateError } = await supabase
        .from("player_states")
        .insert({
          game_id: game.id,
          turn_number: 0,
          ...initialState,
        });

      if (stateError) throw stateError;

      toast({
        title: t("game_new.game_created"),
        description: t("game_new.game_started"),
      });

      navigate(`/game?gameId=${game.id}`);
    } catch (error: any) {
      console.error("Error creating game:", error);
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t("game_new.title")}</CardTitle>
          <CardDescription>{t("game_new.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mode">{t("game_new.step_mode")}</TabsTrigger>
              <TabsTrigger value="settings">{t("game_new.step_settings")}</TabsTrigger>
              <TabsTrigger value="initial">{t("game_new.step_initial")}</TabsTrigger>
            </TabsList>

            <TabsContent value="mode" className="space-y-4">
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <Label>{t("game_new.game_mode_label")}</Label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setGameMode("sandbox")}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        gameMode === "sandbox"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">{t("game_new.mode_sandbox")}</div>
                      <div className="text-sm text-muted-foreground">{t("game_new.mode_sandbox_desc")}</div>
                    </button>
                    <div className="w-full p-4 rounded-lg border-2 border-border bg-muted/30 text-left opacity-60 cursor-not-allowed">
                      <div className="font-semibold">{t("game_new.mode_challenges")}</div>
                      <div className="text-sm text-muted-foreground">{t("game_new.mode_coming_soon")}</div>
                    </div>
                    <div className="w-full p-4 rounded-lg border-2 border-border bg-muted/30 text-left opacity-60 cursor-not-allowed">
                      <div className="font-semibold">{t("game_new.mode_educational")}</div>
                      <div className="text-sm text-muted-foreground">{t("game_new.mode_coming_soon")}</div>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setActiveTab("settings")} className="w-full">
                  {t("game_new.next_step")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4 py-4">
                <TempoProfileSelector value={tempoProfile} onChange={setTempoProfile} />
                <Button onClick={() => setActiveTab("initial")} className="w-full">
                  {t("game_new.next_step")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="initial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t("game.age")}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={initialState.age}
                    onChange={(e) => handleStateChange("age", parseInt(e.target.value))}
                    min={18}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">{t("game.education")}</Label>
                  <select
                    id="education"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={initialState.education}
                    onChange={(e) => handleStateChange("education", e.target.value)}
                  >
                    <option value="high_school">{t("game.education_high_school")}</option>
                    <option value="bachelors">{t("game.education_bachelors")}</option>
                    <option value="masters">{t("game.education_masters")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health">{t("game.health")} (%)</Label>
                  <Input
                    id="health"
                    type="number"
                    value={initialState.health}
                    onChange={(e) => handleStateChange("health", parseInt(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="happiness">{t("game.happiness")} (%)</Label>
                  <Input
                    id="happiness"
                    type="number"
                    value={initialState.happiness}
                    onChange={(e) => handleStateChange("happiness", parseInt(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationships">{t("game.relationships")} (%)</Label>
                  <Input
                    id="relationships"
                    type="number"
                    value={initialState.relationships}
                    onChange={(e) => handleStateChange("relationships", parseInt(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saldo">{t("game.saldo")} (PLN)</Label>
                  <Input
                    id="saldo"
                    type="number"
                    value={initialState.saldo}
                    onChange={(e) => handleStateChange("saldo", parseInt(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setActiveTab("settings")} variant="outline" className="w-full">
                  {t("game_new.back")}
                </Button>
                <Button onClick={handleCreateGame} disabled={loading} className="w-full">
                  {loading ? t("game_new.creating") : t("game_new.start_game")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameNew;
