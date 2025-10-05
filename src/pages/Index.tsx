import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [tempoProfile, setTempoProfile] = useState("realistic");

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to start playing",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatar) {
        const filename = sanitizeFilename(user.id, avatar.name);
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filename, avatar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filename);
        
        avatarUrl = publicUrl;
      }

      // Create or update user profile
      const { error: profileError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          nickname: nickname || null,
          avatar_url: avatarUrl,
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
        title: "Game Started!",
        description: "Welcome to Golden Age",
      });

      navigate("/game");
    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start game",
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
          <CardTitle className="text-3xl text-[#283754]">Welcome to Golden Age</CardTitle>
          <CardDescription>
            Create your character and start your financial life journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStartGame} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">Character Name (Optional)</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter a name for your character"
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
                {loading ? "Starting..." : "Start Your Journey"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Sign In / Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
