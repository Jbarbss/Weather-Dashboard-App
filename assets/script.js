// declaring variables
var searchBtn = $("#search-button");
var formEl = $("#city-form");
var cityInputEl = $("#cityInput");
var cityHistoryEl = $("#city-container");
var currentCity = $("#currentForecast");
var currentTemp = $("#temp");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#windSpeed");
var currentUvi = $("#uvIndex");
var weatherIcon = $("#weatherIcon");
var date = $("#date");
var historyEl = $("#cityHistory");

var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
console.log(searchHistory);

var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var city = cityInputEl.val().trim();
  
    if (city) {
      getCityName(city);
      getFiveDay(city);
      cityInputEl.text("");
      cityInputEl.val("");
  
      var cities = JSON.parse(localStorage.getItem("cities")) || [];
      searchHistory.push(city);
      localStorage.setItem("cities", JSON.stringify(searchHistory));
      renderSearchHistory();
    } else {
      alert("Please Enter a Valid City Name");
    }
  };

  //fetch first api to get current weather
var getCityName = function (city) {
    var currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db2bc20d9d8e8916bcc4fa9a82d88562&units=imperial`;
  
    fetch(currentUrl).then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json().then(function (data) {
          console.log(data);
          displayCity(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

  //fetch second api to get 5 day weather
var getFiveDay = function (city) {
    var currentUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=db2bc20d9d8e8916bcc4fa9a82d88562&units=imperial`;
  
    fetch(currentUrl).then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json().then(function (data) {
          console.log(data);
  
          // filtered response to get the 5 days out of array
          var fiveDay = data.list;
  
          var filtered = fiveDay.filter(function (day) {
            if (day.dt_txt.indexOf("12:00:00") !== -1) {
              return day;
            }
          });
          console.log(filtered);
  
          displayFiveDay(filtered);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

  //fetch second api to get 5 day weather
var getFiveDay = function (city) {
  var currentUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=db2bc20d9d8e8916bcc4fa9a82d88562&units=imperial`;

  fetch(currentUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      return response.json().then(function (data) {
        console.log(data);

        // filtered response to get the 5 days out of array
        var fiveDay = data.list;

        var filtered = fiveDay.filter(function (day) {
          if (day.dt_txt.indexOf("12:00:00") !== -1) {
            return day;
          }
        });
        console.log(filtered);

        displayFiveDay(filtered);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

//functions to display current weather on html
function displayCity(data, searchCity) {
    let rightNow = moment().subtract(10, "days").calendar();
    var iconCode = data.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    weatherIcon.attr("src", iconUrl);
  
    var cityTemp = Math.round(data.main.temp);
    var windSpeed = Math.round(data.wind.speed);
    date.text(" (" + rightNow + ")");
    currentCity.text(searchCity);
    currentTemp.text("Temperature:" + " " + cityTemp + " °F");
    currentHumidity.text("Humidity:" + " " + data.main.humidity + " %");
    currentWindSpeed.text("Wind Speed:" + " " + windSpeed + " MPH");
  
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    displayUvIndex(lat, lon);
  }

  //fetch third api to get UV Index
function displayUvIndex(lat, lon) {
    var uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=db2bc20d9d8e8916bcc4fa9a82d88562`;
    fetch(uvUrl).then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json().then(function (data) {
          console.log(data);
          var uviDisplay = data.current.uvi;
          //create and put uvIndex on html
          currentUvi.text("UV Index: " + uviDisplay);

             //statement to change UV Index color based on #

        if (uviDisplay <= 2) {
            currentUvi.addClass("favorable");
            currentUvi.removeClass("moderate");
            currentUvi.removeClass("severe");
            console.log("1");
          } else if (uviDisplay >= 3 && uviDisplay <= 7) {
            currentUvi.removeClass("favorable");
            currentUvi.addClass("moderate");
            currentUvi.removeClass("severe");
            console.log("2");
          } else if (uviDisplay >= 8) {
            currentUvi.removeClass("favorable");
            currentUvi.removeClass("moderate");
            currentUvi.addClass("severe");
            console.log("3");
          }
          console.log(data.current);
        });
      }
    });
  }

// function to display 5 day forecast on html
function displayFiveDay(forecast) {
    $("#fiveDay").html("");
    forecast.forEach(function (day) {
      let daily = $("<div>");
      daily.attr("class", "column col-2 h-auto text-left");
      daily.attr("id", "dayBox");
      let date = $("<h6>");
      date.text(new Date(day.dt_txt).toLocaleDateString());
      daily.append(date);
      let icon5 = $("<img>");
      var iconCode = day.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      icon5.attr("src", iconUrl);
      daily.append(icon5);
      let temp = $("<h6>");
      let tempRound = Math.round(day.main.temp);
      temp.text("Temp:" + " " + tempRound + " °F");
      daily.append(temp);
  
      let icon = $("#fiveDay").append(daily);
      let humidity = $("<h6>");
      humidity.text("Humidity:" + " " + day.main.humidity + " %");
      daily.append(humidity);
    });
  };