import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

interface Game {
  id: string;
  created_at: string;
  status: string;
  mode: string;
  tempo_profile: string;
  player_state?: {
    age: number;
    health: number;
    career: number;
    saldo: number;
  };
}

const GameHub = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: gamesData, error } = await supabase
        .from("games")
        .select(`
          id,
          created_at,
          status,
          mode,
          tempo_profile
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch latest player state for each game
      const gamesWithState = await Promise.all(
        (gamesData || []).map(async (game) => {
          const { data: stateData } = await supabase
            .from("player_states")
            .select("age, health, career, saldo")
            .eq("game_id", game.id)
            .order("turn_number", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...game,
            player_state: stateData || undefined,
          };
        })
      );

      setGames(gamesWithState);
    } catch (error: any) {
      console.error("Error loading games:", error);
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueGame = (gameId: string) => {
    navigate(`/game?gameId=${gameId}`);
  };

  const handleViewSummary = (gameId: string) => {
    navigate(`/summary?gameId=${gameId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("game_hub.title")}</h1>
            <p className="text-muted-foreground">{t("game_hub.description")}</p>
          </div>
          <Button
            onClick={() => navigate("/game/new")}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            {t("game_hub.new_game")}
          </Button>
        </div>

        <div className="grid gap-4">
          {games.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">{t("game_hub.no_games")}</p>
                <Button onClick={() => navigate("/game/new")}>
                  {t("game_hub.start_first_game")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            games.map((game) => (
              <Card key={game.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {t(`game_hub.mode_${game.mode}`)} - {t(`game_hub.tempo_${game.tempo_profile}`)}
                      </CardTitle>
                      <CardDescription>
                        {new Date(game.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        game.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t(`game_hub.status_${game.status}`)}
                    </span>
                  </div>
                </CardHeader>
                {game.player_state && (
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm">
                        <span>{t("game.age")}: {game.player_state.age}</span>
                        <span>{t("game.health")}: {game.player_state.health}%</span>
                        <span>{t("game.career")}: {game.player_state.career}%</span>
                        <span>{t("game.saldo")}: {game.player_state.saldo} PLN</span>
                      </div>
                      <div className="flex gap-2">
                        {game.status === "active" ? (
                          <Button
                            onClick={() => handleContinueGame(game.id)}
                            size="sm"
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" />
                            {t("game_hub.continue")}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleViewSummary(game.id)}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Trophy className="h-4 w-4" />
                            {t("game_hub.view_summary")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHub;
