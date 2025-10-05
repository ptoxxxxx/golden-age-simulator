import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink } from "lucide-react";

interface CoachCommentProps {
  comment: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnMoreUrl?: string;
}

const CoachComment = ({ comment, open, onOpenChange, learnMoreUrl }: CoachCommentProps) => {
  const { t } = useTranslation();
  
  const handleLearnMore = () => {
    if (learnMoreUrl) {
      window.open(learnMoreUrl, '_blank');
    }
    // TODO: W przyszłości można dodać nawigację do bazy wiedzy w aplikacji
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#007834]" />
            {t('game.ai_coach')}
          </DialogTitle>
          <DialogDescription className="text-base pt-4">
            {comment}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t('game.close')}
          </Button>
          <Button
            onClick={handleLearnMore}
            className="bg-[#007834] hover:bg-[#006329] gap-2 w-full sm:w-auto"
          >
            {t('game.learn_more')}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoachComment;
