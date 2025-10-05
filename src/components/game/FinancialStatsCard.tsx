import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PiggyBank, Shield, TrendingUp, Banknote, Calendar, TrendingDown } from "lucide-react";

interface FinancialStatsCardProps {
  salary: number;
  zus_contributions: number;
  saldo: number;
  savings: number;
  private_investments: number;
  planned_retirement_age: number;
  estimated_pension: number;
}

const FinancialStatsCard = ({
  salary,
  zus_contributions,
  saldo,
  savings,
  private_investments,
  planned_retirement_age,
  estimated_pension,
}: FinancialStatsCardProps) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t('game.financial_parameters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.salary')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(salary)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.zus_contribution')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(zus_contributions)}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t('game.balance')}</span>
          </div>
          <span className="text-base font-bold text-foreground">{formatCurrency(saldo)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.additional_savings')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(savings)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.investments')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(private_investments)}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('game.planned_retirement_age')}</span>
            </div>
            <span className="text-sm font-medium">{planned_retirement_age} {t('game.years')}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{t('game.estimated_pension')}</span>
            </div>
            <span className="text-base font-bold text-primary">{formatCurrency(estimated_pension)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialStatsCard;
