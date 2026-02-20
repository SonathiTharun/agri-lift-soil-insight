const OW_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

export interface WeatherContext {
  temp: number;
  humidity: number;
  rainfall: number;
  description: string;
  season: 'kharif' | 'rabi' | 'zaid';
  windSpeed: number;
  forecast: ForecastDay[];
  city: string;
  country: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  rain: number;
}

export interface LocationInfo {
  lat: number;
  lon: number;
  district: string;
  state: string;
  country: string;
  displayName: string;
}

function getIndianSeason(month: number): 'kharif' | 'rabi' | 'zaid' {
  // Kharif: June to October (6-10)
  // Rabi: November to March (11, 12, 1, 2, 3)
  // Zaid: April to May (4, 5)
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 4 && month <= 5) return 'zaid';
  return 'rabi';
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherContext> {
  const [currRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric&cnt=40`),
  ]);

  if (!currRes.ok || !forecastRes.ok) {
    throw new Error('Weather API request failed — check API key or quota');
  }

  const curr = await currRes.json();
  const forecast = await forecastRes.json();

  // Summarise 5-day forecast (one entry per day)
  const dailyMap: Record<string, ForecastDay> = {};
  for (const item of forecast.list as any[]) {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        description: item.weather[0].description,
        rain: item.rain?.['3h'] ?? 0,
      };
    } else {
      dailyMap[date].tempMin = Math.min(dailyMap[date].tempMin, item.main.temp_min);
      dailyMap[date].tempMax = Math.max(dailyMap[date].tempMax, item.main.temp_max);
      dailyMap[date].rain += item.rain?.['3h'] ?? 0;
    }
  }
  const forecastDays = Object.values(dailyMap).slice(0, 7);

  const month = new Date().getMonth() + 1;

  return {
    temp: Math.round(curr.main.temp),
    humidity: curr.main.humidity,
    rainfall: Math.round(forecastDays.reduce((s, d) => s + d.rain, 0)),
    description: curr.weather[0].description,
    season: getIndianSeason(month),
    windSpeed: curr.wind.speed,
    forecast: forecastDays,
    city: curr.name,
    country: curr.sys.country,
  };
}

// Search for a location by name (Direct Geocoding)
export async function searchLocation(query: string): Promise<LocationInfo[]> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)},IN&limit=5&appid=${OW_KEY}`;
  const res = await fetch(url);
  
  if (!res.ok) throw new Error('Location search failed');
  
  const data = await res.json();
  if (!data || data.length === 0) return [];

  return data.map((item: any) => ({
    lat: item.lat,
    lon: item.lon,
    district: item.name,
    state: item.state || '',
    country: item.country,
    displayName: `${item.name}, ${item.state ? item.state + ', ' : ''}${item.country}`
  }));
}

// Get location details from coordinates (Reverse Geocoding)
export async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OW_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || !data || !data.length) {
    // Fallback if API fails or returns no results
    return {
      lat, lon,
      district: 'Unknown Location',
      state: '',
      country: 'IN',
      displayName: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    };
  }

  const loc = data[0];
  return {
    lat,
    lon,
    district: loc.name,
    state: loc.state || '',
    country: loc.country,
    displayName: [loc.name, loc.state, loc.country].filter(Boolean).join(', '),
  };
}
