import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface TempoProfileSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const profiles = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Age 1 year per turn, realistic life progression",
  },
  {
    id: "fast",
    name: "Fast",
    description: "Age 2-3 years per turn, quicker gameplay",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Configure your own tempo",
  },
];

const TempoProfileSelector = ({ value, onChange }: TempoProfileSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Game Tempo Profile</Label>
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
