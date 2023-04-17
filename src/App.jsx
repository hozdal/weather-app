import { useEffect, useState } from "react";
import cities from "../cities";
import axios from "axios";
import { wiIcons } from "../icon-codes";

const daysOfWeeks = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cumaa",
  "Cumartesi",
];

const fetchWeather = async (city) => {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${
      city.lon
    }&exclude=hourly&appid=${import.meta.env.VITE_API_KEY}`
  );

  return data;
};

const kelvinToCelcius = (value) => value - 273;

function App() {
  const [selectedCity, setSelectedCity] = useState(0);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleSelect = (e) => {
    setSelectedCity(Number(e.target.value));
  };

  const cityInfo = cities[selectedCity];

  useEffect(() => {
    const cityInfo = cities[selectedCity];
    setLoading(true);
    fetchWeather(cityInfo).then((x) => {
      setWeatherInfo(x);
      setLoading(false);
    });
  }, [selectedCity]);

  if(!weatherInfo) return null

  return (
    <div className="bg-blue-400 min-h-screen flex flex-col items-center mx-auto">
      <br />
      <br /><br />
      <select value={selectedCity} onChange={handleSelect} className=" bg-purple-300 select w-64 max-w-xs">
        {cities.map((x, index) => (
          <option key={x.name} value={index}>
            {x.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      <div className="bg-purple-300 card w-64  shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{cityInfo.name} <i className={`display-2 wi ${wiIcons[weatherInfo.current.weather[0].icon]}`}></i></h2>
          
          <span>
            Sıcaklık: {kelvinToCelcius(weatherInfo.current.temp).toFixed(1)}{" "}
            C°
          </span>
        </div>
      </div>
      <br />
      <br />
      <div className="bg-purple-300 card  shadow-xl">
        <div className="card-body items-center gap-8">
          <h2 className="card-title">Haftalık Hava Durumu</h2>
          <div className="flex gap-4 text-left">
            {weatherInfo.daily.map((x, index) => (
              <div key={index}>
                {daysOfWeeks[index % 7]} <i className={`fs-1 wi ${wiIcons[x.weather[0].icon]}`} style={{ color: '#ddd' }} />
                <br />
                {kelvinToCelcius(x.temp.day).toFixed(1)} C°
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
