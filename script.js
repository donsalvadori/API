//First lets write down the constants
var apiUrl = 'http://api.wunderground.com/api/';
var apiKey = '625172310aff38a6';

//After the document loads, we need to pass a function which will execute after user press the button
$(document).ready(function(){
  var $submitBtn = $('#submitButton');
  var $inputZipCode1 = $('#inputZipCode1');
  var $inputZipCode2 = $('#inputZipCode2');

  // Every time user clicks "FIND DIFFERENCE" button, this function will execute
  $submitBtn.click(function(){
    // lets get values from the inputs
    var zipCode1 = $inputZipCode1.val();
    var zipCode2 = $inputZipCode2.val();

    //here we execute our function that makes remote calls to the wunderground servers
    getWeatherDataByZip(zipCode1, function(result1){      // <- this function will execute after response from the first query
      getWeatherDataByZip(zipCode2, function(result2){    // <- this function will exec after second query
        console.log(result1);
        if(result1.response.error) return alert('Error with zip code 1! ' + result1.response.error.description); // check for errors
        if(result2.response.error) return alert('Error with zip code 2! ' + result2.response.error.description); // check for errors

        displayData(result1, result2);  // <- we got all the data, let's display it
      })
    })
  })
});

/**
 * This function makes a remote call and returns weather and location data from the server
 * @param zipCode variable with zipcode, entered by user
 * @param callback function which will be executed after we get response
 */
function getWeatherDataByZip(zipCode, callback) {
  var callback = callback || function() {};

  $.ajax({
    url : apiUrl + apiKey + '/conditions/q/'+ zipCode +'.json', //the final url should be like this: http://api.wunderground.com/api/625172310aff38a6/conditions/q/10003.json
    dataType : "jsonp",
    success : function(parsed_json) {
      //we got the JSON that was automatically parsed.
      // you can see the example of the server result here: https://codeshare.io/feC55
      callback(parsed_json);
    }
  });
}


/**
 * Here we take variables from our objects and passing it to the html document
 * @param data1 query result for zip1
 * @param data2 query result for zip2 (example: https://codeshare.io/feC55)
 */
function displayData(data1, data2) {
  // in this function we just looking at the result object and picking data that we want to use.

  var $r1 = $('.result#result1');
  var loc1 = data1.current_observation.display_location;
  $('.zip',$r1).text(loc1.zip);
  $('.city',$r1).text(loc1.full);
  $('.country',$r1).text(loc1.country);

  $('.imgWeather', $r1).attr('src', 'http://icons.wxug.com/i/c/i/' + data1.current_observation.icon + '.gif');
  $('.weather', $r1).text(data1.current_observation.weather);
  $('.temp', $r1).text(data1.current_observation.temperature_string);


  var $r2 = $('.result#result2');
  var loc2 = data2.current_observation.display_location;
  $('.zip',$r2).text(loc2.zip);
  $('.city',$r2).text(loc2.full);
  $('.country',$r2).text(loc2.country);

  $('.imgWeather', $r2).attr('src', 'http://icons.wxug.com/i/c/i/' + data2.current_observation.icon + '.gif');
  $('.weather', $r2).text(data2.current_observation.weather);
  $('.temp', $r2).text(data2.current_observation.temperature_string);


  var $rDiff = $('.result#difference');
  $('.city1',$rDiff).text(loc1.full);
  $('.city2',$rDiff).text(loc2.full);

  // substracting one temperature from another, making right format and taking absolute value of it.
  var diff = Math.floor((data1.current_observation.temp_f - data2.current_observation.temp_f) * 100)/100;
  var diff = Math.abs(diff);
  diff = diff + ' F';
  $('.diff',$rDiff).text(diff);

  $r1.show();
  $r2.show();
  $rDiff.show();
}