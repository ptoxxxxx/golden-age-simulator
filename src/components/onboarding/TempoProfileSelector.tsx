import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface TempoProfileSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TempoProfileSelector = ({ value, onChange }: TempoProfileSelectorProps) => {
  const { t } = useTranslation();
  
  const profiles = [
    {
      id: "realistic",
      name: t('onboarding.tempo_realistic'),
      description: t('onboarding.tempo_realistic_desc'),
      available: true,
    },
    {
      id: "fast",
      name: t('onboarding.tempo_fast'),
      description: t('onboarding.tempo_fast_desc'),
      available: true,
    },
    {
      id: "custom",
      name: t('onboarding.tempo_custom'),
      description: t('onboarding.mode_coming_soon'),
      available: false,
    },
  ];
  
  return (
    <div className="space-y-3">
      <Label>{t('onboarding.tempo_profile')}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid gap-3">
          {profiles.map((profile) => (
            <div key={profile.id}>
              {profile.available ? (
                <label htmlFor={profile.id} className="cursor-pointer">
                  <Card
                    className={`p-4 transition-colors ${
                      value === profile.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={profile.id} id={profile.id} />
                      <div className="flex-1">
                        <div className="font-medium">
                          {profile.name}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </label>
              ) : (
                <Card className="p-4 bg-muted/30 opacity-60 cursor-not-allowed">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-medium">
                        {profile.name}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {profile.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default TempoProfileSelector;
