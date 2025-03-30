import { WeatherData } from '@/lib/weather';
import { getWeatherIcon } from '@/lib/weatherIcons';
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
        </div>
        <div className={styles.weatherInfo}>
          <div className={styles.weatherIcon}>
            {getWeatherIcon(current.weatherCode)}
          </div>
          <div className={styles.weatherDetails}>
            <p>体感温度: {Math.round(current.apparentTemperature)}°C</p>
            <p>湿度: {current.humidity}%</p>
            <p>风速: {Math.round(current.windSpeed)} km/h</p>
            <p>降水概率: {current.precipitationProbability}%</p>
          </div>
        </div>
      </div>

      <div className={styles.forecast}>
        <h3 className={styles.forecastTitle}>7天预报</h3>
        <div className={styles.forecastList}>
          {daily.time.map((time, index) => (
            <div key={time} className={styles.forecastDay}>
              <p className={styles.forecastDate}>{formatDate(time)}</p>
              <div className={styles.forecastIcon}>
                {getWeatherIcon(daily.weatherCode[index])}
              </div>
              <p className={styles.forecastTemp}>
                {Math.round(daily.temperatureMax[index])}° / {Math.round(daily.temperatureMin[index])}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 