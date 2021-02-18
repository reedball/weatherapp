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
        if (c.name !== undefined){
            var savedCity = document.createElement("button");
            savedCity.innerHTML = c.name;
            document.getElementById("myDIV").appendChild(savedCity);
            savedCity.style.display="block";
            savedCity.classList.add("cityButton", "list-group-item");
        }
    });

}

if (window.localStorage.length > 0){
    getCities();
}



var city;
function getCityData(isSearchOrHistory, hasCity){
    var api_url;
    if (isSearchOrHistory === "search") {
        city = document.getElementById("city").value;
        api_url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=a76e8ae17a423488553909e792a72bf7";
    }
    else if (isSearchOrHistory === "history") {

        city = hasCity;
        api_url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=a76e8ae17a423488553909e792a72bf7";
    }
    fetch(api_url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if(isSearchOrHistory === "search"){
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
            document.getElementById("currentWeather").style.visibility = "visible";


            //lat & long
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            localStorage.setItem("lat", lat);
            localStorage.setItem("lon", lon);
            var latt = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("lon"));
            uvIndex_url = "http://api.openweathermap.org/data/2.5/uvi?lat="+latt+"&lon="+long+"&appid=a76e8ae17a423488553909e792a72bf7";
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


function getFiveDayData(isSearchOrHistory, hasCity){
    document.getElementById("forecastHeader").innerHTML = "5-Day Forecast";
    var fiveDay_url;
    if (isSearchOrHistory === "search") {
        city = document.getElementById("city").value;
        fiveDay_url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=a76e8ae17a423488553909e792a72bf7";
    }
    else if (isSearchOrHistory === "history") {
        city = hasCity;
        fiveDay_url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=a76e8ae17a423488553909e792a72bf7";
    }
    fetch(fiveDay_url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            removeAllChildNodes(document.getElementById("fiveDayDiv"));

            for(let i=0; i < data.list.length; i+=8){
                newDiv = document.createElement("DIV");
                newDiv.setAttribute("id", "newDiv");
                document.getElementById("fiveDayDiv").appendChild(newDiv);
                newDiv.classList.add("cardCSS", "card", "col-sm-2")

                date = data.list[i].dt_txt;
                icon = data.list[i].weather[0].icon;
                temp = data.list[i].main.temp;
                humidity = data.list[i].main.humidity;

                //for dates
                newDate = document.createElement("p");
                newDate.innerHTML = date;
                newDiv.appendChild(newDate);

                //for icons
                newIcon = document.createElement("IMG");
                newIcon.src = "http://openweathermap.org/img/w/" +icon+ ".png";
                newIcon.alt = "weathericon";
                newDiv.appendChild(newIcon);


                //for temps
                newTemp = document.createElement("p");
                newTemp.innerHTML = temp;
                newDiv.appendChild(newTemp);

                //for humiditys
                newHumidity = document.createElement("p");
                newHumidity.innerHTML = humidity;
                newDiv.appendChild(newHumidity);
            }
        })
        .catch(error => console.log('ERROR'))
}

var cityList = document.getElementsByClassName("cityButton"); //array of City Buttons
// HISTORY EVENT
var myFunction = function(){
    var cityToPass = this.innerText;
    getCityData("history", cityToPass);
    getFiveDayData("history", cityToPass);
}
Array.from(cityList).forEach(function(c) {
    c.addEventListener("click", myFunction);
});
// SEARCH EVENT
document.getElementById("searchButton").addEventListener("click", function(){
    getCityData("search");
    getFiveDayData("search");
    document.getElementById('city').value = "";
})

//if you search first and then click on history it wont change