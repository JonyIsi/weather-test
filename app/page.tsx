'use client';

import { useState, useEffect } from 'react';
import { fetchRandomWeather, WeatherData } from '@/lib/weather';
import WeatherCard from '@/components/WeatherCard';
import styles from './page.module.css';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRandomWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRandomWeather();
      setWeatherData(data);
    } catch (err) {
      setError('获取天气数据失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomWeather();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>全球随机天气</h1>
      
      <button 
        onClick={loadRandomWeather} 
        className={styles.button}
        disabled={loading}
      >
        {loading ? '加载中...' : '换一个地点'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      
      {weatherData && !loading && (
        <WeatherCard weather={weatherData} />
      )}
      
      {loading && <div className={styles.loader}>加载中...</div>}
      
      <footer className={styles.footer}>
        数据来源: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>
      </footer>
    </main>
  );
}
