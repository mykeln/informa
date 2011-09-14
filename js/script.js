$(function(){

window.scrollTo(0, 0);

/*
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
UTILITY FUNCTIONS
////////////////////////////////////////
*/

var xmlDateToJavascriptDate = function(xmlDate) {
  // It's times like these you wish Javascript supported multiline regex specs
  var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+-])([0-9]{2}):([0-9]{2}))?$/;
  var match = xmlDate.match(re);
  if (!match)
    return null;

  var all = match[0];
  var year = match[1];  var month = match[2];  var day = match[3];
  var hour = match[4];  var minute = match[5]; var second = match[6];
  var milli = match[7]; 
  var z_or_offset = match[8];  var offset_sign = match[9]; 
  var offset_hour = match[10]; var offset_minute = match[11];

  if (offset_sign) { // ended with +xx:xx or -xx:xx as opposed to Z or nothing
    var direction = (offset_sign == "+" ? 1 : -1);
    hour =   parseInt(hour)   + parseInt(offset_hour)   * direction;
    minute = parseInt(minute) + parseInt(offset_minute) * direction;
  }
  var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
  return new Date(utcDate);
}  
function setCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function deleteCookie(name) {
  setCookie(name,"",-1);
}

function toggleBackground(state){
  if(state == false){
    // removing the background on the body and html
    $('body').css('background-color', '#efefef');
    $('html').css('background-color', '#efefef');
  } else {
    $('body').css('background-color', '#33262e');
    $('html').css('background-color', '#33262e');
  }
}


/*
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
CORE CODE
////////////////////////////////////////
*/

// getting cookie values
var nameSet = getCookie('tp_username');
var passSet = getCookie('tp_password');

// getting today's date for query AND for displaying
var todaysDateRaw = new Date();
var todaysDate = todaysDateRaw.toString('MM-dd-yy');

// checking if cookie has been set. if it has, show the workout. otherwise, show the form.
if((nameSet != null) && (passSet != null)) {
  queryTrainingPeaks(nameSet,passSet);
  console.log("Cookie detected for user: " + nameSet);
} else {
  showForm();
  console.log("No cookie detected. Showing form");
}

function errorWorkout(message) {
  console.log(message);
  return false;
}

// function for parsing the xml data and synthesizing it on the presentation layer
function showDietForm(){

  // appending the date at the very bottom of the presentation
  $("h4 span").html(todaysDate);

  // removing the background on the body and html
  toggleBackground(false);

  // hiding the form, showing the workout
  $("#workouts").show();
  $("#tp_form").hide();

  $('#loading_message').slideUp('fast');
}


////////////////////////////////////////////////////
// FUNCTION TO SEE IF USER EXISTS WHEN LOGGING IN //
////////////////////////////////////////////////////
function queryTrainingPeaks(username,password){
	// this is used strictly to see if the user exists -- unused for gathering data

  // debug dates
  // todaysDate = '08/01/11';

  // detecting if inside phonegap to not trigger proxy php
  var proxySet;

  if(window.PhoneGap){
    proxySet = "http://www.trainingpeaks.com/tpwebservices/service.asmx/GetWorkoutsForAthlete";
  } else {
    proxySet = "proxy.php";
  }

  // path to the json we're pulling
  var logUrl = proxySet + "?username=" + username + "&password=" + password + "&startDate=" + todaysDate + "&endDate=" + todaysDate;

	console.log(logUrl);


  // grabbing xml and parsing
  $.ajax({
    type: "GET",
    url: logUrl,
    dataType: "xml",
    success: checkData,
    error: function(){ errorWorkout("Couldn't grab!"); }
  });
}

function checkData(xml){
  // [sic] parseRerror
  var parseError = $(xml).find("parsererror");

  // if the username/password was invalid, send back
  if (parseError.length == 0) {
    showDietForm(xml);
  } else {
    alert("The username or password was wrong.");
    $('#loading_message').slideUp('fast');
    clearUser();
  }
}
//////////
// END //
/////////

function submitBodyComp(username,password,bodycompdata){
  // debug dates
  // todaysDate = '08/01/11';

  // detecting if inside phonegap to not trigger proxy php
  var proxySet;

  if(window.PhoneGap){
    proxySet = "http://www.trainingpeaks.com/tpwebservices/service.asmx/ImportFileForUser";
  } else {
    proxySet = "proxy.php";
  }

	// setting bodyCompData
	

  // path to the json we're pulling
  var logUrl = proxySet + "?username=" + username + "&password=" + password + "&byteData=" + bodyCompData;

	console.log(logUrl);


  // grabbing xml and parsing
  $.ajax({
    type: "GET",
    url: logUrl,
    dataType: "xml",
    success: checkData,
    error: function(){ errorWorkout("Couldn't grab!"); }
  });
}


// showing the form, making sure workouts are hidden
function showForm(){
  $("#workouts").hide();
  $("#tp_form").show();
}

// showing comment field if the checkbox is clicked
$('.check_comment').click(function(){
	// must do next 3 times to step to the textarea element
	$(this).next().next().next().slideToggle('fast');
});

// click handler. checks data submitted for errors, converts to byte data for trainingpeaks
// this is a terribly bad way to do it. for future versions, make it an each that enumerates
$('#log_submit').click(function() {
	
  $('#loading_message').slideDown('fast');

	var byteData;

	// checking which variables are empty to compile byte data
	// morning values
	if($('[name=morn_weight]').length > 0) {
		var morn_weight = $('[name=morn_weight]').val();
		// append to byte data
		byteData = morn_weight;
	}
	
	if($('[name=morn_bf]').length > 0) {
		var morn_bf = $('[name=morn_bf]').val();
		// append to byte data
		byteData = byteData + morn_bf;
	}

	if($('[name=morn_bw]').length > 0) {
		var morn_bw = $('[name=morn_bw]').val();
		// append to byte data
		byteData = byteData + morn_bw;
	}
	
	// evening values
	if($('[name=eve_weight]').length > 0) {
		var eve_weight = $('[name=eve_weight]').val();
		// append to byte data
		byteData = byteData + eve_weight;
	}
	
	if($('[name=eve_bf]').length > 0) {
		var eve_bf = $('[name=eve_bf]').val();
		// append to byte data
		byteData = byteData + eve_bf;
	}
	
	if($('[name=eve_bw]').length > 0) {
		var eve_bw = $('[name=eve_bw]').val();
		// append to byte data
		byteData = byteData + eve_bw;
	}

	// checkboxes 
	if($('[name=supplements_done]').attr('checked')) {
		var supplements_done = "Yes";
	} else {
		var supplements_done = "No";
	}
	
	if($('[name=meals_done]').attr('checked')) {
		var meals_done = "Yes";
	} else {
		var meals_done = "No";
	}
	
	if($('[name=hydrated_done]').attr('checked')) {
		var hydrated_done = "Yes";
	} else {
		var hydrated_done = "No";
	}
		
	// comments
	if($('[name=morn_comments]').val()) {
		var morn_comments = $('[name=morn_comments]').val();
	}
	
	if($('[name=eve_comments]').val()) {
		var eve_comments = $('[name=eve_comments]').val();
	}
	
	if($('[name=supplements_textarea]').val()) {
		var supplements_comment = $('[name=supplements_textarea]').val();
	}
	
	if($('[name=meals_textarea]').val()) {
		var meals_comment = $('[name=meals_textarea]').val();
	}
	
	if($('[name=hydrated_textarea]').val()) {
		var hydrated_comment = $('[name=hydrated_textarea]').val();
	}

	// sleep quality
	if($('[name=sleep_quality]').val()) {
		var sleep_quality = $('[name=sleep_quality]').val();
	}


	// setting morning variables
	console.log(byteData);
	
	// Once everything's checked out, submit it
	//submitBodyComp(username,password,bodycompdata);

});


// click handler. assigns cookie, passes cookie variables to the queryTrainingPeaks function
$('#tp_submit').click(function() {
  if((!$('[name=username]').val() || (!$('[name=password]').val()))) {
    alert('Watts needs a username and password.')
    return false;
  }

  $('#loading_message').slideDown('fast');

  var username = $('[name=username]').val();
	var password = $('[name=password]').val();

	setCookie('tp_username', username, 9999);
	setCookie('tp_password', password, 9999);

	queryTrainingPeaks(username,password);

});

// removing the user, sending back to form
$('#clear_user').click(function() {
  clearUser();
});

function clearUser(){
  deleteCookie('tp_username');
  deleteCookie('tp_password');

  // clearing the contents of the workouts div
  $('#workouts h1').html('');
  $('#workouts h2').html('');
  $('#workouts p').html('');

  console.log("Removing association with user");

  toggleBackground(true);

  // clearing login form values
  $('[name=username]').val('');
  $('[name=password]').val('');

  showForm();
}

}); // end of document ready