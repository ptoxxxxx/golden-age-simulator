import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AvatarCardProps {
  avatarUrl?: string;
  nickname?: string;
  age: number;
}

const AvatarCard = ({ avatarUrl, nickname }: AvatarCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 w-full">
          <Avatar className="w-48 h-48 border-4 border-primary">
            <AvatarImage src={avatarUrl} alt={nickname || t('game.player')} />
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
