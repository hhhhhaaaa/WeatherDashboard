let cityName = "Detroit";
let cityDate = $(".cityDate");
let iconCity = $(".iconCity");
let temp = $(".temp");
let humidity = $(".humidity");
let speed = $(".speed");
let uv = $(".UV");
let apiKey = "b51b641219666b974b540f2b14ac7871";
let recent = $(".recentSearch");
let searchArray = [];
let input = $(".input");
let search = $(".search");
let clear = $(".clear");
let previousButton = $(".previous");
let retrieve = localStorage.getItem("cityData");


// A series of on click events, most prevent default.
input.submit(event => {
    event.preventDefault();
});

// Search button, with an alert for invalid information attached both here and at the fetch call
// Calls several functions in a specific order in order to save data, add it to the list, and prevent errors
search.on("click", event => {
    event.preventDefault();
    if(input.val() === "") {
        alert("Put in valid city!");
        return;
    }
    let searchInfo = input.val();
    cityName = searchInfo;
    callWeather(cityName);
    searchArray.unshift(searchInfo);
    addToArray();
    storage();
});

// Clear button, clears local storage and the array
clear.on("click", event => {
    event.preventDefault();
    localStorage.removeItem("cityData");
    searchArray = [];
    addToArray();
    storage();
})

// Buttons attached to recent searches
previousButton.on("click", event => {
    event.preventDefault();
    for (let i = 0; i < searchArray.length; i++) {
        cityName = searchArray[i];
        callWeather(cityName);
    }
});

// On document load, it runs these few functions to make sure everything is good and local storage is loaded
$(document).ready(() => {
    if (retrieve !== null && searchArray.length !== 0)  {
        searchArray = JSON.parse(retrieve);
        callWeather(searchArray[0]);
        storageLoad();
        addToArray();
    } else {
        callWeather(cityName);
        storageLoad();
        addToArray();
    }
});

// Adds search items to the array, creating the buttons and emptying the div when necessary
function addToArray() {
    if (searchArray.length > 0) {
        recent.empty();
    }
    for (let i = 0; i < searchArray.length; i++) {
        recent.append(`<button class="previous column col-12">${searchArray[i]}</button>`);
        while (searchArray.length > 8) {
            searchArray.pop();
        }
    }
}

// A function called on document load, simply loads the most recent local storage
function storageLoad() {
    if (retrieve !== null) {
        let cityArray = JSON.parse(retrieve);
        localStorage.setItem("cityData", JSON.stringify(cityArray));
        searchArray = JSON.parse(retrieve);
    }
}

// A function used to manage local storage. Took quite some time to make sure there were no errors whatsoever
function storage() {
    // If local storage is not null and the length of the history is greater than or equal to one...
    if (retrieve !== null && searchArray.length >= 1) {
        localStorage.setItem("cityData", JSON.stringify(searchArray));
        addToArray();
    // If only the search array is greater than or equal to one...
    } else if (searchArray.length >= 1) {
        localStorage.setItem("cityData", JSON.stringify(searchArray));
        storage();
        addToArray();
    // If search array is equal to 0...
    } else if (searchArray.length === 0) {
        searchArray.unshift(cityName);
        localStorage.setItem("cityData", JSON.stringify(searchArray));
        addToArray();
    // If there is nothing inside local storage;
    } else if (retrieve === null) {
        addToArray();
    }
}

// A function with one greater api call and two lesser. Holds over the text replacement and all of the right side of the page.
function callWeather(city) {
    // Call for initial city's weather
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`, data => {
        let icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        let latitude = data.coord.lat;
        let longitutde = data.coord.lon;
        cityDate.text(`${city} (${moment().format('L')})`);
        iconCity.attr('src', icon);
        temp.text(`Temperature: ${data.main.temp} °F`);
        humidity.text(`Humidity: ${data.main.humidity}%`);
        speed.text(`Wind Speed: ${data.wind.speed} MPH`)
        // Call for initial city's UV index
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitutde}&appid=${apiKey}`, dataUV => {
            let uvi = dataUV.current.uvi;
            let uviRound = Math.round(uvi);
            uv.text(`UV Index: ${uvi}`);
            if (uviRound == 0) {
                uv.css("background-color", "blue");
                uv.css("color", "white");
            } else if (uviRound == 1) {
                uv.css("background-color", "green");
            } else if (uviRound == 2) {
                uv.css("background-color", "lime");
            } else if (uviRound == 3) {
                uv.css("background-color", "yellow");
            } else if (uviRound == 4) {
                uv.css("background-color", "orange");
            } else if (uviRound == 5) {
                uv.css("background-color", "darkred");
            } else if (uviRound == 6) {
                uv.css("background-color", "red");
            } else if (uviRound == 7) {
                uv.css("background-color", "purple");
            } else if (uviRound == 8) {
                uv.css("background-color", "violet");
            } else if (uviRound == 9) {
                uv.css("background-color", "pink");
            } else if (uviRound == 10) {
                uv.css("background-color", "silver");
            }
        })
        // Call for initial city's forecast
        $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`, dataFuture => {
            for (let i = 1; i <= 5; i++) {
                let newDate = moment().add(i, "days");
                let select = $(`.${i}`);
                let date = dataFuture.list[6 * i];
                let iconDate = "https://openweathermap.org/img/wn/" + date.weather[0].icon + "@2x.png";
                select.html(
                    `<h3>${newDate.format("L")}</h3>
                     <img src="${iconDate}"></img> 
                     Temp: ${date.main.temp} °F \n
                     Humidity: ${date.main.humidity}%
                     `
                );
            }
        });
    })
    .fail(error =>{
        // Error prevention
        alert("Put in valid city!");
        console.log(error);
        searchArray.shift();
        storage();
        addToArray();
    });
}