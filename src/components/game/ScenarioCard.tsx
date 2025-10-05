import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Check } from "lucide-react";

interface ScenarioOption {
  id: number;
  option_text: string;
  option_text_pl?: string;
  effects: Record<string, number>;
  ai_coach_comment?: string;
  ai_coach_comment_pl?: string;
}

interface ScenarioCardProps {
  scenario: {
    id: number;
    story_prompt: string;
    story_prompt_pl?: string;
    area?: string;
    area_pl?: string;
  };
  options: ScenarioOption[];
  selectedOptionId: number | null;
  onSelectOption: (optionId: number) => void;
  onConfirmOption: () => void;
  onAdvisoryClick: (optionId: number, effects: Record<string, number>) => void;
  disabled?: boolean;
  language?: string;
  showCoachComments: boolean;
  onToggleCoachComments: (value: boolean) => void;
}

const ScenarioCard = ({ 
  scenario, 
  options, 
  selectedOptionId,
  onSelectOption, 
  onConfirmOption,
  onAdvisoryClick,
  disabled, 
  language = 'en',
  showCoachComments,
  onToggleCoachComments
}: ScenarioCardProps) => {
  const { t } = useTranslation();
  const isPolish = language === 'pl';
  
  const displayPrompt = isPolish && scenario.story_prompt_pl ? scenario.story_prompt_pl : scenario.story_prompt;
  
  return (
    <Card className="animate-fade-in shadow-modern-lg hover-lift border-0 bg-gradient-subtle overflow-hidden">
      <CardHeader className="space-y-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-3xl font-bold text-foreground leading-tight flex-1">
            {displayPrompt}
          </CardTitle>
          <div className="flex items-center gap-2 pt-1">
            <Label htmlFor="coach-toggle" className="text-sm text-muted-foreground cursor-pointer">
              {t('game.coach_advisor')}
            </Label>
            <Switch
              id="coach-toggle"
              checked={showCoachComments}
              onCheckedChange={onToggleCoachComments}
              disabled={disabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 pt-2">
          <div className="h-1 w-12 bg-gradient-primary rounded-full" />
          <h3 className="text-xl font-semibold text-foreground">{t('game.what_will_you_do')}</h3>
        </div>
        <div className="space-y-3">
          {options.map((option) => {
            const displayOptionText = isPolish && option.option_text_pl ? option.option_text_pl : option.option_text;
            const isSelected = selectedOptionId === option.id;
            
            return (
              <div key={option.id} className="relative">
                <Button
                  onClick={() => onSelectOption(option.id)}
                  disabled={disabled}
                  variant="outline"
                  className={`w-full text-left h-auto py-5 pl-12 pr-14 justify-start transition-smooth shadow-modern-sm group ${
                    isSelected 
                      ? 'bg-green-50 border-green-500 hover:bg-green-100 shadow-modern-md' 
                      : 'border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-modern-md'
                  }`}
                >
                  {isSelected && (
                    <Check className="h-5 w-5 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  )}
                  <span className="text-base leading-relaxed group-hover:text-foreground transition-colors">
                    {displayOptionText}
                  </span>
                </Button>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdvisoryClick(option.id, option.effects || {});
                  }}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-amber-100"
                  disabled={disabled}
                  title={t('game.advisory_title')}
                >
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </Button>
              </div>
            );
          })}
        </div>
        
        {selectedOptionId && (
          <Button
            onClick={onConfirmOption}
            disabled={disabled}
            className="w-full bg-[#007834] hover:bg-[#006329] mt-4"
            size="lg"
          >
            {t('game.confirm_choice')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;