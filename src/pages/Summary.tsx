import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Trophy, TrendingUp, Heart, Smile, Users, Wallet, Home } from "lucide-react";

const Summary = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<any>(null);
  const [finalState, setFinalState] = useState<any>(null);
  const [totalTurns, setTotalTurns] = useState(0);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get most recent finished or active game
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (gameError) throw gameError;

      if (!game) {
        navigate("/");
        return;
      }

      setGameData(game);

      // Get final player state
      const { data: state, error: stateError } = await supabase
        .from("player_states")
        .select("*")
        .eq("game_id", game.id)
        .order("turn_number", { ascending: false })
        .limit(1)
        .single();

      if (stateError) throw stateError;

      setFinalState(state);
      setTotalTurns(state.turn_number);
    } catch (error: any) {
      console.error("Error loading summary:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('summary.load_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewGame = () => {
    navigate("/");
  };

  const calculateScore = () => {
    if (!finalState) return 0;
    // Simple scoring: average of key metrics
    const metrics = [
      finalState.health,
      finalState.happiness,
      finalState.relationships,
    ];
    const avgWellbeing = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    
    // Financial score (normalized)
    const totalWealth = finalState.saldo + finalState.savings + finalState.zus_account + finalState.private_investments;
    const financialScore = Math.min(100, (totalWealth / 1000000) * 100); // Scale to 100
    
    return Math.round((avgWellbeing + financialScore) / 2);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: t('summary.outstanding'), color: "bg-[#007834]" };
    if (score >= 75) return { label: t('summary.excellent'), color: "bg-green-600" };
    if (score >= 60) return { label: t('summary.good'), color: "bg-blue-600" };
    if (score >= 45) return { label: t('summary.fair'), color: "bg-yellow-600" };
    return { label: t('summary.needs_improvement'), color: "bg-red-600" };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!finalState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('summary.no_data')}</CardTitle>
            <CardDescription>{t('summary.start_new_game')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartNewGame} className="w-full bg-[#007834] hover:bg-[#006329]">
              {t('summary.start_new_game')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const score = calculateScore();
  const scoreInfo = getScoreLabel(score);
  const totalWealth = finalState.saldo + finalState.savings + finalState.zus_account + finalState.private_investments;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <Trophy className="h-16 w-16 text-[#007834] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#283754] mb-2">{t('summary.title')}</h1>
          <p className="text-muted-foreground">{t('summary.completed')}</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('summary.score')}</CardTitle>
            <div className="mt-4">
              <div className="text-6xl font-bold text-[#283754] mb-2">{score}</div>
              <Badge className={`${scoreInfo.color} text-white text-lg px-4 py-1`}>
                {scoreInfo.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Life Stats */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#007834]" />
                {t('summary.life_stats')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('summary.final_age')}</span>
                <span className="text-xl font-bold text-[#283754]">{finalState.age}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('summary.total_turns')}</span>
                <span className="text-xl font-bold text-[#283754]">{totalTurns}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('summary.education')}</span>
                <span className="text-sm font-medium capitalize">{finalState.education?.replace('_', ' ')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-[#007834]" />
                {t('summary.financial')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('summary.total_wealth')}</span>
                <span className="text-lg font-bold text-[#007834]">{formatCurrency(totalWealth)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('game.balance')}</span>
                <span className="font-medium">{formatCurrency(finalState.saldo)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('game.savings')}</span>
                <span className="font-medium">{formatCurrency(finalState.savings)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('game.zus_account')}</span>
                <span className="font-medium">{formatCurrency(finalState.zus_account)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('game.investments')}</span>
                <span className="font-medium">{formatCurrency(finalState.private_investments)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wellbeing Metrics */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>{t('summary.wellbeing')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#283754]">{finalState.health}%</div>
                <div className="text-sm text-muted-foreground">{t('game.health')}</div>
              </div>
              <div>
                <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#283754]">{finalState.happiness}%</div>
                <div className="text-sm text-muted-foreground">{t('game.happiness')}</div>
              </div>
              <div>
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#283754]">{finalState.relationships}%</div>
                <div className="text-sm text-muted-foreground">{t('game.relationships')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            {t('summary.view_dashboard')}
          </Button>
          <Button
            onClick={handleStartNewGame}
            size="lg"
            className="flex-1 bg-[#007834] hover:bg-[#006329] gap-2"
          >
            <Home className="h-4 w-4" />
            {t('summary.start_new_journey')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
