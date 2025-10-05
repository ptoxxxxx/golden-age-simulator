import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AvatarCard from "@/components/game/AvatarCard";
import LifeStatsCard from "@/components/game/LifeStatsCard";
import FinancialStatsCard from "@/components/game/FinancialStatsCard";
import ScenarioCard from "@/components/game/ScenarioCard";
import CoachComment from "@/components/game/CoachComment";
import AdvisoryPopup from "@/components/game/AdvisoryPopup";
import LifeProgressBar from "@/components/game/LifeProgressBar";
import { applyEffects, calculateAgeIncrement, isGameOver } from "@/lib/gameUtils";
import { ArrowRight, BarChart3 } from "lucide-react";

const Game = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<any>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [confirmedOption, setConfirmedOption] = useState<any>(null);
  const [coachComment, setCoachComment] = useState<string | null>(null);
  const [coachDialogOpen, setCoachDialogOpen] = useState(false);
  const [advisoryEffects, setAdvisoryEffects] = useState<Record<string, number>>({});
  const [advisoryDialogOpen, setAdvisoryDialogOpen] = useState(false);
  const [tempoProfile, setTempoProfile] = useState<string>("realistic");
  const [tempoCustomConfig, setTempoCustomConfig] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showCoachComments, setShowCoachComments] = useState<boolean>(true);

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

      // Check for gameId from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const urlGameId = urlParams.get("gameId");

      let game;
      if (urlGameId) {
        // Load specific game from URL
        const { data: specificGame, error: gameError } = await supabase
          .from("games")
          .select("*")
          .eq("id", urlGameId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (gameError) throw gameError;
        game = specificGame;
      } else {
        // Get last active game
        const { data: activeGame, error: gameError } = await supabase
          .from("games")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (gameError) throw gameError;
        game = activeGame;
      }

      if (!game) {
        toast({
          title: t('game.no_active_game'),
          description: t('game.start_new_game'),
        });
        navigate("/game-hub");
        return;
      }

      setGameId(game.id);
      setTempoProfile(game.tempo_profile || "realistic");
      setTempoCustomConfig(game.tempo_custom_config);

      // Get user profile with avatar
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile);
      }

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
          title: t('game.no_scenarios'),
          description: t('game.proceeding_summary'),
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
        title: t('common.error'),
        description: t('game.load_scenario_error'),
        variant: "destructive",
      });
    }
  };

  const handleSelectOption = (optionId: number) => {
    setSelectedOptionId(optionId);
  };

  const handleAdvisoryClick = (optionId: number, effects: Record<string, number>) => {
    setAdvisoryEffects(effects);
    setAdvisoryDialogOpen(true);
  };

  const handleConfirmOption = async () => {
    if (!currentState || !gameId || !selectedOptionId) return;

    setProcessing(true);
    try {
      const option = options.find((o) => o.id === selectedOptionId);
      if (!option) return;

      setConfirmedOption(option);
      
      // Use Polish comment if language is Polish and Polish comment exists
      const displayComment = i18n.language === 'pl' && option.ai_coach_comment_pl 
        ? option.ai_coach_comment_pl 
        : option.ai_coach_comment;
      setCoachComment(displayComment);
      
      // Show coach dialog only if enabled
      if (showCoachComments) {
        setCoachDialogOpen(true);
      }

      // Save player choice
      await supabase.from("player_choices").insert({
        game_id: gameId,
        user_id: currentState.user_id || (await supabase.auth.getUser()).data.user?.id,
        turn_number: currentState.turn_number,
        scenario_id: scenario.id,
        option_id: selectedOptionId,
        effects: option.effects,
      });

      // Immediately advance to next turn
      await advanceToNextTurn(option);
    } catch (error: any) {
      console.error("Error saving choice:", error);
      toast({
        title: t('common.error'),
        description: t('game.save_choice_error'),
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const handleRetirementAgeChange = async (newAge: number) => {
    if (!currentState || !gameId) return;

    try {
      // Update current state in database
      const { error } = await supabase
        .from("player_states")
        .update({ planned_retirement_age: newAge })
        .eq("game_id", gameId)
        .eq("turn_number", currentState.turn_number);

      if (error) throw error;

      // Update local state
      setCurrentState({ ...currentState, planned_retirement_age: newAge });
    } catch (error: any) {
      console.error("Error updating retirement age:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const advanceToNextTurn = async (option: any) => {
    if (!currentState || !gameId) return;

    try {
      // Calculate new state
      const ageIncrement = calculateAgeIncrement(tempoProfile, currentState.age, tempoCustomConfig);
      const newAge = currentState.age + ageIncrement;
      
      const newState = {
        ...applyEffects(currentState, option.effects || {}),
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
          salary: newState.salary || 0,
          planned_retirement_age: newState.planned_retirement_age || 67,
          estimated_pension: newState.estimated_pension || 0,
        });

      if (insertError) throw insertError;

      // Reset for next turn
      setCurrentState(newState);
      setSelectedOptionId(null);
      setConfirmedOption(null);
      setCoachComment(null);
      setCoachDialogOpen(false);

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
        title: t('common.error'),
        description: error.message || t('game.advance_turn_error'),
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!currentState || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <p className="text-muted-foreground">{t('game.no_data')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="container mx-auto px-4">
        {/* Top row: Avatar, Life Stats, Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AvatarCard
            avatarUrl={userProfile?.avatar_url}
            nickname={userProfile?.nickname}
            age={currentState.age}
            health={currentState.health}
            happiness={currentState.happiness}
            userId={userProfile?.id}
          />
          <LifeStatsCard
            health={currentState.health}
            happiness={currentState.happiness}
            relationships={currentState.relationships}
          />
          <FinancialStatsCard
            salary={currentState.salary || 0}
            zus_contributions={currentState.zus_contributions || 0}
            saldo={currentState.saldo}
            savings={currentState.savings}
            private_investments={currentState.private_investments}
            planned_retirement_age={currentState.planned_retirement_age || 67}
            estimated_pension={currentState.estimated_pension || 0}
            onRetirementAgeChange={handleRetirementAgeChange}
          />
        </div>

        {/* Life Progress Bar */}
        <div className="mb-6">
          <LifeProgressBar age={currentState.age} />
        </div>

        {/* Middle: Scenario Card */}
        <div className="mb-6">
          <ScenarioCard
            scenario={scenario}
            options={options}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
            onConfirmOption={handleConfirmOption}
            onAdvisoryClick={handleAdvisoryClick}
            disabled={!!confirmedOption || processing}
            language={i18n.language}
            showCoachComments={showCoachComments}
            onToggleCoachComments={setShowCoachComments}
          />
        </div>

        {/* Advisory Popup (before choice) */}
        <AdvisoryPopup
          effects={advisoryEffects}
          open={advisoryDialogOpen}
          onOpenChange={setAdvisoryDialogOpen}
        />

        {/* Coach Comment Dialog (after choice) */}
        {coachComment && showCoachComments && (
          <CoachComment 
            comment={coachComment} 
            open={coachDialogOpen}
            onOpenChange={setCoachDialogOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
