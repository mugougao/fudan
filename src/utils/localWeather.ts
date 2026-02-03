interface IWeatherInfo {
  city: string;
  dayweather: string;
  nightweather: string;
  nighttemp: string;
  daytemp: string;
}

class LocalWeather {
  // 高德key
  key = "2c0e542f5a36658489400ca1db07bd57";

  // 城市 code
  cityCode = "";
  cityName = "";

  weatherInfo: IWeatherInfo = {} as IWeatherInfo;

  constructor() {
  }

  async getCityCode() {
    try {
      const response = await fetch(`https://restapi.amap.com/v3/ip?key=${this.key}`);
      const data = await response.json();
      this.cityCode = data.adcode;
      this.cityName = data.city;
    }
    catch (error) {
      console.error(error);
    }
  }

  async getWeather() {
    try {
      const { key, cityCode } = this;
      const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${cityCode}&extensions=all`);
      const data = await response.json();
      const { forecasts = [], city = "上海市" } = data;
      const [weatherInfo = {}] = forecasts?.[0]?.casts || [];

      this.weatherInfo = {
        city,
        dayweather: weatherInfo.dayweather,
        nightweather: weatherInfo.nightweather,
        nighttemp: weatherInfo.nighttemp,
        daytemp: weatherInfo.daytemp,
      };
    }
    catch (error) {
      console.error(error);
    }
  }

  async update() {
    await this.getWeather();
    return this.weatherInfo;
  }

  async init() {
    await this.getCityCode();
    await this.update();
  }
}

export const localWeather = new LocalWeather();
