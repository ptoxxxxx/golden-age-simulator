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
    },
    {
      id: "fast",
      name: t('onboarding.tempo_fast'),
      description: t('onboarding.tempo_fast_desc'),
    },
    {
      id: "custom",
      name: t('onboarding.tempo_custom'),
      description: t('onboarding.tempo_custom_desc'),
    },
  ];
  
  return (
    <div className="space-y-3">
      <Label>{t('onboarding.tempo_profile')}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid gap-3">
          {profiles.map((profile) => (
            <label key={profile.id} htmlFor={profile.id} className="cursor-pointer">
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
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default TempoProfileSelector;
