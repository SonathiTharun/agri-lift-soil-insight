/**
 * SmartCropPlanner.tsx
 * AI-powered crop planning: Leaflet (OpenStreetMap) location picker → OpenWeatherMap → GPT-4o crop plan
 */
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Sparkles, Thermometer, Droplets, Wind, TrendingUp, Leaf, ChevronDown, ChevronUp, IndianRupee, BarChart3, Search } from 'lucide-react';
import { getWeatherData, reverseGeocode, searchLocation, WeatherContext, LocationInfo } from '@/services/weatherService';
import { generateAICropPlan, AICropPlan, CropPlanItem } from '@/services/aiService';
import Field3D from './crop-allocation/Field3D';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  soilParams: { name: string; value: number; unit: string; status: string; optimal: { min: number; max: number } }[];
  lang?: 'hi' | 'en';
}

type PlannerStep = 'location' | 'area' | 'result';

// Component to handle map clicks and updates
function LocationMarker({ position, onLocationFound }: { position: [number, number] | null, onLocationFound: (lat: number, lon: number) => void }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onLocationFound(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { animate: true });
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

export function SmartCropPlanner({ soilParams, lang = 'hi' }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<PlannerStep>('location');
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [farmArea, setFarmArea] = useState<number>(5);
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares'>('acres');
  const [generating, setGenerating] = useState(false);
  const [cropPlan, setCropPlan] = useState<AICropPlan | null>(null);
  const [planSeason, setPlanSeason] = useState<'kharif' | 'rabi' | 'zaid'>('kharif');
  const [error, setError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  const farmAreaAcres = areaUnit === 'hectares' ? farmArea * 2.471 : farmArea;

  const s = (hi: string, en: string) => lang === 'hi' ? hi : en;

  // Initial load - try to get user location or default to center of India
  useEffect(() => {
    if (open && !location) {
        // Default center: India (Nagpur)
        setCurrentPosition([21.1458, 79.0882]);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setWeatherLoading(true);
    setError(null);
    try {
      const results = await searchLocation(searchQuery);
      if (results.length > 0) {
        const first = results[0];
        await fetchLocationAndWeather(first.lat, first.lon);
      } else {
        setError(s('स्थान नहीं मिला', 'Location not found'));
      }
    } catch (e: any) {
      setError(e.message || 'Search failed');
    } finally {
        setWeatherLoading(false);
    }
  };

  const fetchLocationAndWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);
    setError(null);
    try {
      const [locInfo, weatherData] = await Promise.all([
        reverseGeocode(lat, lon),
        getWeatherData(lat, lon),
      ]);
      setLocation(locInfo);
      setWeather(weatherData);
      setCurrentPosition([lat, lon]);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch location/weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!location || !weather) return;
    setGenerating(true);
    setError(null);
    setCropPlan(null);
    try {
      const plan = await generateAICropPlan(soilParams, weather, location, farmAreaAcres, lang);
      setCropPlan(plan);
      setStep('result');
      // Auto-select the current farming season
      setPlanSeason(weather.season);
    } catch (e: any) {
      setError(e.message || 'AI crop plan generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const seasonLabel = (s: string) => {
    const labels: Record<string, string> = {
      kharif: lang === 'hi' ? '🌧️ खरीफ' : '🌧️ Kharif',
      rabi: lang === 'hi' ? '🌾 रबी' : '🌾 Rabi',
      zaid: lang === 'hi' ? '☀️ जायद' : '☀️ Zaid',
    };
    return labels[s] ?? s;
  };

  const waterDot = (w: string) => ({
    Low: '🟡', Medium: '🔵', High: '💧',
  } as Record<string, string>)[w] ?? '🔵';

  return (
    <div className="mt-8 rounded-2xl border-2 border-dashed border-green-300 overflow-hidden">
      {/* Header Banner */}
      <button
        className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 px-6 py-4 flex items-center justify-between text-white hover:brightness-105 transition-all"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-base">{s('🌾 स्मार्ट फसल योजनाकार', '🌾 Smart Crop Planner')}</p>
            <p className="text-green-100 text-xs">{s('AI + GPS + मौसम → सटीक फसल योजना', 'AI + GPS + Weather → Precise Crop Plan')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">GPT-4o + Maps</span>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {open && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5">
          {/* STEP 1 — Location Picker */}
          {(step === 'location' || step === 'area') && (
            <div className="space-y-4">
              {/* Progress Tabs */}
              <div className="flex gap-2 mb-4">
                {['location', 'area'].map((s, i) => (
                  <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    step === s ? 'bg-green-600 text-white shadow-sm' :
                    (step === 'area' && i === 0) ? 'bg-green-200 text-green-800' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <span>{i + 1}</span>
                    <span>{i === 0 ? (lang === 'hi' ? 'खेत का स्थान' : 'Farm Location') : (lang === 'hi' ? 'खेत का क्षेत्र' : 'Farm Area')}</span>
                  </div>
                ))}
              </div>

              {step === 'location' && (
                <>
                  {/* Search box */}
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                        <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={s('गाँव / जिला / पिनकोड खोजें...', 'Search village / district / pincode...')}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                        aria-label={lang === 'hi' ? 'स्थान खोजें' : 'Search location'}
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={weatherLoading} className="bg-green-600 text-white hover:bg-green-700">
                        {weatherLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                    </Button>
                  </div>

                  {/* Map */}
                  <div className="relative rounded-xl overflow-hidden border border-green-200 shadow-md h-80 z-0">
                    <MapContainer 
                        center={[20.5937, 78.9629]} 
                        zoom={5} 
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker 
                            position={currentPosition} 
                            onLocationFound={(lat, lon) => fetchLocationAndWeather(lat, lon)} 
                        />
                    </MapContainer>
                    
                    {!location && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-4 py-1.5 text-xs text-gray-600 shadow pointer-events-none z-[400]">
                        📍 {s('नक्शे पर क्लिक करें या ऊपर खोजें', 'Click on map or search above')}
                      </div>
                    )}
                  </div>

                  {/* Weather & Location Result */}
                  {weatherLoading && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 rounded-xl p-3">
                      <Loader2 size={14} className="animate-spin" />
                      {s('स्थान और मौसम जानकारी लोड हो रही है...', 'Fetching location and weather...')}
                    </div>
                  )}

                  {location && weather && !weatherLoading && (
                    <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={15} className="text-green-600" />
                        <p className="font-semibold text-green-900 text-sm">{location.displayName}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-1.5 bg-orange-50 rounded-lg p-2">
                          <Thermometer size={14} className="text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">{s('तापमान', 'Temp')}</p>
                            <p className="font-bold text-sm text-gray-800">{weather.temp}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg p-2">
                          <Droplets size={14} className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">{s('नमी', 'Humidity')}</p>
                            <p className="font-bold text-sm text-gray-800">{weather.humidity}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 rounded-lg p-2">
                          <Wind size={14} className="text-green-500" />
                          <div>
                            <p className="text-xs text-gray-500">{s('मौसम', 'Season')}</p>
                            <p className="font-bold text-sm text-gray-800 capitalize">{weather.season}</p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 italic capitalize">🌤️ {weather.description}, {weather.city}</p>
                    </div>
                  )}

                  {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">⚠️ {error}</p>}

                  <Button
                    onClick={() => setStep('area')}
                    disabled={!location || !weather}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    {s('अगला: खेत का क्षेत्र', 'Next: Farm Area')} →
                  </Button>
                </>
              )}

              {/* STEP 2 — Farm Area */}
              {step === 'area' && (
                <div className="space-y-5">
                  {/* Location summary */}
                  <div className="bg-green-100 rounded-xl p-3 flex items-center gap-2">
                    <MapPin size={14} className="text-green-700" />
                    <p className="text-sm text-green-800 font-medium">{location?.displayName}</p>
                    <button className="ml-auto text-xs text-green-600 underline" onClick={() => setStep('location')}>
                      {s('बदलें', 'Change')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {s('खेत का क्षेत्रफल कितना है?', 'What is your farm area?')}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min={0.5}
                        max={1000}
                        step={0.5}
                        value={farmArea}
                        onChange={e => setFarmArea(Number(e.target.value))}
                        className="flex-1 border border-green-200 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                        aria-label={lang === 'hi' ? 'खेत का क्षेत्रफल' : 'Farm Area'}
                      />
                      <div className="flex rounded-xl border border-green-200 overflow-hidden bg-white">
                        {(['acres', 'hectares'] as const).map(u => (
                          <button
                            key={u}
                            onClick={() => setAreaUnit(u)}
                            className={`px-4 py-2 text-sm font-semibold transition-all ${areaUnit === u ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}
                          >
                            {u === 'acres' ? (lang === 'hi' ? 'एकड़' : 'Acres') : (lang === 'hi' ? 'हेक्टेयर' : 'Hectares')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {areaUnit === 'hectares' ? `≈ ${(farmArea * 2.471).toFixed(1)} acres` : `≈ ${(farmArea * 0.4047).toFixed(1)} hectares`}
                    </p>
                  </div>

                  {/* Quick presets */}
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 5, 10, 25].map(n => (
                      <button
                        key={n}
                        onClick={() => setFarmArea(n)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${farmArea === n ? 'bg-green-600 text-white border-green-600' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                      >
                        {n} {lang === 'hi' ? 'एकड़' : 'ac'}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleGeneratePlan}
                    disabled={generating || farmArea <= 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold py-3 disabled:opacity-50 text-base"
                  >
                    {generating ? (
                      <><Loader2 size={18} className="animate-spin mr-2" />
                        {s('GPT-4o फसल योजना बना रहा है...', 'GPT-4o is crafting your plan...')}</>
                    ) : (
                      <><Sparkles size={18} className="mr-2" />
                        {s('AI फसल योजना बनाएं', 'Generate AI Crop Plan')}</>
                    )}
                  </Button>

                  {generating && (
                    <div className="text-center text-sm text-green-700 animate-pulse">
                      {s('मिट्टी + मौसम + स्थान का विश्लेषण...', 'Analyzing soil + weather + location...')}
                    </div>
                  )}
                  {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">⚠️ {error}</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Results */}
          {step === 'result' && cropPlan && (
            <div className="space-y-4">
              {/* 3D Holographic Field */}
              <div className="mb-6 rounded-2xl overflow-hidden border border-green-500/30 shadow-2xl bg-black">
                 <Field3D
                  crops={(cropPlan[planSeason] ?? []).map((item: any) => ({
                    id: item.name.toLowerCase().split(' ')[0], 
                    name: item.name,
                    area: item.areaAcres,
                    percentage: farmArea > 0 ? (item.areaAcres / farmArea) * 100 : 0,
                    estimatedYield: (item.yieldQtl * item.areaAcres) / 10
                  }))}
                  rotationEnabled={true}
                />
              </div>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">{s('टॉप फसल', 'Top Pick')}</p>
                  <p className="font-bold text-green-800 text-sm">{cropPlan.topPick}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">{s('कुल कमाई', 'Total Revenue')}</p>
                  <p className="font-bold text-green-800 text-sm">₹{(cropPlan.totalRevenueEst / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">{s('खेत', 'Farm')}</p>
                  <p className="font-bold text-green-800 text-sm">{farmAreaAcres.toFixed(1)} ac</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed">{cropPlan.summary}</p>
              </div>

              {/* Season Tabs */}
              <div className="flex gap-1.5 bg-green-100 rounded-xl p-1">
                {(['kharif', 'rabi', 'zaid'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setPlanSeason(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${planSeason === s ? 'bg-white text-green-700 shadow-sm' : 'text-green-600 hover:bg-white/50'}`}
                  >
                    {seasonLabel(s)}
                  </button>
                ))}
              </div>

              {/* Current Season Weather Badge */}
              {weather && (
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">🌡️ {weather.temp}°C</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">💧 {weather.humidity}%</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">📍 {location?.district}</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium capitalize">🗓️ {weather.season}</span>
                </div>
              )}

              {/* Crop Cards */}
              <div className="space-y-3">
                {(cropPlan[planSeason] ?? []).map((crop: CropPlanItem, i: number) => (
                  <div key={i} className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
                    <div className="flex items-start p-4">
                      <span className="text-3xl mr-3 leading-none">{crop.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-gray-900">{crop.name}</p>
                            <p className="text-xs text-gray-500">{crop.nameHi}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Suitability Score */}
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-xs font-bold text-green-700">{crop.suitabilityScore}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress bar for suitability */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ width: `${crop.suitabilityScore}%` }}
                          />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                          <div className="flex items-center gap-1">
                            <BarChart3 size={11} className="text-blue-500 flex-shrink-0" />
                            <span className="text-gray-500">{lang === 'hi' ? 'क्षेत्र:' : 'Area:'}</span>
                            <span className="font-semibold text-gray-800">{crop.areaAcres} ac</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={11} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-500">{lang === 'hi' ? 'उपज:' : 'Yield:'}</span>
                            <span className="font-semibold text-gray-800">{crop.yieldQtl} qtl/ac</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupee size={11} className="text-yellow-600 flex-shrink-0" />
                            <span className="text-gray-500">MSP:</span>
                            <span className="font-semibold text-gray-800">₹{crop.mspInr}/qtl</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{waterDot(crop.waterNeed)}</span>
                            <span className="text-gray-500">{lang === 'hi' ? 'पानी:' : 'Water:'}</span>
                            <span className="font-semibold text-gray-800">
                              {lang === 'hi' ? { Low: 'कम', Medium: 'मध्यम', High: 'अधिक' }[crop.waterNeed] : crop.waterNeed}
                            </span>
                          </div>
                        </div>

                        {/* Revenue Highlight */}
                        <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 flex items-center justify-between">
                          <span className="text-xs text-green-700 font-medium">{lang === 'hi' ? 'अनुमानित कमाई' : 'Est. Revenue'}</span>
                          <span className="text-base font-bold text-green-800">₹{crop.revenueEst.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Fertilizers */}
                        {crop.fertilizers?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">{lang === 'hi' ? '🧪 खाद:' : '🧪 Fertilizers:'}</p>
                            <div className="flex flex-wrap gap-1">
                              {crop.fertilizers.map((f, fi) => (
                                <span key={fi} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2 py-0.5 rounded-full">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          📅 {crop.bestMonth} · {crop.growingDays} {lang === 'hi' ? 'दिन' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regenerate + New Plan */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { setStep('area'); setCropPlan(null); }}
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 rounded-xl"
                >
                  {s('नई योजना', 'New Plan')}
                </Button>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={generating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold"
                >
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <><Sparkles size={14} className="mr-1" />{s('फिर से', 'Refresh')}</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
