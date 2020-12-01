import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment';

function App() {
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('02140');
  const [state, setState] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [weatherMain, setWeatherMain] = useState('local weather');
  const [weatherMinTemp, setWeatherMinTemp] = useState('');
  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherMaxTemp, setWeatherMaxTemp] = useState('');
  const [windspeed, setWindSpeed] = useState();
  const [latLong, setLatLong] = useState([0, 0]);
  const [forecast, setForecast] = useState({});

  const defaultTimeZone = 'EST';

  const options = {
    method: 'GET',
    url: `https://redline-redline-zipcode.p.rapidapi.com/rest/info.json/${zip}/degrees`,
    headers: {
      'x-rapidapi-key': `${process.env.REACT_APP_X_RAPIDAPI_KEY }`,
      'x-rapidapi-host': 'redline-redline-zipcode.p.rapidapi.com'
    },
  };
  const appIdWeather = `${process.env.REACT_APP_WEATHER_API_KEY}`;
  const optionsWeather = {
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${appIdWeather}&units=imperial`
  };
  const optionsWeatherForecast = {
    method: 'GET',
    url: 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily',
    params: {lat: latLong[0], lon: latLong[1], units: "I" },
    // params: {lat: 34, lon: -118, units: "I" },
    headers: {
      'x-rapidapi-key': `${process.env.REACT_APP_X_RAPIDAPI_KEY }`,
      'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
  };
  const resetWeather = () => {
    setWeatherMinTemp('');
    setWeatherMaxTemp('');
    setWindSpeed('');
    setWeatherMain('');
    setWeatherTemp('');
    setForecast({});
  };
  const invalidZip = () => {
    setCity('-');
    setState('');
    setTimeZone('');
    resetWeather();
  };
  const round = (num, decimals = 0) => {
    if (typeof num === 'number') return num.toFixed(decimals);
    return '-';
  };
  useEffect(() => {
    if (zip.length === 5 && !isNaN(zip)) {
      // Example #1 of using axio (works OK)
      axios.request(options) // zip, town, state and Timezone (top header)
        .then(function(response) {
          setCity(response.data.city);
          setState(response.data.state);
          setTimeZone(response.data.timezone.timezone_abbr);
          setLatLong([response.data.lat, response.data.lng]);
        })
        .then(function() {
          if( latLong[0] !== 0 && latLong[1] !== 0) {
          // Example #2 of using axio for "Forecast" (16 day forecast).
            axios.request(optionsWeatherForecast)
              .then(function(response) {
                const responseData = response.data.data;
                const reducedResponse = responseData.reduce((result, item, index) => {
                  return { ...result, [index]: item, };
                }, {});
                setForecast(object => {
                  return { ...object, ...reducedResponse };
                });
              })
              .catch(function() {
                setForecast({});
              });
          }
        })
        .catch(function() {
          invalidZip();
          setForecast({});
        });
      // Example #3 of using axios
      axios.request(optionsWeather) // Gives us Current Conditions, temp, min temp, max temp, windspeed
        .then(function(response) {
          setWeatherMain(response.data.weather[0].main);
          setWeatherTemp(round(response.data.main.temp));
          setWeatherMinTemp(round(response.data.main.temp_min));
          setWeatherMaxTemp(round(response.data.main.temp_max));
          const windspeed = round(response.data.wind.speed * (5 / 9));
          setWindSpeed(windspeed);
        })
        .catch(function() {
          resetWeather();
        });
    }
    if (zip.length !== 5 || isNaN(zip)) {
      invalidZip();
    }
  }, [ zip, ...latLong ]);

  const updateZip = (event) => {
    setZip(event.target.value);
  };

  const showTemperature = (temperature) => {
    return `${round(temperature)}`;
  };

  const showTime = (date) => {
    const tz = timeZone === '' ? defaultTimeZone : timeZone;
    return  moment.unix(date).toLocaleString(tz).substring(16, 25);
    // return result;
  };

  const showDate = (validDate) => {
    return validDate.substring(5, 10);
  };

  const showDay = (date) => {
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(date ));
    return day;
  };

  const ShowDetails = (oneDay) => {
    console.log(oneDay);
    const day = oneDay.day;
    return (
      <div>
        { showDay( day.valid_date )}
        &nbsp;&nbsp;
        { showDate( day.valid_date) }
        &nbsp;&nbsp;
        { showTemperature ( day.low_temp )}°  /
        { showTemperature ( day.high_temp )}°
        &nbsp;
        { day.wind_cdir }@
        { round(day.wind_spd) }
        &nbsp; &nbsp;&nbsp;
        ↑{showTime( day.sunrise_ts ) }
        ↓{showTime( day.sunset_ts ) }
      </div>
    );
  };

  const showDayInfo = (day) => {
    return `
    ${ day.valid_date }
    ${round(day.low_temp ) } °  /
    ${round(day.high_temp ) }°
    `;
  };

  return (
    <div className = "App" >
      <section id="location">
        <span className = "zipInputForm" >
          <form onSubmit = { updateZip } >
            <input type = "text"
              placeholder = "zip"
              value = { zip }
              onChange = { updateZip }
              size = "5"
              maxLength = "10"
              className = "zipInput"
              autoFocus
            />
          </form>
          <span id="location-city-state">
            { city }&nbsp;
            { state }
          </span>
          <br/>
          <div className = "timezone" > { timeZone } <br/>
          </div>
        </span>
      </section>
      <section id="conditions">
        <span className="section-heading">
        Current Conditions
        </span>
        <br/> { weatherMain }, { weatherTemp }° <br/>
            Min: { weatherMinTemp }° &nbsp; &nbsp; Max: { weatherMaxTemp }° <br/>
            Windspeed: { windspeed }<span id = "mph">mph</span>
      </section>
      <section id="forecast">
        <span className="section-heading">
          Forecast<br/>
        </span>
        { forecast[0] && `${showDayInfo( forecast[1] )}` }<br/>
        {/* This works but is clearly repetative */}
        { forecast[0] && `${showDayInfo( forecast[2] )}` }<br/>
        { forecast[0] && `${showDayInfo( forecast[3] )}` }<br/>
        { forecast[0] && `${showDayInfo( forecast[4] )}` }<br/>
        { forecast[0] &&
          <ShowDetails day = {forecast[1]}/> // This works
        }
        {/* This is where the issue is */}
        {/* { forecast[0] && forecast.entries((day) => {
          <ShowDetails day = {day} />;
        })} */}
      </section>
    </div>
  );
}
export default App;