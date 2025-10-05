import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PiggyBank, Shield, TrendingUp } from "lucide-react";

interface FinancialStatsCardProps {
  saldo: number;
  savings: number;
  zus_account: number;
  private_investments: number;
}

const FinancialStatsCard = ({
  saldo,
  savings,
  zus_account,
  private_investments,
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
            <span className="text-sm text-muted-foreground">{t('game.savings')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(savings)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.zus_account')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(zus_account)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('game.investments')}</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(private_investments)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialStatsCard;
