import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import PlayerStats from "@/components/game/PlayerStats";
import ScenarioCard from "@/components/game/ScenarioCard";
import CoachComment from "@/components/game/CoachComment";
import { applyEffects, calculateAgeIncrement, isGameOver } from "@/lib/gameUtils";
import { ArrowRight, BarChart3 } from "lucide-react";

const Game = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<any>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [coachComment, setCoachComment] = useState<string | null>(null);
  const [tempoProfile, setTempoProfile] = useState<string>("realistic");
  const [tempoCustomConfig, setTempoCustomConfig] = useState<any>(null);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get active game
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (gameError) throw gameError;

      if (!game) {
        toast({
          title: "No active game",
          description: "Please start a new game",
        });
        navigate("/");
        return;
      }

      setGameId(game.id);
      setTempoProfile(game.tempo_profile || "realistic");
      setTempoCustomConfig(game.tempo_custom_config);

      // Get latest player state
      const { data: state, error: stateError } = await supabase
        .from("player_states")
        .select("*")
        .eq("game_id", game.id)
        .order("turn_number", { ascending: false })
        .limit(1)
        .single();

      if (stateError) throw stateError;

      setCurrentState(state);

      // Check if game is over
      if (isGameOver(state.age)) {
        await supabase
          .from("games")
          .update({ status: "finished", finished_at: new Date().toISOString() })
          .eq("id", game.id);
        
        navigate("/summary");
        return;
      }

      // Load scenario
      await loadScenario(state);
    } catch (error: any) {
      console.error("Error loading game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadScenario = async (state: any) => {
    try {
      // Fetch scenarios that match the player's current state
      let query = supabase
        .from("scenarios")
        .select(`
          *,
          scenario_options (*)
        `)
        .eq("mode", "sandbox")
        .or(`min_age.is.null,min_age.lte.${state.age}`)
        .or(`max_age.is.null,max_age.gte.${state.age}`);

      if (state.education) {
        query = query.or(`min_education.is.null,min_education.eq.${state.education}`);
      }

      const { data: scenarios, error } = await query;

      if (error) throw error;

      if (!scenarios || scenarios.length === 0) {
        toast({
          title: "No scenarios available",
          description: "Proceeding to summary",
        });
        navigate("/summary");
        return;
      }

      // Select a random scenario
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setScenario(randomScenario);
      setOptions(randomScenario.scenario_options || []);
    } catch (error: any) {
      console.error("Error loading scenario:", error);
      toast({
        title: "Error",
        description: "Failed to load scenario",
        variant: "destructive",
      });
    }
  };

  const handleSelectOption = async (optionId: number) => {
    if (!currentState || !gameId) return;

    setProcessing(true);
    try {
      const option = options.find((o) => o.id === optionId);
      if (!option) return;

      setSelectedOption(option);
      setCoachComment(option.ai_coach_comment);

      // Save player choice
      await supabase.from("player_choices").insert({
        game_id: gameId,
        user_id: currentState.user_id || (await supabase.auth.getUser()).data.user?.id,
        turn_number: currentState.turn_number,
        scenario_id: scenario.id,
        option_id: optionId,
        effects: option.effects,
      });
    } catch (error: any) {
      console.error("Error saving choice:", error);
      toast({
        title: "Error",
        description: "Failed to save choice",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleNextTurn = async () => {
    if (!currentState || !gameId || !selectedOption) return;

    setProcessing(true);
    try {
      // Calculate new state
      const ageIncrement = calculateAgeIncrement(tempoProfile, currentState.age, tempoCustomConfig);
      const newAge = currentState.age + ageIncrement;
      
      const newState = {
        ...applyEffects(currentState, selectedOption.effects || {}),
        age: newAge,
        turn_number: currentState.turn_number + 1,
      };

      // Insert new player state
      const { error: insertError } = await supabase
        .from("player_states")
        .insert({
          game_id: gameId,
          turn_number: newState.turn_number,
          age: newState.age,
          education: newState.education,
          health: newState.health,
          happiness: newState.happiness,
          relationships: newState.relationships,
          saldo: newState.saldo,
          zus_account: newState.zus_account,
          zus_contributions: newState.zus_contributions,
          zus_type: newState.zus_type,
          private_investments: newState.private_investments,
          savings: newState.savings,
          insurance_status: newState.insurance_status,
          risk_level: newState.risk_level,
        });

      if (insertError) throw insertError;

      // Reset for next turn
      setCurrentState(newState);
      setSelectedOption(null);
      setCoachComment(null);

      // Check if game is over
      if (isGameOver(newAge)) {
        await supabase
          .from("games")
          .update({ status: "finished", finished_at: new Date().toISOString() })
          .eq("id", gameId);
        
        navigate("/summary");
        return;
      }

      // Load next scenario
      await loadScenario(newState);
    } catch (error: any) {
      console.error("Error advancing turn:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to advance turn",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  if (!currentState || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <p className="text-muted-foreground">No game data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#283754]">Your Life Journey</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlayerStats
              age={currentState.age}
              health={currentState.health}
              happiness={currentState.happiness}
              relationships={currentState.relationships}
              saldo={currentState.saldo}
              savings={currentState.savings}
              zus_account={currentState.zus_account}
              private_investments={currentState.private_investments}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <ScenarioCard
              scenario={scenario}
              options={options}
              onSelectOption={handleSelectOption}
              disabled={!!selectedOption || processing}
            />

            {coachComment && (
              <CoachComment comment={coachComment} />
            )}

            {selectedOption && (
              <div className="flex justify-end">
                <Button
                  onClick={handleNextTurn}
                  disabled={processing}
                  size="lg"
                  className="bg-[#007834] hover:bg-[#006329] gap-2"
                >
                  {processing ? "Processing..." : "Next Turn"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
