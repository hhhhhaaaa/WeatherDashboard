// Push items into an array
// Pop items out of array when greater than 8 items
// Build off of form
const cityName = "Detroit";
let cityDate = $(".cityDate");
let iconCity = $(".iconCity");
let temp = $(".temp");
let humidity = $(".humidity");
let speed = $(".speed");
let uv = $(".UV");
let apiKey = "";

$(document).ready( () =>{
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`, data =>{
        let icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        console.log(data);
        let latitude = data.coord.lat;
        let longitutde = data.coord.lon
        cityDate.text(`${cityName} (${moment().format('L')})`);
        iconCity.attr('src', icon);
        temp.text(`Temperature: ${data.main.temp} °F`);
        humidity.text(`Humidity: ${data.main.humidity}%`);
        speed.text(`Wind Speed: ${data.wind.speed} MPH`)
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitutde}&appid=${apiKey}`, dataMore =>{
            console.log(dataMore);
            let uvi = dataMore.current.uvi;
            // let uviRound = Math.round(uvi);
            let uviRound = 10; 
            uv.text(`UV Index: ${uvi}`);
            if(uviRound == 1) {
                uv.css("background-color", "green");
            } else if(uviRound == 2) {
                uv.css("background-color", "lime");
            } else if(uviRound == 3) {
                uv.css("background-color", "yellow");
            } else if(uviRound == 4) {
                uv.css("background-color", "orange");
            } else if(uviRound == 5) {
                uv.css("background-color", "darkred");
            } else if(uviRound == 6) {
                uv.css("background-color", "red");
            } else if(uviRound == 7) {
                uv.css("background-color", "purple");
            } else if(uviRound == 8) {
                uv.css("background-color", "violet");
            } else if(uviRound == 9) {
                uv.css("background-color", "pink");
            } else if(uviRound == 10) {
                uv.css("background-color", "silver");
            }
        })

    });
});
