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
    weatherDescription: string;
    weatherIcon: string;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherIcons: string[];
    weatherDescriptions: string[];
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

// 将OpenWeatherMap天气代码转换为我们使用的代码
const mapWeatherCode = (owmId: number): number => {
  // 晴天
  if (owmId >= 800) return 0;
  // 晴间多云
  if (owmId === 801) return 1;
  // 多云
  if (owmId === 802) return 2;
  // 阴天
  if (owmId >= 803 && owmId <= 804) return 3;
  // 雾
  if (owmId >= 701 && owmId <= 762) return 45;
  // 毛毛雨
  if (owmId >= 300 && owmId <= 321) return 51;
  // 雨
  if (owmId >= 500 && owmId <= 531) return 61;
  // 雪
  if (owmId >= 600 && owmId <= 622) return 71;
  // 雷雨
  if (owmId >= 200 && owmId <= 232) return 95;
  
  return 0; // 默认
};

// 从OpenWeatherMap API获取天气数据
export async function fetchRandomWeather(): Promise<WeatherData> {
  const city = getRandomCity();
  const apiKey = 'e580bd7c4bb5ad52ef9b3ed0cbcd7761';
  
  // 获取当前天气
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`;
  const currentResponse = await fetch(currentUrl);
  
  if (!currentResponse.ok) {
    throw new Error('当前天气数据获取失败');
  }
  
  const currentData = await currentResponse.json();
  
  // 获取5天预报
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`;
  const forecastResponse = await fetch(forecastUrl);
  
  if (!forecastResponse.ok) {
    throw new Error('天气预报数据获取失败');
  }
  
  const forecastData = await forecastResponse.json();
  
  // 处理每日预报数据（OpenWeatherMap免费API提供3小时间隔的5天预报）
  // 我们需要将其转换为每日预报
  const dailyData = processDailyForecast(forecastData.list);
  
  // 转换API数据为我们的格式
  return {
    location: {
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lon
    },
    current: {
      temperature: currentData.main.temp,
      apparentTemperature: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      weatherCode: mapWeatherCode(currentData.weather[0].id),
      windSpeed: currentData.wind.speed,
      precipitationProbability: currentData.rain ? 100 : 0, // OpenWeatherMap不直接提供降水概率
      weatherDescription: currentData.weather[0].description,
      weatherIcon: currentData.weather[0].icon
    },
    daily: {
      time: dailyData.dates,
      weatherCode: dailyData.weatherCodes,
      temperatureMax: dailyData.maxTemps,
      temperatureMin: dailyData.minTemps,
      weatherIcons: dailyData.icons,
      weatherDescriptions: dailyData.descriptions
    }
  };
}

// 处理每日预报数据
function processDailyForecast(forecastList: Array<{
  dt_txt: string;
  main: {
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    id: number;
    icon: string;
    description: string;
  }>;
}>) {
  const dailyMap = new Map();
  
  forecastList.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        weatherCode: mapWeatherCode(item.weather[0].id),
        icon: item.weather[0].icon,
        description: item.weather[0].description
      });
    } else {
      const existing = dailyMap.get(date);
      if (item.main.temp_max > existing.maxTemp) {
        existing.maxTemp = item.main.temp_max;
      }
      if (item.main.temp_min < existing.minTemp) {
        existing.minTemp = item.main.temp_min;
      }
      // 使用中午的天气作为当天的天气
      if (item.dt_txt.includes('12:00')) {
        existing.weatherCode = mapWeatherCode(item.weather[0].id);
        existing.icon = item.weather[0].icon;
        existing.description = item.weather[0].description;
      }
      dailyMap.set(date, existing);
    }
  });
  
  const dates: string[] = [];
  const maxTemps: number[] = [];
  const minTemps: number[] = [];
  const weatherCodes: number[] = [];
  const icons: string[] = [];
  const descriptions: string[] = [];
  
  dailyMap.forEach((value, key) => {
    dates.push(key);
    maxTemps.push(value.maxTemp);
    minTemps.push(value.minTemp);
    weatherCodes.push(value.weatherCode);
    icons.push(value.icon);
    descriptions.push(value.description);
  });
  
  return {
    dates,
    maxTemps,
    minTemps,
    weatherCodes,
    icons,
    descriptions
  };
}

// 检查API调用函数
export async function getWeatherData(city: string): Promise<WeatherData> {
  try {
    // 确保API密钥存在
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('API密钥未设置');
    }

    // 使用encodeURIComponent处理城市名称中的特殊字符
    const encodedCity = encodeURIComponent(city);
    
    // 获取当前天气
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=zh_cn`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
      throw new Error(`API请求失败: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 获取5天预报
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${apiKey}&units=metric&lang=zh_cn`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error('天气预报数据获取失败');
    }
    
    const forecastData = await forecastResponse.json();
    
    // 处理每日预报数据
    const dailyData = processDailyForecast(forecastData.list);
    
    // 转换API数据为我们的格式
    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        latitude: currentData.coord.lat,
        longitude: currentData.coord.lon
      },
      current: {
        temperature: currentData.main.temp,
        apparentTemperature: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        weatherCode: mapWeatherCode(currentData.weather[0].id),
        windSpeed: currentData.wind.speed,
        precipitationProbability: currentData.rain ? 100 : 0,
        weatherDescription: currentData.weather[0].description,
        weatherIcon: currentData.weather[0].icon
      },
      daily: {
        time: dailyData.dates,
        weatherCode: dailyData.weatherCodes,
        temperatureMax: dailyData.maxTemps,
        temperatureMin: dailyData.minTemps,
        weatherIcons: dailyData.icons,
        weatherDescriptions: dailyData.descriptions
      }
    };
  } catch (error) {
    console.error('获取天气数据时出错:', error);
    throw new Error('获取天气数据失败，请重试');
  }
} 