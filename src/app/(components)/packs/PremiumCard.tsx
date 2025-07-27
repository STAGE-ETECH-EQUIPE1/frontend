import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card"; 
import { useTranslations } from "next-intl"; 

const PremiumCard = () => {
  const t  = useTranslations();

  const features = [
    t("pricing.premium.features.tokens"),
    t("pricing.premium.features.logo"),
    t("pricing.premium.features.concepts"),
    t("pricing.premium.features.revisions"),
    t("pricing.premium.features.formats"),
    t("pricing.premium.features.charter"),
    t("pricing.premium.features.mockups"),
    t("pricing.premium.features.delivery"),
  ];

  return (
    <Card className="relative p-6 ring-2 ring-accent scale-105 shadow-glow transition-all duration-300 card-premium">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="btn-accent px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Crown className="w-4 h-4" />
          {t("pricing.premium.popular")}
        </div>
      </div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground">{t("pricing.premium.title")}</h3>
        <p className="text-muted-foreground mb-4">{t("pricing.premium.description")}</p>
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">599€</span>
          <span className="text-muted-foreground ml-2 text-sm">TTC</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-accent" />
            <span className="text-foreground text-sm">{f}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full py-3 btn-premium">
        <Zap className="mr-2 w-4 h-4" />
        {t("pricing.premium.button")}
      </Button>
    </Card>
  );
};

export default PremiumCard;
