import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Smile, Users, Shield } from "lucide-react";

interface PlayerStatsProps {
  age: number;
  health: number;
  happiness: number;
  relationships: number;
  saldo: number;
  savings: number;
  zus_account: number;
  private_investments: number;
}

const PlayerStats = ({
  age,
  health,
  happiness,
  relationships,
  saldo,
  savings,
  zus_account,
  private_investments,
}: PlayerStatsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-3xl font-bold text-[#283754]">{age}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Health</span>
                </div>
                <span className="text-sm font-medium">{health}%</span>
              </div>
              <Progress value={health} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Happiness</span>
                </div>
                <span className="text-sm font-medium">{happiness}%</span>
              </div>
              <Progress value={happiness} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Relationships</span>
                </div>
                <span className="text-sm font-medium">{relationships}%</span>
              </div>
              <Progress value={relationships} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-lg font-bold text-[#283754]">{formatCurrency(saldo)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Savings</span>
              <span className="text-sm font-medium">{formatCurrency(savings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ZUS Account</span>
              <span className="text-sm font-medium">{formatCurrency(zus_account)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Investments</span>
              <span className="text-sm font-medium">{formatCurrency(private_investments)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStats;
