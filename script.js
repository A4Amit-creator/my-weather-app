const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = 'ad5d897c2a4757acc3abce3dd7b92b98'
const ApiKey = 'b46450acdf7a4825b8540119250403'


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmoshphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currentDate = new Date
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function getFetchData(endPoint, city) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()
    console.log(getCurrentDate())
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}



async function updateForecastInfo(city) {
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${city}&days=7&aqi=no&alerts=no`;

    const response = await fetch(forecastUrl);
    const forecastsData = await response.json();

    console.log("Forecast API Response:", forecastsData); // Debugging

    // Ensure `forecast.forecastday` exists
    if (!forecastsData.forecast || !forecastsData.forecast.forecastday) {
        console.error("Error: 'forecast.forecastday' data is missing.");
        return;
    }

    forecastItemsContainer.innerHTML = '';

    forecastsData.forecast.forecastday.forEach((day, index) => {
        if (index > 0) { // Exclude today
            updateForecastItem(day);
        }
    });
}

function updateForecastItem(weatherData) {
    console.log("Forecast Data:", weatherData);

    const {
        date, // Correct date format
        day: { maxtemp_c, mintemp_c, condition, avghumidity }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = { day: '2-digit', month: 'short' };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = ` 
    <div class="forecast-item">
           <h5 class="forecast-item-date regular-txt">${dateResult} </h5>
           <img src="${condition.icon}" class="forecast-item-img"> <!-- WeatherAPI provides image URL -->
           <h5 class="forecast-item-temp">Max: ${Math.round(maxtemp_c)}°C</h5>
            <h5 class="forecast-item-temp">Min: ${Math.round(mintemp_c)}°C</h5>
            <div class="forecast-item-humidity"><span><i class="fa-solid fa-droplet small-humidity-icon"></i></span>
            <h5 class="forecast-item-humidity-txt">${avghumidity}%</h5></div>
    </div>`;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}



function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}
