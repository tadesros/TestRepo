
//Global object for default location
const defaultLocation = {
    latitude: 0,
    longitude: 0,
    status: ""
};

//Start Running Code after the page has loaded
document.onreadystatechange = function () {   
        //Check the value on the DOM state - if it's 'interactive' then the DOM has loaded
        if (document.readyState === "interactive") {

            //Handle click event for toggle dark/light mode
            darkLightToggle();   

            //Add event listener to get weather information when button is clicked
            document.getElementById('getWeatherButton').addEventListener('click', getAndSetLocationData);
       }//End DOM State Interactive
}; //End DOM Loaded


/**        FUNCTION DEFINITIONS            **/

/**
 *    Function: getLocationData()
 */
async function getAndSetLocationData() {

    //DATA VARIABLES NEEDED
    const weatherApiKey = 'fd117bcbd00f84136a9205f9ac542b05';
    const newsApiKey = '7d5998bd20654f41b017b2aa49d042a1';          // Replace with your News API key
    const googleApiKey = 'AIzaSyB2-Lhgprfg0zzJjoe54MBlUeO27U3PBw8'; // Replace with your Google Maps API key
    const locationInput = document.getElementById('location');
    const location = locationInput.value;
    

    /*FETCH THE WEATHER DATA*/
    try {
        // Fetch weather data
        const weatherResponse = await fetch(`http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${location}`);
        const weatherData = await weatherResponse.json();

        console.log('Weather API Response:', weatherData);

        //Fetch Weather
        if (weatherResponse.ok) {

            const resultElement = document.getElementById('result');

            if (weatherData.location && weatherData.current && weatherData.current.weather_descriptions && weatherData.current.weather_descriptions.length > 0) {
              
                //Values from Weather API
                const weatherDescription = weatherData.current.weather_descriptions[0];
                const tempC = weatherData.current.temperature;
                const tempF = getFahrenheitFromCelsius(tempC);
                const uvIndex = weatherData.current.uv_index;
                const humidity = weatherData.current.humidity;
                const windSpeedKMH = weatherData.current.wind_speed;          
                const windSpeedMPH = convertKMtoMPH(windSpeedKMH);
                const localTimeAndDate = weatherData.location.localtime;

                const nameValue = weatherData.location.name;
                const regionValue = weatherData.location.region;
                const countryValue = weatherData.location.country;
              
                //Split string to get time from Date
                const myDateTimeArray = localTimeAndDate.split(" ");              
                let localTime = militaryToStandardTime(myDateTimeArray[1]);

                 //Set Time
                  const elTimeElement = document.getElementById('time');
                  elTimeElement.textContent = `${localTime}`;

                //Assign Weather values to page 
                const elDescript = document.getElementById('weatherDesc');
                elDescript.textContent = `${weatherDescription}`;                

                const elTempF = document.getElementById('tempF');
                elTempF.textContent = `${tempF}°F`;

                 const elTempC = document.getElementById('tempC');
                 elTempC.textContent = `${tempC} °C`;

                 const elHum = document.getElementById('humidity');
                 elHum.textContent = `${humidity} %`; 

                const elUV = document.getElementById('uvIndex');
                elUV.textContent = `${uvIndex}`;              

                const elWinSpeedMPH = document.getElementById('windSpeedMPH');
                elWinSpeedMPH.textContent = `${windSpeedMPH} mp/h`; 

                const elWinSpeedKMH = document.getElementById('windSpeedKMH');
                elWinSpeedKMH.textContent = `${windSpeedKMH} km/h`;             

                //Name
                const nameElement = document.getElementById('nameId');
                nameElement.textContent = `${nameValue}`;

                //Region
                const locationElement = document.getElementById('regionId');
                locationElement.textContent = `${regionValue}`;

               //Country
               const countryElement = document.getElementById('countryId');
               countryElement.textContent = `${countryValue}`;


                /*    // Fetch latitude and longitude of the location
                const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${googleApiKey}`);
                const geocodeData = await geocodeResponse.json();  ]
                            //Check data
                 if (geocodeResponse.ok && geocodeData.results.length > 0) {
                    const { lat, lng } = geocodeData.results[0].geometry.location;

                    // Fetch current time based on location's latitude and longitude using Time Zone API
                    //const timeZoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${googleApiKey}`);
                 
                   //  const currentTimeInSeconds = getTimestampInSeconds();
                   //  const timeZoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${currentTimeInSeconds}&key=${googleApiKey}`);                 
                  //   const timeZoneData = await timeZoneResponse.json();                     
                     //Output 
                  //      console.log(timeZoneData);
                  //      console.log(testNewDate());
                    //Check if time api fetch ok
                //    if (timeZoneResponse.ok && timeZoneData.status === 'OK') {


                        //The local time of a given location is the sum of the timestamp parameter, and the dstOffset and rawOffset fields from the result.
                 //        const currentSeconds = (currentTimeInSeconds + timeZoneData.dstOffset + timeZoneData.rawOffset);
                        //Turn result to milliseconds
                //         const currentTimeForConversion = currentSeconds * 1000;

                 //        const currentTime = new Date(currentTimeForConversion);

                //         console.log(currentTime);


                 //        let localDate = new Date((currentTimeInSeconds + timeZoneData.dstOffset + timeZoneData.rawOffset) * 1000);

                //         console.log(localDate.getHours());

             //           const currentTimeMillis = Math.floor(Date.now() / 1000) + timeZoneData.dstOffset + timeZoneData.rawOffset;
             //           const currentTime = new Date(currentTimeMillis * 1000);
                       
                //    } else {
                 //       throw new Error('Error fetching time data.');
                    //   }
                } else {
                    throw new Error('Error fetching coordinates.');
                }
            */

                const mapElement = document.getElementById('map');
                const latitude = Number(weatherData.location.lat);
                const longitude = Number(weatherData.location.lon);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    updateMap(mapElement,latitude,longitude);
                
                } else {
                    console.error('Invalid coordinates for map initialization:', latitude, longitude);
                }
            } else {
                throw new Error('Weather data structure is not as expected.');
            }
        } else {
            throw new Error(`Error: ${weatherData.error.info}`);
        }

        // Fetch news
        const newsResponse = await fetch(`https://newsapi.org/v2/top-headlines?q=${location}&apiKey=${newsApiKey}`);
        const newsData = await newsResponse.json();

        if (newsResponse.ok) {
            displayNews(newsData.articles);
        } else {
            throw new Error(`Error fetching news: ${newsData.message}`);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your API keys and try again.');
    }
}
/**
 *    Function: setDefaultInformation()
 */
async function setDefaultInformation(latitude, longitude) {

    /**DATA VARIABLES NEEDED */
    const weatherApiKey = 'f2e11fefb43702039ecec5423305be7f';
    const newsApiKey = '7d5998bd20654f41b017b2aa49d042a1'; // Replace with your News API key
    const googleApiKey = 'AIzaSyB2-Lhgprfg0zzJjoe54MBlUeO27U3PBw8'; // Replace with your Google Maps API key
    const locationInput = document.getElementById('location');
    const location = locationInput.value;
        

    /*FETCH THE WEATHER DATA*/
    try {
        // Fetch weather data
        const weatherResponse = await fetch(`http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${latitude},${longitude}`);
        const weatherData = await weatherResponse.json();

        console.log('Weather API Response:', weatherData);

        if (weatherResponse.ok) {
            const resultElement = document.getElementById('result');

            if (weatherData.location && weatherData.current && weatherData.current.weather_descriptions && weatherData.current.weather_descriptions.length > 0) {
                //Data Variables from API
                const weatherDescription = weatherData.current.weather_descriptions[0];
                const tempC = weatherData.current.temperature;
                const tempF = getFahrenheitFromCelsius(tempC);
                const uvIndex = weatherData.current.uv_index;
                const humidity = weatherData.current.humidity;
                const windSpeedKMH = weatherData.current.wind_speed;          
                const windSpeedMPH = convertKMtoMPH(windSpeedKMH);


                //Assign Weather values to page 
                const elDescript = document.getElementById('weatherDesc');
                elDescript.textContent = `${weatherDescription}`;                

                const elTempF = document.getElementById('tempF');
                elTempF.textContent = `${tempF}°F`;

                 const elTempC = document.getElementById('tempC');
                 elTempC.textContent = `${tempC} °C`;

                 const elHum = document.getElementById('humidity');
                 elHum.textContent = `${humidity} %`; 

                const elUV = document.getElementById('uvIndex');
                elUV.textContent = `${uvIndex}`;              

                const elWinSpeedMPH = document.getElementById('windSpeedMPH');
                elWinSpeedMPH.textContent = `${windSpeedMPH} mp/h`; 

                const elWinSpeedKMH = document.getElementById('windSpeedKMH');
                elWinSpeedKMH.textContent = `${windSpeedKMH} km/h`; 

/* 
                // Fetch latitude and longitude of the location
                const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${googleApiKey}`);
                const geocodeData = await geocodeResponse.json();

                if (geocodeResponse.ok && geocodeData.results.length > 0) {
                    const { lat, lng } = geocodeData.results[0].geometry.location;

                    // Fetch current time based on location's latitude and longitude using Time Zone API
                    //const timeZoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${googleApiKey}`);
                 
                     const currentTimeInSeconds = getTimestampInSeconds();
                     const timeZoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${currentTimeInSeconds}&key=${googleApiKey}`);                 
                     const timeZoneData = await timeZoneResponse.json();                     
                     //Output 
                        console.log(timeZoneData);
                        console.log(testNewDate());
                    //Check if time api fetch ok
                    if (timeZoneResponse.ok && timeZoneData.status === 'OK') {


                        //The local time of a given location is the sum of the timestamp parameter, and the dstOffset and rawOffset fields from the result.
                         const currentSeconds = (currentTimeInSeconds + timeZoneData.dstOffset + timeZoneData.rawOffset);
                        //Turn result to milliseconds
                         const currentTimeForConversion = currentSeconds * 1000;

                         const currentTime = new Date(currentTimeForConversion);

                         console.log(currentTime);


                         let localDate = new Date((currentTimeInSeconds + timeZoneData.dstOffset + timeZoneData.rawOffset) * 1000);

                         console.log(localDate.getHours());

             //           const currentTimeMillis = Math.floor(Date.now() / 1000) + timeZoneData.dstOffset + timeZoneData.rawOffset;
             //           const currentTime = new Date(currentTimeMillis * 1000);

                        const timeZoneNameValue = timeZoneData.timeZoneName;
                        const timeZoneLocationValue = timeZoneData.timeZoneId;

                        // Display time zone Name
                        const timeZoneNameElement = document.getElementById('timeZoneName');
                        timeZoneNameElement.textContent = `${timeZoneNameValue}`;

                        // Display time zone Location
                        const timeZoneLocationElement = document.getElementById('timeZoneLocation');
                        timeZoneLocationElement.textContent = `${timeZoneLocationValue}`;


                        const timeElement = document.getElementById('time');
                        timeElement.textContent = `${currentTime.toLocaleTimeString()}`;
                    } else {
                        throw new Error('Error fetching time data.');
                    }
                } else {
                    throw new Error('Error fetching coordinates.');
                }

                const mapElement = document.getElementById('map');
                const latitude = Number(weatherData.location.lat);
                const longitude = Number(weatherData.location.lon);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    updateMap(mapElement,latitude,longitude);
                
                } else {
                    console.error('Invalid coordinates for map initialization:', latitude, longitude);
                } */
            } else {
                throw new Error('Weather data structure is not as expected.');
            }
        } else {
            throw new Error(`Error: ${weatherData.error.info}`);
        }

        // Fetch news
        const newsResponse = await fetch(`https://newsapi.org/v2/top-headlines?q=${location}&apiKey=${newsApiKey}`);
        const newsData = await newsResponse.json();

        if (newsResponse.ok) {
            displayNews(newsData.articles);
        } else {
            throw new Error(`Error fetching news: ${newsData.message}`);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your API keys and try again.');
    }
}
/**
 * Function: displayNews
 * @param {} articles 
 */
function displayNews(articles) {
    const newsElement = document.getElementById('news');
    newsElement.innerHTML = '';

    if (articles.length > 0) {
        const newsList = document.createElement('ul');

        articles.forEach(article => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${article.title}</strong><br>${article.description}<br><a href="${article.url}" target="_blank">Read more</a>`;
            newsList.appendChild(listItem);
        });

        newsElement.appendChild(newsList);
    } else {
        newsElement.innerHTML = 'No news available for the selected location.';
    }
}
/**
 * Function: Dark/Light Toggle
 */
function darkLightToggle()
{

const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
    }
  
})

}
/**
 * getFahrenheitFromCelsius
 * @param {} celsius 
 * @returns 
 */
function getFahrenheitFromCelsius(celsius){

 
    let farCalc = (celsius * (9/5)) + 32;

    let farTemp = Math.round(farCalc);

    return farTemp;
}
/**
 *  convertKMtoMP
 */
function convertKMtoMPH(valNum) {

    let result = valNum/1.609344

    result = Math.round(result);


    return result;
  
}
/**
 *    Get latitude and longitude
 */
async function getDefaultLatLong()
{
 

    const successCallback = (position) => {
        console.log("Position");
        console.log(position);
        const { coords } = position;
        defaultLocation.latitude = coords.latitude;
        defaultLocation.longitude = coords.longitude;
        return position;
        
      };
      
      const errorCallback = (error) => {
        console.log(error);
        return error;
      };
      
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  
}
/**
 * Function: initMap
 * @param {} mapElement 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function initMap() {


     const mapElement = document.getElementById('map');
     const latitude =   Number(defaultLocation.latitude);
     const longitude =  Number(defaultLocation.longitude);

    //CHeck Latitude and Longitude values if valid
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates for map initialization:', latitude, longitude);
        return;
    }

    //Create a map object
    const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 10
    });

    //Add Traffic Layer to the map
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    //Set marker
    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'City Location'
    });

    //If GeoLocation is valid set to current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
           initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
           updateMap(mapElement, position.coords.latitude, position.coords.longitude);

          setDefaultInformation(position.coords.latitude,position.coords.longitude);
        });
    }
}
/**
 * Call this function to update map location
 * @param {} mapElement 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function updateMap(mapElement, latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates for map initialization:', latitude, longitude);
        return;
    }

    const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 10
    });

    // Add Traffic Layer to the map
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'City Location'
    });

    const $info = document.getElementById('info');
    $info.textContent = `Lat: ${latitude.toFixed(5)} Lng: ${longitude.toFixed(5)}`;


}
/**
 * Function: MilitaryToStandartTime
 * @param {} militaryTime 
 * @returns 
 */
function militaryToStandardTime(militaryTime) {
    var timeArray = militaryTime.split(":");
    var hours = Number(timeArray[0]);
    var minutes = timeArray[1];

    // Calculate standard time
    var timeValue;
    if (hours > 0 && hours <= 12) {
        timeValue = "" + hours;
    } else if (hours > 12) {
        timeValue = "" + (hours - 12);
    } else if (hours === 0) {
        timeValue = "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;

    // Add AM or PM
    timeValue += (hours >= 12) ? " P.M." : " A.M.";

    return timeValue;
}