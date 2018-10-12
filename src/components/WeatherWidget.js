import React, { Component } from 'react';

export default class WeatherWidget extends Component {

    constructor() {
        super();
        this.state = {
            activeCity: "Нижний Новгород"
        }
    }

    render() {
        return (
            <div className="-block-">
                <h2>Погода v1.0</h2>
                <p>{this.state.activeCity}</p>
                <div className="-block--light-">
                    <h3>Выбери город...</h3>
                        {cities.map((x) =>
                            <CityItem name={x.name} widget={this}></CityItem>)}
                </div>
                <WeatherDisplay city={this.state.activeCity}></WeatherDisplay>
            </div>
        );
    }
}

var cities = [
    {name: "Нижний Новгород"},
    {name: "Москва"},
    {name: "Плёс"},
    {name: "Севастополь"}
];

function getWeather(city, callback){
    const URL = "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
            "&appid=2d728f6f85e689c60f71ca7d1c8c1215&units=metric&lang=ru";
    fetch(URL).then(res => res.json()).then(callback);
}

function clamp(num, min, max){
    return Math.min(max,Math.max(min,num));
}

function getExpert(temp, humidity, cloudness, pressure, wind){
    var m = clamp((temp - 24) / 16, 0, 1);
    m *= clamp((humidity - 40) / 50, 0, 1);
    m *= clamp((cloudness - 0) / 100, 0, 1);
    m *= clamp((pressure - 760) / 100, 0, 1);
    m *= clamp((wind - 1) / 10, 0, 1);

    if(m >= 1) return "Жопа!"
    else if(m > 0.8) return "Ужасно"
    else if(m > 0.6) return "Плохая погода"
    else if(m > 0.4) return "Дома лучше :)"
    else if(m > 0.25) return "Норм"
    else if(m > 0.15) return "Хорошая погода"
    else if(m > 0.05) return "Отличная погода!"
    else return "Супер!!!";
}

class WeatherDisplay extends Component {
    constructor() {
        super();
        this.state = { weatherData: null }
    }

    componentDidMount() {
        const city = this.props.city;
        getWeather(city, json => {
            this.setState({ weatherData: json });
        });
    }

    componentDidUpdate() {
        const city = this.props.city;
        getWeather(city, json => {
            this.setState({ weatherData: json });
        });
    }

    render() {
        const weatherData = this.state.weatherData;
        if (!weatherData)
            return <div>Подожди немного, плиз...</div>;

        if(weatherData.main == undefined)
            return <div>Лимит запросов исчерпан</div>;

        //const iconUrl = "http://openweathermap.org/img/w/" + weatherData.weather.icon + ".png";

        var temp = weatherData.main.temp;
        const tempStyle = {
          color: 'rgb(' + ((temp-18) * 30 + ((temp<0)?(-temp*60):0)) + ', ' + (230 - Math.abs(temp - 15) * 20) + ', ' + (240 - temp * 10) + ')'
        };

        return (
            <div>
                <h3 style={tempStyle}>{(weatherData.main.temp >= 0 ? "+" + weatherData.main.temp.toFixed(0) : weatherData.main.temp.toFixed(0)) + "°"}</h3>
                <p>{weatherData.weather[0].description}, {weatherData.clouds.all}%</p>
                <p>Влажность: {weatherData.main.humidity}%</p>
                <p>Ветер: {weatherData.wind.speed} м/с, {weatherData.wind.speed*3.6} км/ч</p>
                <p>Давление: {(weatherData.main.pressure/1.333).toFixed(0)} мм рт. ст.</p>
                <p>Экспертная оценка: {getExpert(temp, weatherData.main.humidity, weatherData.clouds.all, weatherData.main.pressure/1.333, weatherData.wind.speed)}</p>
                <p>{weatherData}</p>
            </div>
        )
    }
}



class CityItem extends Component {

    render() {
        return (
            <button className="-selected-" onClick={() => {
                this.props.widget.setState({activeCity: this.props.name});
            }}>
                <p>{this.props.name}</p>
                <p>+14</p>
            </button>
        );
    }
}
