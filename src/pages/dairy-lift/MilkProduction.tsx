import React from "react";
import { useLanguage } from "@/components/LanguageContext";

const MilkProduction = () => {
  const { t } = useLanguage();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">{t('milk-production')}</h1>
      <p className="text-blue-700">{t('milk-production-desc')}</p>
    </div>
  );
};

export default MilkProduction;