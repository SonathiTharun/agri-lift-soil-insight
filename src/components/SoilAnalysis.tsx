import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { SoilCharts } from "@/components/SoilCharts";
import { SoilParameter as ApiSoilParameter, CropRecommendation } from "@/services/apiService";
import { useLanguage } from "@/components/LanguageContext";
import { analyzeSoilWithAI, extractSoilDataFromImage } from "@/services/aiService";
import { SmartCropPlanner } from "@/components/SmartCropPlanner";
import { Sparkles, Loader2, MapPin, User, FileImage, AlertTriangle } from "lucide-react";

// Re-export type alias
type SoilParameter = ApiSoilParameter;

// Types for soil data (using types from apiService)
type SoilReport = {
  id?: string;
  parameters: SoilParameter[];
  timestamp: string;
};

export function SoilAnalysis() {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [soilReport, setSoilReport] = useState<SoilReport | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("kharif");
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'manual' | null>(null);
  const [manualData, setManualData] = useState<SoilParameter[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [insightLang, setInsightLang] = useState<'hi' | 'en'>('hi');
  const [aiExtractionStatus, setAiExtractionStatus] = useState<string>('');
  const [cardMeta, setCardMeta] = useState<{
    farmerName: string | null;
    village: string | null;
    district: string | null;
    state: string | null;
    surveyNumber: string | null;
    sampleDate: string | null;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Function to handle file upload using GPT-4o Vision via Puter.js
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type — images and PDF supported
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t("invalid-file-type"),
        description: "Please upload a JPG, PNG, or WEBP image of your Soil Health Card.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: t("file-too-large"),
        description: t("please-upload-smaller-file"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setAnalyzing(true);
    setAiExtractionStatus('📤 Uploading image...');
    setCardMeta(null);

    try {
      // Animate progress while AI works
      setUploadProgress(25);
      setAiExtractionStatus('🤖 GPT-4o is reading your Soil Health Card...');

      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 85 ? prev + 5 : prev));
      }, 800);

      // 🔥 AI Vision extraction — no backend needed
      const result = await extractSoilDataFromImage(file);

      clearInterval(progressTimer);
      setUploadProgress(100);
      setAiExtractionStatus(`✅ Extracted ${result.extractedCount} soil parameters!`);

      // Save card metadata (farmer name, village, etc.)
      if (result.meta.farmerName || result.meta.district || result.meta.village) {
        setCardMeta(result.meta);
      }

      // Build SoilReport from AI-extracted parameters
      const reportId = `ai-${Date.now()}`;
      const aiSoilReport: SoilReport = {
        id: reportId,
        parameters: result.parameters.map(p => ({
          name: p.name,
          value: p.value,
          unit: p.unit,
          status: p.status,
          optimal: p.optimal,
        })),
        timestamp: new Date().toISOString(),
      };

      setSoilReport(aiSoilReport);
      setIsUploading(false);
      setAnalyzing(false);
      setInputMode('upload');
      setShowVisualization(true);

      // Generate crop recommendations from extracted data
      generateManualCropRecommendations(aiSoilReport.parameters, selectedSeason);

      toast({
        title: '🌾 AI Analysis Complete!',
        description: `GPT-4o extracted ${result.extractedCount} parameters from your Soil Health Card. Click "Get AI Insights" for personalized crop advice.`,
      });

    } catch (error) {
      console.error('AI extraction error:', error);
      setIsUploading(false);
      setAnalyzing(false);
      setAiExtractionStatus('');

      toast({
        title: t("analysis-failed"),
        description: error instanceof Error
          ? error.message
          : 'AI could not read the card. Please ensure the image is clear and well-lit.',
        variant: "destructive",
      });
    }
  };

  // Function to generate crop recommendations for manual data entry
  const generateManualCropRecommendations = (parameters: SoilParameter[], season: string) => {
    console.log('🌱 Generating manual crop recommendations for season:', season);
    console.log('📊 Parameters:', parameters);

    // Create a parameter lookup for easy access
    const paramLookup = parameters.reduce((acc, param) => {
      acc[param.name.toLowerCase().replace(' ', '_')] = param;
      return acc;
    }, {} as Record<string, SoilParameter>);

    // Define types for crop requirements
    interface CropRequirement {
      min: number;
      max: number;
      weight: number;
    }

    interface CropData {
      name: string;
      description: string;
      growingPeriod: string;
      waterNeed: "Low" | "Medium" | "High";
      requirements: Record<string, CropRequirement>;
    }

    // Define crop database with requirements
    const cropDatabase: Record<string, CropData[]> = {
      kharif: [
        {
          name: t("rice"),
          description: "Staple cereal crop, requires high water availability and slightly acidic to neutral soil.",
          growingPeriod: "120-150 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 5.5, max: 7.0, weight: 0.2 },
            nitrogen: { min: 100, max: 200, weight: 0.25 },
            phosphorus: { min: 20, max: 40, weight: 0.2 },
            potassium: { min: 150, max: 300, weight: 0.2 },
            moisture: { min: 35, max: 60, weight: 0.15 }
          }
        },
        {
          name: t("maize"),
          description: "Versatile cereal crop, adapts well to various soil conditions with good drainage.",
          growingPeriod: "90-120 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 120, max: 180, weight: 0.3 },
            phosphorus: { min: 25, max: 40, weight: 0.25 },
            potassium: { min: 120, max: 250, weight: 0.2 },
            organic_matter: { min: 2.5, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: t("cotton"),
          description: "Cash crop requiring well-drained soil with moderate fertility and warm climate.",
          growingPeriod: "180-200 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.5, max: 8.0, weight: 0.15 },
            nitrogen: { min: 80, max: 150, weight: 0.25 },
            phosphorus: { min: 15, max: 30, weight: 0.25 },
            potassium: { min: 150, max: 280, weight: 0.3 },
            organic_matter: { min: 1.5, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: t("sugarcane"),
          description: "Long-duration crop requiring rich, well-drained soil with high organic matter.",
          growingPeriod: "300-365 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.15 },
            nitrogen: { min: 150, max: 250, weight: 0.3 },
            phosphorus: { min: 30, max: 50, weight: 0.2 },
            potassium: { min: 200, max: 350, weight: 0.25 },
            organic_matter: { min: 3.0, max: 8.0, weight: 0.1 }
          }
        }
      ],
      rabi: [
        {
          name: t("wheat"),
          description: "Major cereal crop, prefers cool climate and well-drained fertile soil.",
          growingPeriod: "120-150 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 100, max: 160, weight: 0.3 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 100, max: 200, weight: 0.2 },
            organic_matter: { min: 2.0, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: t("barley"),
          description: "Hardy cereal crop, tolerates alkaline soil and requires less water than wheat.",
          growingPeriod: "90-120 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.5, max: 8.5, weight: 0.15 },
            nitrogen: { min: 80, max: 140, weight: 0.25 },
            phosphorus: { min: 15, max: 30, weight: 0.25 },
            potassium: { min: 80, max: 180, weight: 0.25 },
            organic_matter: { min: 1.5, max: 4.0, weight: 0.1 }
          }
        },
        {
          name: t("mustard"),
          description: "Oilseed crop, adapts to various soil types and requires moderate fertility.",
          growingPeriod: "90-110 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 60, max: 120, weight: 0.25 },
            phosphorus: { min: 15, max: 25, weight: 0.25 },
            potassium: { min: 80, max: 150, weight: 0.25 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: t("chickpea"),
          description: "Legume crop that fixes nitrogen, prefers well-drained soil with neutral pH.",
          growingPeriod: "100-120 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.5, max: 7.5, weight: 0.25 },
            nitrogen: { min: 20, max: 60, weight: 0.1 }, // Lower N requirement due to N fixation
            phosphorus: { min: 20, max: 35, weight: 0.3 },
            potassium: { min: 100, max: 200, weight: 0.25 },
            organic_matter: { min: 2.0, max: 5.0, weight: 0.1 }
          }
        }
      ],
      zaid: [
        {
          name: t("watermelon"),
          description: "Summer fruit crop requiring well-drained sandy loam soil with good organic matter.",
          growingPeriod: "90-100 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 6.0, max: 7.0, weight: 0.2 },
            nitrogen: { min: 80, max: 120, weight: 0.25 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 150, max: 250, weight: 0.25 },
            organic_matter: { min: 3.0, max: 6.0, weight: 0.05 }
          }
        },
        {
          name: t("cucumber"),
          description: "Vine crop requiring warm climate and fertile, well-drained soil.",
          growingPeriod: "60-70 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.0, weight: 0.2 },
            nitrogen: { min: 100, max: 150, weight: 0.3 },
            phosphorus: { min: 25, max: 40, weight: 0.25 },
            potassium: { min: 120, max: 200, weight: 0.2 },
            organic_matter: { min: 2.5, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: t("fodder-maize"),
          description: "Quick-growing fodder crop, suitable for summer cultivation with irrigation.",
          growingPeriod: "60-75 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.15 },
            nitrogen: { min: 100, max: 160, weight: 0.35 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 100, max: 200, weight: 0.2 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: t("sunflower"),
          description: "Oilseed crop with good drought tolerance, adapts to various soil conditions.",
          growingPeriod: "90-110 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 60, max: 100, weight: 0.25 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 120, max: 220, weight: 0.25 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        }
      ]
    };

    // Calculate suitability scores for crops in the selected season
    const seasonCrops = cropDatabase[season as keyof typeof cropDatabase] || [];

    const recommendations: CropRecommendation[] = seasonCrops.map((crop: CropData) => {
      let totalScore = 0;
      let totalWeight = 0;

      // Calculate score for each parameter
      Object.entries(crop.requirements).forEach(([paramName, requirement]: [string, CropRequirement]) => {
        const param = paramLookup[paramName];
        if (param) {
          const value = param.value;
          let paramScore = 0;

          // Calculate parameter score based on how well it fits the requirement
          if (value >= requirement.min && value <= requirement.max) {
            // Perfect match
            paramScore = 100;
          } else if (value < requirement.min) {
            // Below minimum - calculate how far below
            const deficit = requirement.min - value;
            const range = requirement.max - requirement.min;
            paramScore = Math.max(0, 100 - (deficit / range) * 100);
          } else {
            // Above maximum - calculate how far above
            const excess = value - requirement.max;
            const range = requirement.max - requirement.min;
            paramScore = Math.max(0, 100 - (excess / range) * 50); // Less penalty for excess
          }

          totalScore += paramScore * requirement.weight;
          totalWeight += requirement.weight;
        }
      });

      // Normalize score
      const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;

      // Determine suitability based on score
      let suitability: "Excellent" | "Good" | "Fair" | "Poor";
      if (finalScore >= 85) suitability = t("excellent") as "Excellent";
      else if (finalScore >= 70) suitability = t("good") as "Good";
      else if (finalScore >= 50) suitability = t("fair") as "Fair";
      else suitability = t("poor") as "Poor";

      return {
        name: crop.name,
        description: crop.description,
        growingPeriod: crop.growingPeriod,
        waterNeed: crop.waterNeed,
        suitability,
        score: finalScore,
        season
      };
    });

    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);

    console.log('🎯 Generated recommendations:', recommendations);
    setCropRecommendations(recommendations);
  };

  // Function to initialize manual data entry
  const initializeManualEntry = () => {
    const parameters: SoilParameter[] = [
      {
        name: t("ph"),
        value: 6.5,
        unit: "",
        status: "optimal",
        optimal: { min: 6.0, max: 7.5 },
      },
      {
        name: t("nitrogen"),
        value: 120,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 80, max: 180 },
      },
      {
        name: t("phosphorus"),
        value: 25,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 15, max: 35 },
      },
      {
        name: t("potassium"),
        value: 180,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 120, max: 280 },
      },
      {
        name: t("organic-matter"),
        value: 3.5,
        unit: "%",
        status: "optimal",
        optimal: { min: 3, max: 6 },
      },
      {
        name: t("moisture"),
        value: 30,
        unit: "%",
        status: "optimal",
        optimal: { min: 25, max: 45 },
      },
    ];

    setManualData(parameters);
    setInputMode('manual');
    setShowVisualization(false);
    setCropRecommendations([]);

    toast({
      title: t("manual-entry-mode"),
      description: t("enter-soil-parameters"),
    });
  };

  // Function to visualize manual data
  const visualizeManualData = () => {
    if (manualData.length === 0) {
      toast({
        title: t("no-data"),
        description: t("no-data-description"),
        variant: "destructive",
      });
      return;
    }

    const report: SoilReport = {
      parameters: manualData,
      timestamp: new Date().toISOString(),
    };

    setSoilReport(report);
    setShowVisualization(true);

    // Generate crop recommendations for manual data
    generateManualCropRecommendations(manualData, selectedSeason);

    toast({
      title: t("data-visualized"),
      description: t("data-visualized-description"),
    });
  };

  // Effect to update crop recommendations when season changes
  useEffect(() => {
    if (soilReport) {
      generateManualCropRecommendations(soilReport.parameters, selectedSeason);
    }
  }, [selectedSeason, soilReport]);

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Function to get AI-powered soil insights
  const handleGetAIInsights = async (lang?: 'hi' | 'en') => {
    if (!soilReport) return;
    const targetLang = lang ?? insightLang;
    setIsLoadingAI(true);
    setAiInsights(null);
    try {
      const insights = await analyzeSoilWithAI(soilReport.parameters, targetLang);
      setAiInsights(insights);
    } catch (error) {
      setAiInsights(
        '⚠️ Could not connect to AI service. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Beautiful section-based markdown renderer
  const renderAIInsights = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let bulletBuffer: string[] = [];
    let key = 0;

    const flushBullets = () => {
      if (bulletBuffer.length > 0) {
        elements.push(
          <ul key={key++} className="space-y-1.5 mb-3 ml-1">
            {bulletBuffer.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }} />
              </li>
            ))}
          </ul>
        );
        bulletBuffer = [];
      }
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushBullets(); continue; }

      // H2 headings (## 🌱 Section Title)
      if (line.startsWith('## ')) {
        flushBullets();
        const title = line.replace(/^## /, '');
        elements.push(
          <div key={key++} className="flex items-center gap-2 mt-5 mb-2 pb-1 border-b border-green-200">
            <span className="text-base">{title.match(/^(\p{Emoji}+)/u)?.[1] ?? '🌿'}</span>
            <h3 className="font-bold text-green-900 text-sm tracking-wide uppercase">
              {title.replace(/^(\p{Emoji}+\s*)/u, '')}
            </h3>
          </div>
        );
        continue;
      }

      // H3 subheadings (### Khaad aur Amendments)
      if (line.startsWith('### ')) {
        flushBullets();
        const title = line.replace(/^### /, '');
        elements.push(
          <p key={key++} className="font-semibold text-green-800 text-sm mt-3 mb-1">{title}</p>
        );
        continue;
      }

      // Bullet lines starting with - or *
      if (line.startsWith('- ') || line.startsWith('* ')) {
        bulletBuffer.push(line.replace(/^[-*] /, ''));
        continue;
      }

      // Regular text
      flushBullets();
      elements.push(
        <p key={key++} className="text-sm text-gray-700 mb-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }}
        />
      );
    }
    flushBullets();
    return elements;
  };

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "text-status-optimal";
      case "low": return "text-status-warning";
      case "deficient": return "text-status-danger";
      default: return "text-gray-500";
    }
  };

  // Function to determine status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal": return "✓";
      case "low": return "⚠️";
      case "deficient": return "❌";
      default: return "•";
    }
  };

  // Function to determine recommendation badge color
  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "Excellent": return "bg-status-optimal text-white";
      case "Good": return "bg-green-100 text-green-800";
      case "Fair": return "bg-status-warning/20 text-status-warning";
      case "Poor": return "bg-status-danger/20 text-status-danger";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get suitability emoji
  const getSuitabilityEmoji = (suitability: string) => {
    switch (suitability) {
      case "Excellent": return "🌟";
      case "Good": return "👍";
      case "Fair": return "👌";
      case "Poor": return "⚠️";
      default: return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-soil-light/5">
        <CardHeader className="bg-gradient-to-r from-soil to-soil-dark text-white rounded-t-lg">
          <CardTitle className="text-center">{t("soil-analysis")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Initial Mode Selection */}
          {inputMode === null && !analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-6">{t("choose-analysis-method")}</h3>
              <p className="text-sm text-gray-600 mb-8">{t("select-soil-analysis")}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Upload Option */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-soil" onClick={() => setInputMode('upload')}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-soil" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium mb-2">{t("upload-soil-card")}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t("upload-description")}</p>
                    <div className="text-xs text-gray-500">
                      <p>✓ Automatic OCR processing</p>
                      <p>✓ Supports PDF, JPG, PNG</p>
                      <p>✓ Instant analysis</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Entry Option */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-soil" onClick={initializeManualEntry}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-soil" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium mb-2">{t("manual-data-entry")}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t("manual-description")}</p>
                    <div className="text-xs text-gray-500">
                      <p>✓ Custom parameter input</p>
                      <p>✓ Real-time validation</p>
                      <p>✓ Flexible analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Upload Mode */}
          {inputMode === 'upload' && !soilReport && !analyzing && (
            <div className="text-center py-8">
              <Button
                onClick={() => setInputMode(null)}
                variant="ghost"
                className="mb-4 text-gray-600 hover:text-gray-800"
              >
                {t("back-to-selection")}
              </Button>

              {/* AI Powered badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles size={12} />
                Powered by GPT-4o Vision — Real AI Extraction
              </div>

              <h3 className="text-lg font-medium mb-2">{t("upload-your-card")}</h3>
              <p className="text-sm text-gray-600 mb-6">GPT-4o will visually read your Mitti Swasthya Patra and extract all soil parameters automatically.</p>

              {/* PDF Info Box */}
              <div className="max-w-sm mx-auto mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-left">
                <FileImage size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  <strong>📄 PDF supported:</strong> Upload your Soil Health Card as JPG, PNG, or PDF. For PDFs, GPT-4o will read the first page automatically.
                </p>
              </div>

              <div
                className="max-w-sm mx-auto border-2 border-dashed border-green-300 rounded-xl p-8 cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all"
                onClick={triggerFileUpload}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  aria-label={t("upload-soil-card-label")}
                />
                <div className="text-center">
                  <FileImage className="mx-auto h-14 w-14 text-green-500 mb-3" />
                  <p className="text-sm font-medium text-gray-700">Click to upload your Soil Health Card</p>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP, PDF • Max 10MB</p>
                  <p className="mt-3 text-xs text-green-700 font-semibold">🤖 AI will read & extract all soil parameters</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-sm mx-auto">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📷 Tips for Best Results</h4>
                <ul className="text-xs text-blue-800 space-y-1 text-left">
                  <li>✓ {t("ensure-good-lighting")}</li>
                  <li>✓ {t("keep-document-flat")}</li>
                  <li>✓ {t("capture-all-text")}</li>
                  <li>✓ Make sure all numbers (pH, N, P, K) are clearly visible</li>
                  <li>✓ Works with Govt of India Soil Health Cards (Mitti Swasthya Patra)</li>
                </ul>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="text-center py-8">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">AI Reading Your Card...</h3>
                <p className="text-sm text-gray-600 mb-4">{aiExtractionStatus}</p>
                <Progress value={uploadProgress} className="h-3 mb-2" />
                <p className="text-xs text-gray-500">{uploadProgress}% complete • This may take 10–20 seconds</p>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700">🔍 GPT-4o is scanning pH, N, P, K, Organic Carbon, Zinc and more...</p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {inputMode === 'manual' && !showVisualization && (
            <div className="py-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => setInputMode(null)}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  {t("back-to-selection-tips")}
                </Button>
                <h3 className="text-lg font-medium">{t("manual-data-entry-title")}</h3>
                <div></div>
              </div>

              <p className="text-sm text-gray-600 mb-6 text-center">{t("enter-soil-parameters-below")}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {manualData.map((param, index) => (
                  <Card key={param.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">{param.name}</label>
                      <span className="text-xs text-gray-500">{param.unit}</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={param.value}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value) || 0;
                        const updatedData = [...manualData];

                        // Update status based on optimal range
                        let status: "optimal" | "low" | "deficient" = "optimal";
                        if (newValue < param.optimal.min) {
                          status = newValue < param.optimal.min * 0.7 ? "deficient" : "low";
                        } else if (newValue > param.optimal.max) {
                          status = newValue > param.optimal.max * 1.3 ? "deficient" : "low";
                        }

                        updatedData[index] = { ...param, value: newValue, status };
                        setManualData(updatedData);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soil focus:border-transparent"
                      placeholder={t("enter-value-placeholder").replace("{param}", param.name.toLowerCase())}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        param.status === 'optimal' ? 'bg-green-100 text-green-800' :
                        param.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {param.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t("optimal-range").replace("{min}", param.optimal.min.toString()).replace("{max}", param.optimal.max.toString())}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                  onClick={visualizeManualData}
                  className="bg-soil hover:bg-soil-dark text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  🔍 {t("visualize-data")} {t("get-recommendations")}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg max-w-2xl mx-auto">
                <h4 className="text-sm font-medium text-green-900 mb-2">{t("parameter-guidelines")}</h4>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• <strong>pH:</strong> 6.0-7.5 is optimal for most crops</li>
                  <li>• <strong>Nitrogen:</strong> 80-180 kg/ha for good crop growth</li>
                  <li>• <strong>Phosphorus:</strong> 15-35 kg/ha for root development</li>
                  <li>• <strong>Potassium:</strong> 120-280 kg/ha for plant health</li>
                  <li>• <strong>Organic Matter:</strong> 3-6% for soil fertility</li>
                  <li>• <strong>Moisture:</strong> 25-45% for optimal water availability</li>
                </ul>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-4">{t("analyzing-card")}</h3>
              <div className="max-w-sm mx-auto">
                <div className="animate-pulse flex space-x-4 items-center justify-center">
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                  <div className="h-4 bg-soil-light rounded w-16"></div>
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">{t("processing-image")}</p>
                  <p className="text-xs text-gray-500">{t("identifying-parameters")}</p>
                  <p className="text-xs text-gray-500">{t("generating-recommendations")}</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">This may take 10-30 seconds depending on image quality</p>
                </div>
              </div>
            </div>
          )}

          {soilReport && showVisualization && (
            <div className="py-4">
              <div className="mb-6">
                {/* Farmer Card Metadata Banner (shown only for AI-extracted uploads) */}
                {cardMeta && inputMode === 'upload' && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1"><User size={12}/> Farmer Details (from card)</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-700">
                      {cardMeta.farmerName && <span>👤 <strong>Name:</strong> {cardMeta.farmerName}</span>}
                      {cardMeta.village && <span className="flex items-center gap-1"><MapPin size={10}/> <strong>Village:</strong> {cardMeta.village}</span>}
                      {cardMeta.district && <span>🏢 <strong>District:</strong> {cardMeta.district}</span>}
                      {cardMeta.state && <span>🗺️ <strong>State:</strong> {cardMeta.state}</span>}
                      {cardMeta.surveyNumber && <span>📋 <strong>Survey No:</strong> {cardMeta.surveyNumber}</span>}
                      {cardMeta.sampleDate && <span>📅 <strong>Date:</strong> {cardMeta.sampleDate}</span>}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {inputMode === 'manual' && (
                      <Button
                        onClick={() => setShowVisualization(false)}
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ← Back to Entry
                      </Button>
                    )}
                    <h3 className="text-lg font-medium">{t("soil-parameters")}</h3>
                  </div>
                  {inputMode === 'upload' && (
                    <Button
                      onClick={() => {
                        setInputMode(null);
                        setSoilReport(null);
                        setShowVisualization(false);
                        setCropRecommendations([]);
                        setCurrentReportId(null);
                      }}
                      variant="outline"
                      className="text-sm"
                    >
                      {t("new-analysis")}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {inputMode === 'upload'
                    ? t("values-extracted")
                    : t("manually-entered-values")
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {soilReport.parameters.map((param, index) => (
                    <Card key={index} className="border-l-4 hover:shadow-md transition-shadow" style={{
                      borderLeftColor: param.status === 'optimal' ? '#4ade80' : param.status === 'low' ? '#fbbf24' : '#f87171'
                    }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{param.name}</h4>
                            <div className="flex items-center">
                              <input 
                                type="number" 
                                value={param.value}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value);
                                  if (!isNaN(newValue)) {
                                    // Create a copy of the soil report
                                    const updatedReport = {...soilReport!};
                                    // Find and update the parameter
                                    const paramIndex = updatedReport.parameters.findIndex(p => p.name === param.name);
                                    if (paramIndex !== -1) {
                                      // Update the value
                                      updatedReport.parameters[paramIndex].value = newValue;
                                      // Update the status
                                      const p = updatedReport.parameters[paramIndex];
                                      if (newValue < p.optimal.min) {
                                        p.status = newValue < p.optimal.min * 0.7 ? "deficient" : "low";
                                      } else if (newValue > p.optimal.max) {
                                        p.status = newValue > p.optimal.max * 1.3 ? "deficient" : "low";
                                      } else {
                                        p.status = "optimal";
                                      }
                                      // Update the state
                                      setSoilReport(updatedReport);

                                      // Also update manual data if in manual mode
                                      if (inputMode === 'manual') {
                                        setManualData(updatedReport.parameters);
                                      }

                                      // Update crop recommendations
                                      generateManualCropRecommendations(updatedReport.parameters, selectedSeason);
                                    }
                                  }
                                }}
                                className="text-2xl font-bold w-24 border-b border-gray-300 focus:border-soil focus:outline-none"
                                aria-label={`${param.name} value`}
                              />
                              <span className="text-sm font-normal text-gray-500 ml-1">{param.unit}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`text-lg ${getStatusColor(param.status)}`}>
                              {getStatusIcon(param.status)}
                            </span>
                            <p className={`text-xs capitalize ${getStatusColor(param.status)}`}>{param.status}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">{t("optimal-range-display").replace("{min}", param.optimal.min.toString()).replace("{max}", param.optimal.max.toString()).replace("{unit}", param.unit)}</div>
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-soil-light to-soil-dark rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(0, (param.value - param.optimal.min) / (param.optimal.max - param.optimal.min) * 100))}%`,
                                }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Soil Data Visualizations */}
                <SoilCharts parameters={soilReport.parameters} />

                {/* AI Insights Panel */}
                <div className="mt-6 rounded-2xl border border-green-200 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">AI Soil Insights</h4>
                        <p className="text-green-100 text-xs">GPT-4o via Puter.js</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Language Toggle */}
                      <div className="flex items-center bg-white/20 rounded-lg p-0.5">
                        <button
                          onClick={() => {
                            setInsightLang('hi');
                            if (aiInsights) handleGetAIInsights('hi');
                          }}
                          className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
                            insightLang === 'hi' ? 'bg-white text-green-700' : 'text-white hover:bg-white/20'
                          }`}
                        >हिंदी</button>
                        <button
                          onClick={() => {
                            setInsightLang('en');
                            if (aiInsights) handleGetAIInsights('en');
                          }}
                          className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
                            insightLang === 'en' ? 'bg-white text-green-700' : 'text-white hover:bg-white/20'
                          }`}
                        >English</button>
                      </div>
                      <Button
                        onClick={() => handleGetAIInsights()}
                        disabled={isLoadingAI}
                        size="sm"
                        className="bg-white text-green-700 hover:bg-green-50 font-semibold rounded-xl disabled:opacity-50 flex items-center gap-1.5 text-xs h-8"
                      >
                        {isLoadingAI ? (
                          <><Loader2 size={13} className="animate-spin" /> {insightLang === 'hi' ? 'विश्लेषण...' : 'Analyzing...'}</>
                        ) : (
                          <><Sparkles size={13} /> {insightLang === 'hi' ? 'AI विश्लेषण' : 'Get AI Insights'}</>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-5 py-4">
                    {!aiInsights && !isLoadingAI && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Sparkles size={22} className="text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-800 mb-1">
                          {insightLang === 'hi' ? 'GPT-4o से AI विश्लेषण पाएं' : 'Get AI-powered soil analysis'}
                        </p>
                        <p className="text-xs text-green-600">
                          {insightLang === 'hi'
                            ? 'आपकी मिट्टी के लिए व्यक्तिगत सलाह, फसल सुझाव और सरकारी योजनाएं'
                            : 'Personalized recommendations, crop suggestions & government schemes'}
                        </p>
                      </div>
                    )}
                    {isLoadingAI && (
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-green-200 animate-ping absolute inset-0"></div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                            <Sparkles size={20} className="text-white" />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-green-800">
                          {insightLang === 'hi' ? 'GPT-4o आपकी मिट्टी का विश्लेषण कर रहा है...' : 'GPT-4o is analyzing your soil...'}
                        </p>
                        <p className="text-xs text-green-600">{insightLang === 'hi' ? '15-20 सेकंड लग सकते हैं' : 'This may take 15–20 seconds'}</p>
                      </div>
                    )}
                    {aiInsights && (
                      <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
                        {renderAIInsights(aiInsights)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Smart Crop Planner — AI + GPS + Weather */}
              <SmartCropPlanner
                soilParams={soilReport.parameters}
                lang={insightLang}
              />



              <div className="mt-6 flex justify-center space-x-4">
                {inputMode === 'manual' && (
                  <Button
                    onClick={() => setShowVisualization(false)}
                    variant="outline"
                    className="border-soil text-soil hover:bg-soil-light/20"
                  >
                    {t("back-to-edit-values")}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setInputMode(null);
                    setSoilReport(null);
                    setShowVisualization(false);
                    setCropRecommendations([]);
                    setCurrentReportId(null);
                    setManualData([]);
                  }}
                  className="bg-soil hover:bg-soil-dark text-white"
                >
                  {t("new-analysis-button")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
