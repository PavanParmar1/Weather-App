import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts'; 
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    HighchartsChartModule,
  ],
})
export class AppComponent implements OnInit {
  weatherData: any;
  selectedDate: Date | null = null;
  formattedDate: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  maxDate!: Date;

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.maxDate = new Date(); 
  }

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today;
    this.fetchWeatherData(today);
    this.prepareChartData();

    this.initializeChart();
  }

  // Open date picker function
  openDatePicker(): void {
    const dateInput = document.querySelector('input[matInput]') as HTMLElement;
    dateInput?.focus();
  }

  // private fetchWeatherData30(): void {
  //   this.weatherService
  //     .fetch30DaysHumidity()
  //     .then((data) => {
  //       this.weatherData = data;
  //       console.log('Weather Data:', this.weatherData);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching weather data:', error);
  //     });
  // }

  // Date change handler
  onDateChange(event: any): void {
    const selectedDate = new Date(event.value);
    const formattedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );

    this.selectedDate = formattedDate;

    console.log('selectedDate===', formattedDate);
    this.fetchWeatherData(formattedDate);
    this.prepareChartData();
  }

  formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Get the full weekday, day, month, and year values
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Return the formatted date string with custom separator
    return `${weekday} | ${day < 10 ? '0' + day : day} ${month} ${year}`;
  }

  // Fetch weather data
  private fetchWeatherData(date: Date): void {
    const formattedDate = date.toISOString().split('T')[0];
    const today = new Date();

    this.weatherService
      .getWeatherData(formattedDate)
      .then((data) => {
        this.weatherData = data;
        this.formattedDate = this.formatDate(formattedDate);
        console.log('Weather Data:', this.weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  refreshPage(): void {
    window.location.reload();
  }

  prepareChartData(): void {
    if (!this.selectedDate) {
      console.warn('No start date selected for fetching data.');
      return;
    }

    this.weatherService
      .fetch30DaysHumidity(this.selectedDate)
      .then((data) => {
        console.log('Fetched Data:', data);
        const humidityData = data.map((item: any) => {
          if (item.humidity && typeof item.humidity.low === 'number') {
            return item.humidity.low;
          } else {
            console.warn('Invalid item structure:', item);
            return 0;
          }
        });

        console.log('Processed Humidity Data:', humidityData);
        // Update chart options reactively
        this.chartOptions = {
          chart: {
            backgroundColor: null,
          },
          legend: {
            enabled: false,
          },
          grid: {
            enabled: false,
          },
          series: [
            {
              name: 'Humidity',
              data: humidityData,
              type: 'line',
              color: 'white',
              dataLabels: {
                enabled: true,
                color: 'white',
                style: {
                  fontSize: '10px',
                  textOutline: 'none',
                },
                verticalAlign: 'bottom',
              },
            },
          ],
          title: {
            text: null,
          },
          xAxis: {
            visible: true, // Keep hidden initially
            labels: {
              style: {
                color: 'white', // Set X-axis label color to white
              },
            },
          },
          yAxis: {
            visible: true, // Keep hidden initially
            labels: {
              style: {
                color: 'white', // Set X-axis label color to white
              },
            },
          },
        };
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  initializeChart(): void {
    this.chartOptions = {
      chart: {
        backgroundColor: null,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          // name: 'Humidity',
          // data: [60, 55, 70],
          // type: 'line',
          // color: 'white',
        },
      ],
      title: {
        text: null,
      },
      grid: {
        enabled: false,
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
    };
  }
}
