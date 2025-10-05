import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getAvatarForState } from "@/lib/avatarUtils";

interface AvatarCardProps {
  avatarUrl?: string;
  nickname?: string;
  age: number;
  health?: number;
  career?: number;
  education_level?: number;
  entertainment?: number;
  relationships?: number;
  userId?: string;
}

const AvatarCard = ({ 
  avatarUrl, 
  nickname, 
  age, 
  health, 
  career,
  education_level,
  entertainment,
  relationships,
  userId 
}: AvatarCardProps) => {
  const { t } = useTranslation();
  const [displayAvatar, setDisplayAvatar] = useState<string | null>(avatarUrl || null);

  useEffect(() => {
    const loadAvatar = async () => {
      if (userId && 
          health !== undefined && 
          career !== undefined && 
          education_level !== undefined &&
          entertainment !== undefined &&
          relationships !== undefined) {
        const dynamicAvatar = await getAvatarForState(
          userId, 
          age, 
          health, 
          career,
          education_level,
          entertainment,
          relationships
        );
        if (dynamicAvatar) {
          setDisplayAvatar(dynamicAvatar);
          return;
        }
      }
      // Fallback to base avatar
      setDisplayAvatar(avatarUrl || null);
    };

    loadAvatar();
  }, [userId, age, health, career, education_level, entertainment, relationships, avatarUrl]);

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 w-full">
          <Avatar className="w-48 h-48 border-4 border-primary">
            <AvatarImage src={displayAvatar || undefined} alt={nickname || t('game.player')} />
            <AvatarFallback className="bg-muted">
              <User className="w-24 h-24 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          {nickname && (
            <h2 className="text-2xl font-semibold text-foreground text-center">
              {nickname}
            </h2>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
