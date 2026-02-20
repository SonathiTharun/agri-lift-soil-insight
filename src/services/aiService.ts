/**
 * AI Service using Puter.js
 * Free, unlimited access to GPT-4o (latest) via Puter.com — no API key needed.
 * All AI prompts are tuned for Indian farming, Indian soil types, and Indian crop varieties.
 */

// Declare the global puter object injected by the CDN script
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          message:
            | string
            | {
                role: string;
                content:
                  | string
                  | { type: string; text?: string; image_url?: { url: string } }[];
              }[],
          options?: {
            model?: string;
            stream?: boolean;
            temperature?: number;
            max_tokens?: number;
          }
        ) => Promise<{ message: { content: string } }>;
        txt2img: (prompt: string, options?: { model?: string }) => Promise<string>;
        txt2speech: (text: string) => Promise<Blob>;
      };
    };
    pdfjsWorkerSrc: string;
    pdfjsLib: {
      getDocument: (src: string | ArrayBuffer | { data: ArrayBuffer }) => {
        promise: Promise<{
          numPages: number;
          getPage: (pageNumber: number) => Promise<{
            getViewport: (opts: { scale: number }) => { width: number; height: number };
            render: (ctx: { canvasContext: CanvasRenderingContext2D; viewport: any }) => { promise: Promise<void> };
          }>;
        }>;
      };
      GlobalWorkerOptions: { workerSrc: string };
    };
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SoilParameter {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'low' | 'deficient';
  optimal: { min: number; max: number };
  extracted: boolean; // true = read from card by AI, false = defaulted
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Converts a JPEG/PNG/WEBP File to a base64 data URL */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts the first page of a PDF file to a base64 PNG using PDF.js.
 * Dynamically imports PDF.js from CDN if not already loaded.
 */
async function pdfToBase64(file: File): Promise<string> {
  // Dynamically load PDF.js if not yet available as a global
  if (!window.pdfjsLib) {
    // Use the ESM import from the CDN
    const pdfjs = await import(
      /* @vite-ignore */
      // @ts-ignore — CDN URL module, works at runtime in browser
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs'
    ) as any;
    window.pdfjsLib = pdfjs;
    pdfjs.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
  } else {
    // Ensure worker is configured
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
  }

  // Read the PDF file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  // Render the first page at 2x scale for better OCR quality
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;

  // Return as PNG data URL
  return canvas.toDataURL('image/png');
}

function getPuter() {
  if (!window.puter) {
    throw new Error(
      'Puter.js is not loaded. Please check your internet connection.'
    );
  }
  return window.puter;
}

// ─── 1. AgriBot Chat ────────────────────────────────────────────────────────

const AGRIBOT_SYSTEM_PROMPT = `Tu AgriBot hai — Agri-Lift Soil Insight platform ka desi AI farming expert.
Tu ek pakka Indian agricultural advisor hai jo Bharat ke kisan bhaion ki madad karta hai.

Teri specialties:
- Bharat ke alag-alag mitti ke prakar: Alluvial (Gangetic plains), Red (Deccan), Black Cotton (Maharashtra, MP), Laterite (Kerala, Assam), Desert (Rajasthan), Saline/Alkaline
- Fasal gyan: Kharif (Dhan, Makka, Kapas, Ganna, Moong, Arhar), Rabi (Gehun, Jau, Sarson, Chana, Masoor), Zaid (Tarbuz, Kakdi, Moong)
- Aam khaad: DAP, Urea, MOP (Muriate of Potash), SSP, Vermi Compost, Gober ki Khaad, Neem Coated Urea, Zinc Sulphate
- Sarkari yojanaein: PM Kisan, Soil Health Card Scheme, PMFBY (fasal bima), PM Krishi Sinchai Yojana, National Mission for Sustainable Agriculture
- Bharat ki jalawayu ke hisaab se Kharif (June-Nov), Rabi (Oct-Mar), Zaid (Mar-Jun) ki salah
- Rashtriya aur rajya-star ki mandi qeemten aur MSP (Minimum Support Price)
- Jeevamrit, Beejamrit jaise natural khaad ke tarike

Baat karne ka tarika:
- Dono Hindi aur English mein jawaab de — jo user use kare
- Simple, seedha, aur aam kisan ki samajh mein aane wali bhasha
- Har baar thoda encouraging bhi reh — "Bilkul ho sakta hai bhai!"
- Practical steps dena — sirf theory nahi
- Local names use karna (Nai Khad = Vermi, Ganda Ki Khaad = FYM etc.)
- Responses short aur targeted rakho — kisan ke paas time nahi hota`;

export async function chat(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const puter = getPuter();

  const messages = [
    { role: 'system', content: AGRIBOT_SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const response = await puter.ai.chat(messages as any, {
    model: 'gpt-4o',        // latest GPT-4o
    temperature: 0.75,
    max_tokens: 600,
  });

  return response.message.content;
}

// ─── 2. Vision: Extract soil data from uploaded card image ──────────────────

const EXTRACTION_SYSTEM_PROMPT = `You are an expert at reading Indian Soil Health Cards (Mitti Swasthya Patra) issued by the Government of India under the Soil Health Card Scheme.
Extract ALL soil parameters from the image and return ONLY a valid JSON object — no markdown, no explanation, just raw JSON.

Required JSON format:
{
  "ph": <number or null>,
  "nitrogen": <number in kg/ha or null>,
  "phosphorus": <number in kg/ha or null>,
  "potassium": <number in kg/ha or null>,
  "organicCarbon": <number in % or null>,
  "sulphur": <number in kg/ha or null>,
  "zinc": <number in kg/ha or null>,
  "boron": <number in kg/ha or null>,
  "iron": <number in kg/ha or null>,
  "manganese": <number in kg/ha or null>,
  "copper": <number in kg/ha or null>,
  "moisture": <number in % or null>,
  "ec": <number in dS/m or null>,
  "farmerName": "<string or null>",
  "village": "<string or null>",
  "district": "<string or null>",
  "state": "<string or null>",
  "surveyNumber": "<string or null>",
  "sampleDate": "<string or null>"
}

Rules:
- All numeric values must be plain numbers (e.g. 6.5, not "6.5")
- Use null for any parameter not visible in the card
- Indian Soil Health Cards often show N/P/K as Low/Medium/High ratings — convert them: Low=40, Medium=120, High=220 for N; Low=10, Medium=25, High=45 for P; Low=80, Medium=180, High=300 for K
- OC (Organic Carbon) = Organic Matter / 1.724
- pH scale is 1-14
- Return ONLY the JSON object, nothing else`;

/** Optimal ranges for Indian soils as per ICAR recommendations */
const OPTIMAL_RANGES: Record<string, { min: number; max: number; unit: string; label: string }> = {
  ph:            { min: 6.0,  max: 7.5,  unit: '',       label: 'pH' },
  nitrogen:      { min: 80,   max: 200,  unit: 'kg/ha',  label: 'Nitrogen (N)' },
  phosphorus:    { min: 15,   max: 40,   unit: 'kg/ha',  label: 'Phosphorus (P)' },
  potassium:     { min: 120,  max: 280,  unit: 'kg/ha',  label: 'Potassium (K)' },
  organicCarbon: { min: 0.5,  max: 2.0,  unit: '%',      label: 'Organic Carbon' },
  sulphur:       { min: 10,   max: 30,   unit: 'kg/ha',  label: 'Sulphur (S)' },
  zinc:          { min: 0.6,  max: 3.0,  unit: 'mg/kg',  label: 'Zinc (Zn)' },
  boron:         { min: 0.5,  max: 2.0,  unit: 'mg/kg',  label: 'Boron (B)' },
  iron:          { min: 4.5,  max: 15.0, unit: 'mg/kg',  label: 'Iron (Fe)' },
  manganese:     { min: 2.0,  max: 10.0, unit: 'mg/kg',  label: 'Manganese (Mn)' },
  copper:        { min: 0.2,  max: 1.5,  unit: 'mg/kg',  label: 'Copper (Cu)' },
  moisture:      { min: 25,   max: 45,   unit: '%',       label: 'Moisture' },
  ec:            { min: 0,    max: 1.0,  unit: 'dS/m',   label: 'EC (Salinity)' },
};

function determineStatus(
  value: number,
  optimal: { min: number; max: number }
): 'optimal' | 'low' | 'deficient' {
  if (value >= optimal.min && value <= optimal.max) return 'optimal';
  if (value < optimal.min) {
    return value < optimal.min * 0.6 ? 'deficient' : 'low';
  }
  // above max — treat as low (excess noted) for simplicity
  return 'low';
}

/**
 * Use GPT-4o vision to extract soil parameters from an uploaded file.
 * Supports JPEG, PNG, WEBP, and PDF (PDF first page is rendered to image via PDF.js).
 */
export async function extractSoilDataFromImage(file: File): Promise<{
  parameters: SoilParameter[];
  meta: {
    farmerName: string | null;
    village: string | null;
    district: string | null;
    state: string | null;
    surveyNumber: string | null;
    sampleDate: string | null;
  };
  extractedCount: number;
}> {
  const puter = getPuter();

  // Auto-detect PDF and convert first page to image; otherwise use image as-is
  const base64DataUrl =
    file.type === 'application/pdf'
      ? await pdfToBase64(file)
      : await fileToBase64(file);

  const messages = [
    {
      role: 'system',
      content: EXTRACTION_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: base64DataUrl },
        },
        {
          type: 'text',
          text: 'Extract all soil parameters from this Indian Soil Health Card and return the JSON as instructed.',
        },
      ],
    },
  ];


  const response = await puter.ai.chat(messages as any, {
    model: 'gpt-4o',
    temperature: 0,       // deterministic extraction
    max_tokens: 800,
  });

  // Parse the JSON response
  let raw: Record<string, number | string | null>;
  try {
    const text = response.message.content.trim();
    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    raw = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'AI could not parse the soil card. Please ensure the image is clear and try again.'
    );
  }

  // Build SoilParameter[] from known numeric fields
  const numericKeys = [
    'ph', 'nitrogen', 'phosphorus', 'potassium', 'organicCarbon',
    'sulphur', 'zinc', 'boron', 'iron', 'manganese', 'copper', 'moisture', 'ec',
  ];

  const parameters: SoilParameter[] = [];
  let extractedCount = 0;

  for (const key of numericKeys) {
    const optimal = OPTIMAL_RANGES[key];
    if (!optimal) continue;

    const rawValue = raw[key];
    const isExtracted = rawValue !== null && rawValue !== undefined;
    const value = isExtracted ? Number(rawValue) : getDefaultValue(key);

    if (isExtracted) extractedCount++;

    const status = determineStatus(value, optimal);

    parameters.push({
      name: optimal.label,
      value,
      unit: optimal.unit,
      status,
      optimal,
      extracted: isExtracted,
    });
  }

  return {
    parameters,
    meta: {
      farmerName: (raw.farmerName as string) || null,
      village: (raw.village as string) || null,
      district: (raw.district as string) || null,
      state: (raw.state as string) || null,
      surveyNumber: (raw.surveyNumber as string) || null,
      sampleDate: (raw.sampleDate as string) || null,
    },
    extractedCount,
  };
}

/** Conservative Indian average defaults for fields not found in card */
function getDefaultValue(key: string): number {
  const defaults: Record<string, number> = {
    ph: 6.8, nitrogen: 120, phosphorus: 22, potassium: 160,
    organicCarbon: 0.6, sulphur: 12, zinc: 0.8, boron: 0.6,
    iron: 5.5, manganese: 3.0, copper: 0.3, moisture: 30, ec: 0.4,
  };
  return defaults[key] ?? 0;
}

// ─── 3. AI Soil Insights ─────────────────────────────────────────────────────

export async function analyzeSoilWithAI(
  soilParameters: {
    name: string;
    value: number;
    unit: string;
    status: string;
    optimal: { min: number; max: number };
  }[],
  lang: 'hi' | 'en' = 'hi'
): Promise<string> {
  const puter = getPuter();

  const soilDataText = soilParameters
    .map(
      (p) =>
        `- ${p.name}: ${p.value}${p.unit ? ' ' + p.unit : ''} [${p.status}, Ideal: ${p.optimal.min}–${p.optimal.max}${p.unit ? ' ' + p.unit : ''}]`
    )
    .join('\n');

  const prompt = lang === 'hi'
    ? `Tu ek expert mitti vaigyanik (Soil Scientist) aur Indian agricultural advisor hai. Neeche ki mitti ka data dekh aur Bharat ke kisan ke liye SIRF HINDI mein practical jawab de.

Mitti ka Data:
${soilDataText}

Apna jawab BILKUL is format mein de (yahi markdown use karo):

## 🌱 मिट्टी की सेहत
(2-3 sentences mein overall condition batao — simple Hindi mein)

## ⚠️ मुख्य समस्याएं
- (Har ek problem clearly likho — koi bhi parameter jo range se bahar hai)

## 🔧 सुधार के उपाय
### खाद और संशोधन
- (DAP, Urea, MOP, Neem Coated Urea, Zinc Sulphate, Gober ki Khaad etc. ke specific doses)

### खेती के तरीके
- (Crop rotation, deep plowing, green manuring jaise upay)

## 🌾 सबसे अच्छी फसलें
- **खरीफ:** (Dhan, Makka, Kapas, Moong, Arhar etc.)
- **रबी:** (Gehun, Chana, Sarson, Masoor etc.)
- **जायद:** (Tarbuz, Kakdi, Moong etc.)

## 🏛️ सरकारी मदद
- (PM Kisan, Soil Health Card Scheme, PMFBY, PM Krishi Sinchai Yojana etc.)

Sirf Hindi mein likho. Koi English heading mat use karo (except fertilizer/crop names). Simple aur seedhi bhasha rakho jo kisan samajh sake.`
    : `You are an expert soil scientist and agricultural advisor specializing in Indian farming. Analyze the following soil data and provide practical advice in clean, structured English.

Soil Data:
${soilDataText}

Use EXACTLY this markdown format:

## 🌱 Soil Health Summary
(2-3 sentences on overall soil condition)

## ⚠️ Key Issues
- (Each parameter out of optimal range, with Indian context)

## 🔧 Action Steps
### Fertilizers & Amendments
- (Specific doses of DAP, Urea, MOP, Zinc Sulphate, FYM, Neem Coated Urea etc.)

### Farming Practices
- (Crop rotation, deep plowing, green manuring etc.)

## 🌾 Best Crops for Your Soil
- **Kharif:** (Paddy, Maize, Cotton, Moong, Arhar etc.)
- **Rabi:** (Wheat, Chickpea, Mustard, Lentil etc.)
- **Zaid:** (Watermelon, Cucumber, Moong etc.)

## 🏛️ Government Support
- (PM Kisan, Soil Health Card Scheme, PMFBY, PM Krishi Sinchai Yojana etc.)

Keep it practical and actionable for Indian farmers. Use fertilizer and crop names they know.`;

  const response = await puter.ai.chat(prompt as any, {
    model: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 1200,
  });

  return response.message.content;
}

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

  const langLabel = lang === 'hi' ? 'Hindi' : 'English';

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
      "revenueEst": <areaAcres times yieldQtl times mspInr>,
      "fertilizers": ["DAP X kg/acre", "Urea Y kg/acre"],
      "waterNeed": "Low|Medium|High",
      "suitabilityScore": <0-100 based on soil and weather match>,
      "growingDays": <number>,
      "bestMonth": "Month to Month",
      "icon": "<single emoji>"
    }
  ],
  "rabi": [ ...3-5 crops... ],
  "zaid": [ ...2-3 crops... ],
  "summary": "2-3 sentence overview in ${langLabel}",
  "topPick": "best single crop name for this farm",
  "totalRevenueEst": <sum of all revenueEst across all seasons>
}

Rules:
- 3-5 crops per season
- Use REAL 2024-25 Government of India MSP values (Wheat=2275, Paddy=2300, Maize=2225, Soybean=4892, Cotton=7121, Groundnut=6783 per quintal etc.)
- Only recommend crops that actually grow in ${location.state}
- Yield must be realistic for ${location.state} soil and current weather
- Summary must be in ${langLabel} only`;

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
    throw new Error('Failed to parse AI crop plan: ' + raw.slice(0, 200));
  }
}
