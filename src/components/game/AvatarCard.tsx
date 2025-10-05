import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AvatarCardProps {
  avatarUrl?: string;
  nickname?: string;
  age: number;
}

const AvatarCard = ({ avatarUrl, nickname, age }: AvatarCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32 border-4 border-primary">
            <AvatarImage src={avatarUrl} alt={nickname || t('game.player')} />
            <AvatarFallback className="bg-muted">
              <User className="w-16 h-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          {nickname && (
            <h2 className="text-xl font-semibold text-foreground text-center">
              {nickname}
            </h2>
          )}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('game.age')}</p>
            <p className="text-3xl font-bold text-foreground">{age}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
