
import { Star, Truck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

export const TrustSection = () => {
  const { t } = useLanguage();
  return (
    <motion.div 
      className="mt-16 py-10 px-6 rounded-2xl bg-white shadow-lg max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="text-center mb-10">
        <div className="w-12 h-1 bg-foliage mx-auto mb-4"></div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Choose AgriLift Market?</h2>
        <p className="text-gray-600">The premium marketplace for farmers with quality guaranteed</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <motion.div 
          className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-green-100 text-foliage-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('premium-quality')}</h3>
          <p className="text-gray-600">{t('premium-quality-desc')}</p>
        </motion.div>
        
        <motion.div 
          className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-blue-100 text-sky-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('fast-delivery')}</h3>
          <p className="text-gray-600">{t('fast-delivery-desc')}</p>
        </motion.div>
        
        <motion.div 
          className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-yellow-100 text-wheat-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('expert-support')}</h3>
          <p className="text-gray-600">{t('expert-support-desc')}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
