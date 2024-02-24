// Fonction pour charger et analyser le fichier CSV
function loadCSV() {
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(data => {
            // Analyser les données CSV
            processData(data);
        });
}

// Fonction pour traiter les données CSV
function processData(csvData) {
    // Parse CSV
    const lines = csvData.split('\n');
    const cities = [];
    for (let line of lines) {
        const [latitude, longitude, city, country] = line.split(',');
        cities.push({ latitude: latitude, longitude: longitude, name: city, country: country });
    }
    // Appeler la fonction pour créer la liste déroulante avec les villes et les pays
    createCityDropdown(cities);
}

// Fonction pour créer la liste déroulante avec les villes
function createCityDropdown(cities) {
    const dropdown = document.getElementById('city');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.text = `${city.name}, ${city.country}`;
        option.value = `${city.latitude},${city.longitude}`;
        dropdown.appendChild(option);
    });
}

// Fonction pour récupérer les données météorologiques à partir de l'API 7Timer
function getWeatherData(latitude, longitude) {
    // Effectuer une requête GET à l'API 7Timer en utilisant les coordonnées géographiques
    fetch(`http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            // Traiter les données et afficher les informations météorologiques sur la page
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données météorologiques :', error);
        });
}


// Fonction pour afficher les informations météorologiques sur la page
function displayWeatherData(weatherData) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    if (weatherInfoDiv) {
        // Supprimer le contenu précédent
        weatherInfoDiv.innerHTML = '';

        // Créer une carte pour chaque jour
        weatherData.dataseries.forEach(dayData => {
            const card = document.createElement('div');
            card.classList.add('weather-card');

            // Créer la partie supérieure de la carte
            const topSection = document.createElement('div');
            topSection.classList.add('top-section');
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = dayData.date;
            const weatherImage = document.createElement('img');
            weatherImage.src = weatherImages[dayData.weather.toLowerCase()];
            weatherImage.alt = dayData.weather;
            topSection.appendChild(dateHeader);
            topSection.appendChild(weatherImage);

            // Créer la partie inférieure de la carte
            const bottomSection = document.createElement('div');
            bottomSection.classList.add('bottom-section');
            const precipitationText = document.createElement('p');
            precipitationText.textContent = dayData.weather;
            const temperatureHighText = document.createElement('p');
            temperatureHighText.textContent = `H : ${dayData.temp2m.max}°C`;
            const temperatureLowText = document.createElement('p');
            temperatureLowText.textContent = `L : ${dayData.temp2m.min}°C`;
            bottomSection.appendChild(precipitationText);
            bottomSection.appendChild(temperatureHighText);
            bottomSection.appendChild(temperatureLowText);

            // Ajouter les sections à la carte
            card.appendChild(topSection);
            card.appendChild(bottomSection);

            // Ajouter la carte à l'élément weatherInfoDiv
            weatherInfoDiv.appendChild(card);
        });
    } else {
        console.error('Element #weatherInfo not found.');
    }
}

const weatherImages = {
    'clear': 'http://localhost:5502/images/clear.png',
    'pcloudy': 'http://localhost:5502/images/pcloudy.png',
    'cloudy': 'http://localhost:5502/images/cloudy.png',
    'mcloudy': 'http://localhost:5502/images/mcloudy.png',
    'foggy': 'http://localhost:5502/images/foggy.png',
    'lightrain': 'http://localhost:5502/images/lightrain.png',
    'oshower': 'http://localhost:5502/images/oshower.png',
    'ishower': 'http://localhost:5502/images/ishower.png',
    'lightsnow': 'http://localhost:5502/images/lightsnow.png',
    'rain': 'http://localhost:5502/images/rain.png',
    'snow': 'http://localhost:5502/images/snow.png',
    'mixed': 'http://localhost:5502/images/mixed.png',
    'thunderstorm_possible': 'http://localhost:5502/images/thunderstorm_possible.png',
    'thunderstorm': 'http://localhost:5502/images/thunderstorm.png',
    'windy': 'http://localhost:5502/images/windy.png'
    
};
// Événement lors de la sélection d'une ville dans la liste déroulante
document.getElementById('city').addEventListener('change', function () {
    const [latitude, longitude] = this.value.split(',');
    getWeatherData(latitude, longitude);
});

// Charger les données CSV au chargement de la page
window.addEventListener('load', loadCSV);
