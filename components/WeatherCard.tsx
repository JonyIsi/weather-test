import { WeatherData } from '@/lib/weather';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { location, current, daily } = weather;
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // 获取OpenWeatherMap图标URL
  const getOpenWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.location}>{location.name}</h2>
        <p className={styles.country}>{location.country}</p>
        <p className={styles.coordinates}>
          {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
        </p>
      </div>

      <div className={styles.currentWeather}>
        <div className={styles.temperature}>
          <span className={styles.tempValue}>{Math.round(current.temperature)}°C</span>
          <p className={styles.weatherDescription}>{current.weatherDescription}</p>
        </div>
        <div className={styles.weatherInfo}>
          <div className={styles.weatherIcon}>
            <img 
              src={getOpenWeatherIcon(current.weatherIcon)} 
              alt={current.weatherDescription} 
              width="80" 
              height="80" 
            />
          </div>
          <div className={styles.weatherDetails}>
            <p>体感温度: {Math.round(current.apparentTemperature)}°C</p>
            <p>湿度: {current.humidity}%</p>
            <p>风速: {Math.round(current.windSpeed)} m/s</p>
            <p>降水概率: {current.precipitationProbability}%</p>
          </div>
        </div>
      </div>

      <div className={styles.forecast}>
        <h3 className={styles.forecastTitle}>5天预报</h3>
        <div className={styles.forecastList}>
          {daily.time.map((time, index) => (
            <div key={time} className={styles.forecastDay}>
              <p className={styles.forecastDate}>{formatDate(time)}</p>
              <div className={styles.forecastIcon}>
                <img 
                  src={getOpenWeatherIcon(daily.weatherIcons[index])} 
                  alt={daily.weatherDescriptions[index]} 
                  width="50" 
                  height="50" 
                />
              </div>
              <p className={styles.forecastTemp}>
                {Math.round(daily.temperatureMax[index])}° / {Math.round(daily.temperatureMin[index])}°
              </p>
              <p className={styles.forecastDescription}>{daily.weatherDescriptions[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 