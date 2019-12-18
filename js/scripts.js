var parsed_weather_data;

//functions for current, hourly and daily weather
function changeWeatherIcon(icon_summary, icon_element, icon_size) {
    var icon_types = ['clear-day', 'clear-night', 'rain', 'snow', 'sleet', 'wind', 'fog', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night'];
    var icon_class;
            switch(icon_summary) {
                case 'clear-day':
                    icon_class = "fa-sun";
                    break;
                case 'clear-night':
                    icon_class = "fa-moon";
                    break;
                case 'rain':
                    icon_class = "fa-cloud-rain";
                    break;
                case 'snow':
                    icon_class = "fa-snowflake";
                    break;
                case 'sleet':
                    icon_class = "fa-cloud-showers-heavy";
                    break;
                case 'wind':
                    icon_class = "fa-wind";    
                    break;
                case 'fog':
                    icon_class = "fa-smog";
                    break;
                case 'cloudy':
                    icon_class = "fa-cloud";
                    break;
                case 'partly-cloudy-night':
                    icon_class = "fa-cloud-moon";
                    break;
                case 'partly-cloudy-day':
                    icon_class = "fa-cloud";
                    break;
                default:
                    icon_class = "fa-cloud";
            }
            icon_element.classList.add("fas", icon_class, icon_size);
}

// API calls and current weather
if ("geolocation" in navigator) {

    console.log("Geolocation is available");

    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const google_geocode_api_key = 'AIzaSyDSvavoKBrIlFroEBKsO85JFxmbqCmPcN4';
        const google_geocode_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + google_geocode_api_key;
        var google_geocode_request = new XMLHttpRequest();
        google_geocode_request.open("GET", google_geocode_url);
        google_geocode_request.send();
        google_geocode_request.onload = function() {
            var raw_city_data = google_geocode_request.response;
            var parsed_city_data = JSON.parse(raw_city_data);
            
            const city_name = parsed_city_data.results[8].formatted_address;
            
            var city_title_h1 = document.getElementById("cityName");
            city_title_h1.innerHTML = city_name;

        };

        const dark_sky_api_key = '26e7fc2e766836d88be5fc8b98a22539';
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const dark_sky_url = proxyurl + 'https://api.darksky.net/forecast/' + dark_sky_api_key + '/' + lat + ',' + long;
        var dark_sky_request = new XMLHttpRequest();
        dark_sky_request.open("GET", dark_sky_url);;
        dark_sky_request.send();
        dark_sky_request.onload = function() {
            var raw_weather_data = dark_sky_request.response;
            parsed_weather_data= JSON.parse(raw_weather_data);
            console.log(parsed_weather_data);

            var current_summary_p = document.getElementById("currentSummary");
            var current_summary = parsed_weather_data.currently.summary;
            current_summary_p.innerHTML = current_summary;

            var current_icon_i = document.getElementById("currentWeatherIcon");
            changeWeatherIcon(parsed_weather_data.currently.icon, current_icon_i, "fa-7x");
            current_icon_i.style.visibility = "visible";
            
            var current_temp_p = document.getElementById("currentTemp");
            var current_temp = Math.trunc(parsed_weather_data.currently.temperature);
            current_temp_p.innerHTML = current_temp + 'F';


            var current_feels_like_temp_p = document.getElementById("currentFeelsLikeTemp");
            var current_feels_like_temp = Math.trunc(parsed_weather_data.currently.apparentTemperature);
            current_feels_like_temp_p.innerHTML = 'Feels like: ' + current_feels_like_temp + 'F';

            var current_wind_speed_p = document.getElementById("currentWindSpeed");
            var current_wind_speed = Math.round(parsed_weather_data.currently.windSpeed);
            current_wind_speed_p.innerHTML = "Wind Speed: " + current_wind_speed + 'MPH';

            var current_precip_probability_p = document.getElementById("currentPrecipProbability");
            var current_precip_probability = parsed_weather_data.currently.precipProbability * 100;
            current_precip_probability_p.innerHTML = "Precipitation Probability: " + current_precip_probability + "%"

            var current_humidity_p = document.getElementById("currentHumidity");
            var current_humidity = parsed_weather_data.currently.humidity * 100;
            current_humidity_p.innerHTML = "Humidity: " + current_humidity + "%";
            
            var button_row_div = document.getElementById("buttonRow");
            button_row_div.style.visibility = "visible";

            var change_to_cel_button = document.getElementById("changeToCelButton");
            var current_temp_celsius = Math.trunc((5/9) * (current_temp - 32));
            var current_feels_like_temp_celsuis = Math.trunc((5/9) * (current_feels_like_temp - 32));
            var button_clicked = false;
            change_to_cel_button.onclick = function() {
                if (button_clicked == false) {
                    current_temp_p.innerHTML = current_temp_celsius + 'C';
                    current_feels_like_temp_p.innerHTML = 'Feels Like: ' + current_feels_like_temp_celsuis + 'C';
                    button_clicked = true;
                } else {
                    current_temp_p.innerHTML = current_temp + 'F';
                    current_feels_like_temp_p.innerHTML = 'Feels like: ' + current_feels_like_temp + 'F';
                    button_clicked = false; 
                };
            };
        };
    });

    
} else {
    console.log('Geolocation is NOT available');
}

//functions for hourly and daily weather

function changeHourlyTime(section_number, time_element) {
    var date = new Date(parsed_weather_data.hourly.data[section_number].time * 1000);
    var hours = date.getHours();
    if(hours == 0) {
        hours = 24;
    };
    var mins = "0" + date.getMinutes();
    var time = hours + ":" + mins;
    time_element.innerHTML = time;
};

function changeSummary(section_number, summary_element) {
    var summary = parsed_weather_data.hourly.data[section_number].summary;
    summary_element.innerHTML = summary;
};

function changeTemp(section_number, temp_element) {
    var temp = Math.trunc(parsed_weather_data.hourly.data[section_number].temperature);
    temp_element.innerHTML = temp + "F";
};

function changeWindSpeed(section_number, wind_element) {
    var wind_speed = Math.round(parsed_weather_data.hourly.data[section_number].windSpeed);
    wind_element.innerHTML = wind_speed + "MPH";
};



//Hourly Weather

var change_to_hourly_button = document.getElementById("changeToHourlyButton");
change_to_hourly_button.onclick = function() {

    var hourly_button_text = change_to_hourly_button.innerHTML;
    var current_weather_div = document.getElementById("currentWeatherDiv");
    var hourly_weather_div = document.getElementById("hourlyWeatherDiv");
    if (hourly_button_text == "Current") {
        hourly_weather_div.style.display = "none";
        current_weather_div.style.display = "block";
        change_to_hourly_button.innerHTML = "Hourly";
    } else {
        current_weather_div.style.display = "none";
        hourly_weather_div.style.display = "block";
        change_to_hourly_button.innerHTML = "Current";
    };

    var html_time_sections = ["hourlyFirstTimeSection", "hourlySecondTimeSection", "hourlyThirdTimeSection", "hourlyFourthTimeSection", "hourlyFifthTimeSection", "hourlySixthTimeSection"];
    for (i=0; i < 6; i++) {
        changeHourlyTime(i, document.getElementById(html_time_sections[i]));
    };

    var icon_size = "fa-3x";
    var html_icon_sections = ["hourlyFirstIconSection", "hourlySecondIconSection", "hourlyThirdIconSection", "hourlyFourthIconSection", "hourlyFifthIconSection", "hourlySixthIconSection"];
    for (i=0; i < 6; i++) {
        changeWeatherIcon(parsed_weather_data.hourly.data[i].icon, document.getElementById(html_icon_sections[i]), icon_size);
    };

    var html_summary_sections = ["hourlyFirstSummarySection", "hourlySecondSummarySection", "hourlyThirdSummarySection", "hourlyFourthSummarySection", "hourlyFifthSummarySection", "hourlySixthSummarySection"];
    for (i=0; i < 6; i++) {
        changeSummary(i, document.getElementById(html_summary_sections[i]));
    };

    var html_temp_sections = ["hourlyFirstTempSection", "hourlySecondTempSection", "hourlyThirdTempSection", "hourlyFourthTempSection", "hourlyFifthTempSection", "hourlySixthTempSection"];
    for (i=0; i < 6; i++) {
        changeTemp(i, document.getElementById(html_temp_sections[i]));
    };

    var html_wind_sections = ["hourlyFirstWindSection", "hourlySecondWindSection", "hourlyThirdWindSection", "hourlyFourthWindSection", "hourlyFifthWindSection", "hourlySixthWindSection"];
    for (i=0; i < 6; i++) {
        changeWindSpeed(i, document.getElementById(html_wind_sections[i]));
    };

};





