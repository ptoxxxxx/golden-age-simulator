import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvatarUpload from "@/components/onboarding/AvatarUpload";
import { sanitizeFilename, INITIAL_PLAYER_STATE } from "@/lib/gameUtils";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  avatar: z.instanceof(File).optional().nullable(),
});

const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.nickname) {
        navigate("/game-hub");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = onboardingSchema.safeParse({ name, avatar });

      if (!validationResult.success) {
        toast({
          title: t("common.validation_error"),
          description: validationResult.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      let avatarUrl: string | null = null;

      // Upload avatar if provided
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
          title: t("onboarding.generating_avatars"),
          description: t("onboarding.avatars_processing"),
        });

        supabase.functions.invoke("generate-avatar-variations", {
          body: {
            avatarUrl: publicUrl,
            userAge: INITIAL_PLAYER_STATE.age,
            userId: user.id,
          },
        }).then(({ error }) => {
          if (error) {
            console.error("Error generating avatar variations:", error);
          }
        });

        // Save base avatar to user_avatars
        await supabase.from("user_avatars").insert({
          user_id: user.id,
          avatar_url: publicUrl,
          age_group: null,
          mood: null,
        });
      }

      // Save user profile
      const { error: profileError } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          nickname: name,
          avatar_url: avatarUrl,
        });

      if (profileError) throw profileError;

      toast({
        title: t("onboarding.profile_complete"),
        description: t("onboarding.ready_to_play"),
      });

      navigate("/game-hub");
    } catch (error: any) {
      console.error("Error completing profile:", error);
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("onboarding.complete_profile")}</CardTitle>
          <CardDescription>{t("onboarding.setup_character")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("onboarding.name")} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboarding.name_placeholder")}
                maxLength={50}
                required
              />
            </div>

            <AvatarUpload value={avatar} onChange={setAvatar} />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? t("onboarding.saving") : t("onboarding.continue")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
