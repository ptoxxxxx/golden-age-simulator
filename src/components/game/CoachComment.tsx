import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface CoachCommentProps {
  comment: string;
}

const CoachComment = ({ comment }: CoachCommentProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-[#007834]/5 border-[#007834]/20 animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-[#007834] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#283754] mb-1">{t('game.ai_coach')}</p>
            <p className="text-sm text-muted-foreground">{comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachComment;
