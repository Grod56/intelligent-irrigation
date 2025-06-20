export class WeatherAPI {
	constructor(location, apiKey) {
		this._endpoint = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&alerts=no`;
	}
	async _getWeatherData(days, endpoint) {
		const data = await fetch(endpoint.concat([`&days=${days}`])).then(
			response => {
				if (response.ok) {
					return response.json();
				}
				Promise.reject(
					`Failed to connect to weather api: ${response.statusText}`
				);
			}
		);
		return data;
	}
	async getWeatherForecast(days) {
		const data = await this._getWeatherData(days, this._endpoint);
		const forecast = data.forecast;
		const location = data.location;
		return { forecast, location };
	}
	async getCurrentWeather() {
		const data = await this._getWeatherData(1, this._endpoint);
		const currentWeather = {
			currentTemp: data.current.temp_c,
			maxTemp: data.forecast.forecastday[0].day.maxtemp_c,
			currentCondition: data.current.condition.text,
		};
		return currentWeather;
	}
}
