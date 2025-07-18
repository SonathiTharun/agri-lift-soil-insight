import React from "react";
import { useLanguage } from "@/components/LanguageContext";

const CattleManagement = () => {
    const { t } = useLanguage();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">{t('cattle-management')}</h1>
            <p className="text-blue-700">{t('cattle-management-desc')}</p>
        </div>
    );
};

export default CattleManagement;