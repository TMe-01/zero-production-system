import { useState, useEffect } from 'react';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = (latitude: number, longitude: number) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 200) {
            const times = data.data.timings;
            setPrayerTimes({
              Fajr: times.Fajr,
              Dhuhr: times.Dhuhr,
              Asr: times.Asr,
              Maghrib: times.Maghrib,
              Isha: times.Isha,
            });
          } else {
            setError('Could not fetch prayer times.');
          }
        })
        .catch(() => setError('Failed to connect to the prayer times service.'))
        .finally(() => setIsLoading(false));
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError('Geolocation permission denied. Prayer times cannot be calculated.');
        setIsLoading(false);
      }
    );
  }, []);

  return { prayerTimes, isLoading, error };
};
