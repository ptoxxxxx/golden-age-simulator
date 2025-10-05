import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvatarUpload from "@/components/onboarding/AvatarUpload";
import TempoProfileSelector from "@/components/onboarding/TempoProfileSelector";
import { INITIAL_PLAYER_STATE, sanitizeFilename } from "@/lib/gameUtils";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [tempoProfile, setTempoProfile] = useState("realistic");

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validationResult = await import("@/lib/onboardingSchemas").then(m => 
        m.onboardingSchema.safeParseAsync({
          nickname,
          tempoProfile,
          avatar,
        })
      );

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: t('common.validation_error'),
          description: firstError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t('auth.authentication_required'),
          description: t('auth.sign_in_to_play'),
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Get existing profile to avoid overwriting data
      const { data: existingProfile } = await supabase
        .from("users")
        .select("avatar_url, nickname")
        .eq("id", user.id)
        .maybeSingle();

      // Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatar) {
        const filename = sanitizeFilename(user.id, avatar.name);
        const filePath = `${user.id}/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        
        avatarUrl = publicUrl;

        // Generate avatar variations in background
        toast({
          title: t('onboarding.generating_avatars'),
          description: t('onboarding.avatars_processing'),
        });

        // Call edge function to generate variations (don't wait for it)
        supabase.functions.invoke('generate-avatar-variations', {
          body: {
            avatarUrl: publicUrl,
            userAge: INITIAL_PLAYER_STATE.age,
            userId: user.id
          }
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error generating avatar variations:', error);
          } else {
            console.log('Generated avatar variations:', data);
          }
        });
      }

      // Create or update user profile (preserve existing data)
      const { error: profileError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          nickname: nickname || existingProfile?.nickname || null,
          avatar_url: avatarUrl || existingProfile?.avatar_url || null,
        });

      if (profileError) throw profileError;

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
          ...INITIAL_PLAYER_STATE,
        });

      if (stateError) throw stateError;

      toast({
        title: t('onboarding.game_started'),
        description: t('onboarding.welcome'),
      });

      navigate("/game");
    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('onboarding.start_game_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F7FA]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-[#283754]">{t('onboarding.welcome')}</CardTitle>
          <CardDescription>
            {t('onboarding.create_character')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStartGame} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">{t('onboarding.character_name')}</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('onboarding.character_name_placeholder')}
                maxLength={50}
              />
            </div>

            <AvatarUpload value={avatar} onChange={setAvatar} />

            <TempoProfileSelector value={tempoProfile} onChange={setTempoProfile} />

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full bg-[#007834] hover:bg-[#006329]"
                size="lg"
                disabled={loading}
              >
                {loading ? t('onboarding.starting') : t('onboarding.start_journey')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                {t('auth.sign_in_sign_up')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
