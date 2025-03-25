import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl =
    'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';

  constructor() {}

  getWeatherData(date: string) {
    return axios
      .get(`${this.baseUrl}?date=${date}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('There was an error!', error);
        throw error;
      });
  }

  async fetch30DaysHumidity(startDate: Date) {
    const baseURL =
      'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';
    const daysToFetch = 30;
    const results = [];

    for (let i = 0; i < daysToFetch; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const formattedDate = date.toISOString().split('T')[0];

      try {
        const response = await axios.get(`${baseURL}?date=${formattedDate}`);
        const forecast = response.data.items?.[0]?.forecasts?.[0]; 

        if (forecast) {
          results.push({
            date: formattedDate,
            humidity: forecast.relative_humidity,
            temperature: forecast.temperature,
          });
        } else {
          console.warn(`No forecast data available for ${formattedDate}`);
        }
      } catch (error: any) {
        console.error(
          `Error fetching data for ${formattedDate}:`,
          error.message
        );
      }
    }

    return results;
  }
}
