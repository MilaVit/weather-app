let humidity = document.getElementById('current-humidity'),
    pressure = document.getElementById('current-pressure'),
    temperature = document.getElementById('current-temperature'),
    windSpeed = document.getElementById('current-wind-speed'),
    getWeatherButton = document.getElementById('getWeather'),
    weatherSummary = document.getElementById('weather-summary'),
    countryMain = document.getElementById('country'),
    cityMain = document.getElementById('city'),
    textCity = document.getElementById('textCity'),
    textBtn = document.getElementById('textBtn'),
    textVoice = document.getElementById('textVoice'),
    minTemp = document.getElementById('minTemp'),
    maxTemp = document.getElementById('maxTemp'),
    weather = document.getElementById('weather'),
    list = document.getElementById('list'),
    locationCity = document.getElementById('location-city-country'),
    loader = document.getElementById('loader');

    
textCity.addEventListener('focus', showBtn);
getWeatherButton.addEventListener('click', getWeatherCoordinates);
textBtn.addEventListener('click',getWeatherCity);
textVoice.addEventListener('click', voiceSearch);

let apiKey = '8034d07ea1d48a3ec6ca5c36b6a0dcb4';
let informCelsius;

function voiceSearch() {
    removeBlock();
    displayLoader();

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    let voice = new SpeechRecognition();
    voice.lang = "en-US";

    voice.addEventListener('result', function(event) {
        textCity.value = Array.prototype.slice.call(event.results)
        .map((result) => result[0].transcript).join('');

        if(textCity !== '')  getWeatherCity();
    })

    voice.start()
}

function getWeatherCoordinates() {
    searchesCurrentGeolocation()
    removeBlock()
    displayLoader()
}

function searchesCurrentGeolocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            getWeatherData(position.coords.latitude, position.coords.longitude);
        })
    } else {
        return cityMain.innerHTML = 'Could not get current location';
    }
}

function getWeatherData(latitude, longitude) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(() => {
            cityMain.innerHTML = 'Your current geolocation not found!'
        })
        displayLoader();
}

function getWeatherCity() {
    let city = textCity.value
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch((error) => {
            cityMain.innerHTML = 'Your city not found';
            temp.style.display = 'block';
        })
}

function displayData(data) {
    cityMain.innerHTML=data.name;
    humidity.innerHTML = data.main.humidity + ' %';
    pressure.innerHTML = data.main.pressure + 'hPa';
    windSpeed.innerHTML = data.wind.speed + 'm/s';
    weather.innerHTML = getIcon(data.weather[0].icon);
    temperature.innerHTML = getCelsius(data.main.temp) + ' ºC';
    minTemp.innerHTML = 'Min: ' + '<br />' + getCelsius(data.main.temp_min) + 'ºC';
    maxTemp.innerHTML = 'Max: ' + '<br />' + getCelsius(data.main.temp_max) + 'ºC';
    countryMain.innerHTML = data.sys.country;

    weather.style.display = 'block';
    list.style.display = 'block';
    locationCity.style.display = 'block';
    textBtn.style.display = 'none';
    textCity.value = '';

    deleteLoader()
}

getIcon = (icon) => {
    let apiIcon = `https://openweathermap.org/img/w/${icon}.png`;
    return weather.setAttribute('src', apiIcon);
}

getCelsius = (num) => { informCelsius = num - 273,15;
    return Math.floor(informCelsius);
}

function displayLoader() {
    if(loader.style.visibility='hidden') {
        return setTimeout(() => loader.style.visibility = 'visible');
    }
}

deleteLoader = () => {
    if(loader.style.visibility = 'visible') loader.style.visibility = 'hidden';
}

function removeBlock() {
    if(list.style.display = 'block') {
        list.style.display = 'none';
        locationCity.style.display = 'none';
    }
}

function showBtn() {
    if(textCity !== ''){
        textBtn.style.display = 'block';
        removeBlock()
        displayLoader()
    }
}

