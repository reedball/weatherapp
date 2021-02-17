// Date
var today = new Date(); //creates today variable
var dd = today.getDate(); //gets day
var mm = today.getMonth()+1; //gets month
var yyyy = today.getFullYear(); //gets year
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
}
today = mm+'/'+dd+'/'+yyyy;

// Function for removing all children from parent
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Function to retrieve city buttons
function getCities(){
        removeAllChildNodes(document.getElementById("myDIV")); 
        var cityHistory = JSON.parse(localStorage.getItem("cities")); 
        cityHistory.forEach(c => {
            var savedCity = document.createElement("button");
            savedCity.innerHTML = c.name;
            document.getElementById("myDIV").appendChild(savedCity);
            savedCity.style.display="block";
            savedCity.classList.add("cityButton", "list-group-item");
        });

}

getCities();

function getCityData(){
    var city;
    var api_url;
    if (search) {
        city = document.getElementById("city").value;
        api_url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=d264d9ea20381547eb5eb231bf12b9c3";
    }
    else if (history) {
        city = this.innertext
        api_url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=d264d9ea20381547eb5eb231bf12b9c3";
    }
    fetch(api_url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if(search){
                var cities = localStorage.getItem("cities");
                cities = cities ? JSON.parse(cities):[];
                cities.push(data)
                cities = JSON.stringify(cities);
                localStorage.setItem("cities", cities);
                getCities();
            }
            var weatherIcon = data.weather[0].icon;
            document.getElementById("cityName").innerHTML = data.name + '(' + today + ')';
            document.getElementById("weatherPic").src = "http://openweathermap.org/img/w/" +weatherIcon+ ".png";
            document.getElementById("weatherPic").alt = "weatherPic";
            document.getElementById("temperature").innerHTML = "Temperature: "+data.main.temp;
            document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity;
            document.getElementById("windSpeed").innerHTML = "Windspeed: "+data.wind.speed;

            //lat & long
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            localStorage.setItem("lat", lat);
            localStorage.setItem("lon", lon);
            var latt = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("lon"));
            uvIndex_url = "http://api.openweathermap.org/data/2.5/uvi?lat="+latt+"&lon="+long+"&appid=d264d9ea20381547eb5eb231bf12b9c3";
            return fetch(uvIndex_url);
        })
        .then(res => {
            return res.json()
        })
        .then (data => {
            document.getElementById("uvIndex").innerHTML = "UV Index: " + data.value;
        })
        .catch(error => console.log('ERROR'))
}

var cityList = document.getElementsByClassName("cityButton"); //array of City Buttons

var myFunction = function() {
    var cityFromCityList = this.innerText;
    var cityWeather_api = "http://api.openweathermap.org/data/2.5/weather?q=" + cityFromCityList + "&units=imperial&appid=d264d9ea20381547eb5eb231bf12b9c3";
    fetch(cityWeather_api)
        .then(res => {
            return res.json()
        })
        .then(data => {
            var weatherIcon = data.weather[0].icon;
            document.getElementById("cityName").innerHTML = data.name + '(' + today + ')';
            document.getElementById("weatherPic").src = "http://openweathermap.org/img/w/" +weatherIcon+ ".png";
            document.getElementById("weatherPic").alt = "weatherPic";
            document.getElementById("temperature").innerHTML = "Temperature: "+data.main.temp;
            document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity;
            document.getElementById("windSpeed").innerHTML = "Windspeed: "+data.wind.speed;

            //lat & long
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            localStorage.setItem("lat", lat);
            localStorage.setItem("lon", lon);
            var latt = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("lon"));
            uvIndex_url = "http://api.openweathermap.org/data/2.5/uvi?lat="+latt+"&lon="+long+"&appid=d264d9ea20381547eb5eb231bf12b9c3";
            return fetch(uvIndex_url);
        })
        .then(res => {
            return res.json()
        })
        .then (data => {
            document.getElementById("uvIndex").innerHTML = "UV Index: " + data.value;
        })
        .catch(error => console.log('ERROR'))
}
Array.from(cityList).forEach(function(city) {
    console.log(city);
    city.addEventListener('click', myFunction);
});

    
document.getElementById("searchButton").addEventListener("click", function() {
    var city = document.getElementById("city").value;

    var api_url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=d264d9ea20381547eb5eb231bf12b9c3"

    fetch(api_url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            var cities = localStorage.getItem("cities");
            cities = cities ? JSON.parse(cities):[];
            cities.push(data)
            cities = JSON.stringify(cities);
            localStorage.setItem("cities", cities);


            getCities();

            var weatherIcon = data.weather[0].icon;
            document.getElementById("cityName").innerHTML = data.name + '(' + today + ')';
            document.getElementById("weatherPic").src = "http://openweathermap.org/img/w/" +weatherIcon+ ".png";
            document.getElementById("weatherPic").alt = "weatherPic";
            document.getElementById("temperature").innerHTML = "Temperature: " + data.main.temp;
            document.getElementById("humidity").innerHTML = "Humidity: "+data.main.humidity;
            document.getElementById("windSpeed").innerHTML = "Wind Speed: "+data.wind.speed;

            //lat & long
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            localStorage.setItem("lat", lat);
            localStorage.setItem("lon", lon);
            var latt = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("lon"));
            uvIndex_url = "http://api.openweathermap.org/data/2.5/uvi?lat="+latt+"&lon="+long+"&appid=d264d9ea20381547eb5eb231bf12b9c3";
            return fetch(uvIndex_url);
        })
        .then(res => {
            return res.json()
        })
        .then (data => {
            document.getElementById("uvIndex").innerHTML = "UV Index: " + data.value;
        })
        .catch(error => console.log('ERROR'))
        
        


})

//what if it is undefined how to prevent it from adding andhow to add it to the list after you hit search