// 定义天气数据类型
export interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
    precipitationProbability: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}

// 世界主要城市列表
const cities = [
  { name: "北京", country: "中国", lat: 39.9042, lon: 116.4074 },
  { name: "上海", country: "中国", lat: 31.2304, lon: 121.4737 },
  { name: "广州", country: "中国", lat: 23.1291, lon: 113.2644 },
  { name: "东京", country: "日本", lat: 35.6762, lon: 139.6503 },
  { name: "纽约", country: "美国", lat: 40.7128, lon: -74.0060 },
  { name: "伦敦", country: "英国", lat: 51.5074, lon: -0.1278 },
  { name: "巴黎", country: "法国", lat: 48.8566, lon: 2.3522 },
  { name: "悉尼", country: "澳大利亚", lat: -33.8688, lon: 151.2093 },
  { name: "莫斯科", country: "俄罗斯", lat: 55.7558, lon: 37.6173 },
  { name: "开罗", country: "埃及", lat: 30.0444, lon: 31.2357 },
  { name: "里约热内卢", country: "巴西", lat: -22.9068, lon: -43.1729 },
  { name: "开普敦", country: "南非", lat: -33.9249, lon: 18.4241 },
  { name: "孟买", country: "印度", lat: 19.0760, lon: 72.8777 },
  { name: "迪拜", country: "阿联酋", lat: 25.2048, lon: 55.2708 },
  { name: "新加坡", country: "新加坡", lat: 1.3521, lon: 103.8198 },
  { name: "曼谷", country: "泰国", lat: 13.7563, lon: 100.5018 },
  { name: "柏林", country: "德国", lat: 52.5200, lon: 13.4050 },
  { name: "马德里", country: "西班牙", lat: 40.4168, lon: -3.7038 },
  { name: "罗马", country: "意大利", lat: 41.9028, lon: 12.4964 },
  { name: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
];

// 获取随机城市
const getRandomCity = () => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

// 从Open-Meteo API获取天气数据
export async function fetchRandomWeather(): Promise<WeatherData> {
  const city = getRandomCity();
  
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.append('latitude', city.lat.toString());
  url.searchParams.append('longitude', city.lon.toString());
  url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m');
  url.searchParams.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
  url.searchParams.append('timezone', 'auto');
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('天气数据获取失败');
  }
  
  const data = await response.json();
  
  // 转换API数据为我们的格式
  return {
    location: {
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lon
    },
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      precipitationProbability: data.current.precipitation_probability
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min
    }
  };
} 