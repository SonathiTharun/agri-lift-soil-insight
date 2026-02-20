// ─── 4. AI Crop Plan (Soil + Weather + Location → Full Farm Plan) ────────────

export interface CropPlanItem {
  name: string;
  nameHi: string;
  areaAcres: number;
  yieldQtl: number;
  mspInr: number;
  revenueEst: number;
  fertilizers: string[];
  waterNeed: 'Low' | 'Medium' | 'High';
  suitabilityScore: number;
  growingDays: number;
  bestMonth: string;
  icon: string;
}

export interface AICropPlan {
  kharif: CropPlanItem[];
  rabi: CropPlanItem[];
  zaid: CropPlanItem[];
  summary: string;
  topPick: string;
  totalRevenueEst: number;
}

export async function generateAICropPlan(
  soilParams: { name: string; value: number; unit: string; status: string; optimal: { min: number; max: number } }[],
  weather: { temp: number; humidity: number; rainfall: number; description: string; season: string; city: string },
  location: { district: string; state: string; displayName: string },
  farmAreaAcres: number,
  lang: 'hi' | 'en' = 'hi'
): Promise<AICropPlan> {
  const puter = getPuter();

  const soilText = soilParams
    .map(p => `${p.name}: ${p.value}${p.unit ? ' ' + p.unit : ''} (${p.status})`)
    .join(', ');

  const prompt = `You are an expert Indian agricultural scientist with deep knowledge of Indian soils, crops, MSP prices, and farming practices.

Farm Data:
- Location: ${location.displayName}
- Farm Area: ${farmAreaAcres} acres
- Soil Data: ${soilText}
- Current Weather: ${weather.temp}°C, Humidity: ${weather.humidity}%, Est. Rainfall: ${weather.rainfall}mm, ${weather.description}
- Current Season: ${weather.season} (${new Date().toLocaleString('en-IN', { month: 'long' })})

Generate a comprehensive crop allocation plan. Return ONLY valid JSON (no markdown, no explanation):

{
  "kharif": [
    {
      "name": "English crop name",
      "nameHi": "हिंदी नाम",
      "areaAcres": <0 to ${farmAreaAcres}>,
      "yieldQtl": <realistic quintals per acre for ${location.state} conditions>,
      "mspInr": <real 2024-25 Indian MSP in rupees per quintal>,
      "revenueEst": <areaAcres × yieldQtl × mspInr>,
      "fertilizers": ["DAP X kg/acre", "Urea Y kg/acre"],
      "waterNeed": "Low|Medium|High",
      "suitabilityScore": <0-100 based on soil+weather match>,
      "growingDays": <number>,
      "bestMonth": "Month–Month",
      "icon": "<emoji>"
    }
  ],
  "rabi": [...3-5 crops...],
  "zaid": [...2-3 crops...],
  "summary": "2-3 sentence farm overview in ${lang === 'hi' ? 'Hindi' : 'English'}",
  "topPick": "best single crop name for this farm",
  "totalRevenueEst": <total sum of all revenueEst across all seasons>
}

Rules:
- 3-5 crops per season
- Use REAL 2024-25 Government of India MSP values (e.g. Wheat ₹2275/qtl, Paddy ₹2300/qtl, Maize ₹2225/qtl, etc.)
- Only recommend crops that actually grow in ${location.state}
- Yield estimates must be realistic for ${location.state} clay/loam soils and current weather
- Summary must be in ${lang === 'hi' ? 'Hindi' : 'English'} only`;

  const response = await puter.ai.chat(prompt as any, {
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 2500,
  });

  const raw: string = response.message.content
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  try {
    return JSON.parse(raw) as AICropPlan;
  } catch {
    throw new Error('Failed to parse AI crop plan — unexpected format: ' + raw.slice(0, 200));
  }
}
