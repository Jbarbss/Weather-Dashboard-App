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