// 根据WMO天气代码返回对应的天气图标
export function getWeatherIcon(code: number): string {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  
  // 晴天
  if (code === 0) {
    return '☀️';
  }
  
  // 晴间多云
  if (code === 1) {
    return '🌤️';
  }
  
  // 多云
  if (code === 2) {
    return '⛅';
  }
  
  // 阴天
  if (code === 3) {
    return '☁️';
  }
  
  // 雾
  if (code >= 45 && code <= 48) {
    return '🌫️';
  }
  
  // 毛毛雨
  if (code >= 51 && code <= 55) {
    return '🌦️';
  }
  
  // 雨
  if ((code >= 56 && code <= 65) || (code >= 80 && code <= 82)) {
    return '🌧️';
  }
  
  // 雪
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return '❄️';
  }
  
  // 雷雨
  if (code >= 95 && code <= 99) {
    return '⛈️';
  }
  
  // 默认
  return '🌈';
} 