
import { WeatherWidget } from "@/components/WeatherWidget";
import { SoilAnalysis } from "@/components/SoilAnalysis";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/components/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);

  // Simulate page loading
  useState(() => {
    setTimeout(() => setPageLoaded(true), 100);
  });

  return (
    <Layout>
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">{t('agrilift-soil-insight')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('soil-insight-description')}
          </p>
        </div>
        
        {/* Main Content Container */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SoilAnalysis />
        </div>
        
        {/* Footer Information */}
        <div className="mt-16 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>{t('footer-text')}</p>
        </div>
      </main>
    </Layout>
  );
};

export default Index;
