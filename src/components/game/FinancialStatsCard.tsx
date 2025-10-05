import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wallet, PiggyBank, Shield, TrendingUp, Banknote, Calendar, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FinancialStatsCardProps {
  salary: number;
  zus_contributions: number;
  saldo: number;
  savings: number;
  private_investments: number;
  planned_retirement_age: number;
  estimated_pension: number;
  onRetirementAgeChange: (age: number) => void;
}

const FinancialStatsCard = ({
  salary,
  zus_contributions,
  saldo,
  savings,
  private_investments,
  planned_retirement_age,
  estimated_pension,
  onRetirementAgeChange,
}: FinancialStatsCardProps) => {
  const { t } = useTranslation();
  const [retirementAge, setRetirementAge] = useState(planned_retirement_age);
  
  const MIN_RETIREMENT_AGE = 60; // Minimum for women in Poland
  const MAX_RETIREMENT_AGE = 100;

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value)) return;
    
    if (value < MIN_RETIREMENT_AGE) {
      toast({
        title: t('common.validation_error'),
        description: `${t('game.min_retirement_age')} ${MIN_RETIREMENT_AGE}`,
        variant: "destructive",
      });
      return;
    }
    
    if (value > MAX_RETIREMENT_AGE) {
      toast({
        title: t('common.validation_error'),
        description: `${t('game.max_retirement_age')} ${MAX_RETIREMENT_AGE}`,
        variant: "destructive",
      });
      return;
    }
    
    setRetirementAge(value);
    onRetirementAgeChange(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('game.financial_parameters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Salary & ZUS Section */}
        <div className="p-2 rounded-lg bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t('game.salary')}</span>
            </div>
            <span className="text-xs font-medium">{formatCurrency(salary)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t('game.zus_contribution')}</span>
            </div>
            <span className="text-xs font-medium">{formatCurrency(zus_contributions)}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{t('game.balance')}</span>
            </div>
            <span className="text-sm font-bold text-foreground">{formatCurrency(saldo)}</span>
          </div>
        </div>

        {/* Additional Investments Section */}
        <div className="p-2 rounded-lg bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <PiggyBank className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t('game.additional_savings')}</span>
            </div>
            <span className="text-xs font-medium">{formatCurrency(savings)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t('game.investments')}</span>
            </div>
            <span className="text-xs font-medium">{formatCurrency(private_investments)}</span>
          </div>
        </div>

        {/* Retirement Planning Section - Prominent */}
        <div className="p-3 rounded-lg bg-primary/10 space-y-3 mt-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">{t('game.planned_retirement_age')}</span>
            </div>
            <Input
              type="number"
              value={retirementAge}
              onChange={handleRetirementAgeChange}
              min={MIN_RETIREMENT_AGE}
              max={MAX_RETIREMENT_AGE}
              className="w-24 h-12 text-center text-3xl font-bold border-2"
            />
          </div>

          <div className="flex flex-col items-center text-center space-y-1 pt-2 border-t">
            <div className="flex items-center gap-1.5 text-primary">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-semibold">{t('game.estimated_pension')}</span>
            </div>
            <span className="text-2xl font-bold text-primary">{formatCurrency(estimated_pension)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialStatsCard;
