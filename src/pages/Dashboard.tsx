import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft, TrendingUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<any>(null);
  const [playerStates, setPlayerStates] = useState<any[]>([]);
  const [choices, setChoices] = useState<any[]>([]);
  const isPolish = i18n.language === 'pl';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get active or most recent game
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (gameError) throw gameError;

      if (!game) {
        toast({
          title: t('dashboard.no_game'),
          description: t('dashboard.start_new_game'),
        });
        navigate("/");
        return;
      }

      setGameData(game);

      // Get all player states
      const { data: states, error: statesError } = await supabase
        .from("player_states")
        .select("*")
        .eq("game_id", game.id)
        .order("turn_number", { ascending: true });

      if (statesError) throw statesError;
      setPlayerStates(states || []);

      // Get player choices with scenario info (including Polish translations)
      const { data: choicesData, error: choicesError } = await supabase
        .from("player_choices")
        .select(`
          *,
          scenarios (story_prompt, story_prompt_pl, area, area_pl),
          scenario_options (option_text, option_text_pl)
        `)
        .eq("game_id", game.id)
        .order("turn_number", { ascending: true });

      if (choicesError) throw choicesError;
      setChoices(choicesData || []);
    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.load_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const financialData = playerStates.map(state => ({
    turn: state.turn_number,
    age: state.age,
    balance: state.saldo,
    savings: state.savings,
    zus: state.zus_account,
    investments: state.private_investments,
  }));

  const wellbeingData = playerStates.map(state => ({
    turn: state.turn_number,
    age: state.age,
    health: state.health,
    happiness: state.happiness,
    relationships: state.relationships,
  }));

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#283754]">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.description')}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => gameData?.status === "active" ? navigate("/game") : navigate("/summary")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {gameData?.status === "active" ? t('dashboard.back_to_game') : t('dashboard.view_summary')}
          </Button>
        </div>

        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="charts">{t('dashboard.charts')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('dashboard.timeline')}</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {/* Financial Chart */}
            <Card className="animate-fade-in shadow-modern-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#007834]" />
                  {t('dashboard.financial_progress')}
                </CardTitle>
                <CardDescription>{t('dashboard.track_wealth')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: t('game.age'), position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#007834" name={t('game.balance')} />
                    <Line type="monotone" dataKey="savings" stroke="#0088FE" name={t('game.savings')} />
                    <Line type="monotone" dataKey="zus" stroke="#00C49F" name={t('game.zus_account')} />
                    <Line type="monotone" dataKey="investments" stroke="#FFBB28" name={t('game.investments')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Wellbeing Chart */}
            <Card className="animate-fade-in shadow-modern-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#007834]" />
                  {t('dashboard.wellbeing_progress')}
                </CardTitle>
                <CardDescription>{t('dashboard.track_wellbeing')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={wellbeingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: t('game.age'), position: 'insideBottom', offset: -5 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="health" stroke="#EF4444" name={t('game.health')} />
                    <Line type="monotone" dataKey="happiness" stroke="#F59E0B" name={t('game.happiness')} />
                    <Line type="monotone" dataKey="relationships" stroke="#3B82F6" name={t('game.relationships')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card className="animate-fade-in shadow-modern-md">
              <CardHeader>
                <CardTitle>{t('dashboard.decision_timeline')}</CardTitle>
                <CardDescription>{t('dashboard.review_choices')}</CardDescription>
              </CardHeader>
              <CardContent>
                {choices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t('dashboard.no_decisions')}</p>
                ) : (
                  <div className="space-y-4">
                    {choices.map((choice, index) => {
                      const displayArea = isPolish && choice.scenarios?.area_pl 
                        ? choice.scenarios.area_pl 
                        : choice.scenarios?.area;
                      const displayPrompt = isPolish && choice.scenarios?.story_prompt_pl 
                        ? choice.scenarios.story_prompt_pl 
                        : choice.scenarios?.story_prompt;
                      const displayOption = isPolish && choice.scenario_options?.option_text_pl 
                        ? choice.scenario_options.option_text_pl 
                        : choice.scenario_options?.option_text;

                      return (
                        <div
                          key={choice.id}
                          className="border-l-4 border-primary pl-4 py-3 hover:bg-accent/50 transition-smooth rounded-r-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-sm font-medium text-foreground">
                                {t('game.turn_label')} {choice.turn_number}
                              </span>
                              {displayArea && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  • {displayArea}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {displayPrompt}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            → {displayOption}
                          </p>
                          {choice.effects && Object.keys(choice.effects).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(choice.effects).map(([key, value]: [string, any]) => (
                                <span
                                  key={key}
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    value > 0 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'bg-destructive/10 text-destructive'
                                  }`}
                                >
                                  {t(`game.${key}`, key)}: {value > 0 ? '+' : ''}{value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;