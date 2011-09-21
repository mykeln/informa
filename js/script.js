$(function(){

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

// parsing string cookies as boolean for checkbox values
function parseBool(value) {
  if (typeof value === "string") {
     value = value.replace(/^\s+|\s+$/g, "").toLowerCase();
     if (value === "true" || value === "false")
       return value === "true";
  }
  return; // returns undefined
}

// simulating a keypress (in informa's case, a decimal)
function simulateKeyPress(character) {
  jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
}

// setting user cookie
function setCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

// getting a user cookie
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

// clears the user
function deleteCookie(name) {
  setCookie(name,"",-1);
}

// changes background between logging in and exercise form
function toggleBackground(state){
  if(state == false){
    // removing the background on the body and html
    $('body').css('background-color', '#efefef');
    $('html').css('background-color', '#efefef');
  } else {
    $('body').css('background-color', '#222');
    $('html').css('background-color', '#222');
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

// showing the form, making sure workouts are hidden
function showForm(){
  $("#workouts").hide();
	$("#tp_form").show();
}

function errorWorkout(message) {
  console.log(message);
  return false;
}

// function for parsing the xml data and synthesizing it on the presentation layer
function showDietForm(){
	// getting stored values for items if they exist
	// morning comp
	var mornWeightSet = getCookie('morn_w');	
	var mornBfSet = getCookie('morn_bf');
	var mornBwSet = getCookie('morn_bw');
	
	// evening comp
	var eveWeightSet = getCookie('eve_w');
	var eveBfSet = getCookie('eve_bf');
	var eveBwSet = getCookie('eve_bw');
	
	// done checkbox state
	var supplementsDoneSet =  parseBool(getCookie('supplements_done'));
	var mealsDoneSet =  parseBool(getCookie('meals_done'));
	var hydratedDoneSet = parseBool(getCookie('hydrated_done'));
	
	// trigger checkbox state
	var supplementsTriggerSet =  parseBool(getCookie('supplements_trigger'));
	var mealsTriggerSet =  parseBool(getCookie('meals_trigger'));
	var hydratedTriggerSet =  parseBool(getCookie('hydrated_trigger'));
	
	// comments
	var supplementsCommentSet = getCookie('supplements_comment');
	var mealsCommentSet = getCookie('meals_comment');
	var hydratedCommentSet = getCookie('hydrated_comment');
	var eveCommentSet = getCookie('eve_comment');
	
	// sleep quality
	var sleepSet = getCookie('sleep_quality');
	if (sleepSet == undefined){
		sleepSet = 6;
	}
	
	// setting the form state to the stored cookie values
	// if they don't exist, that's okay, it will just stay with the default
	// morning comp
	$('#morn_w').val(mornWeightSet);
	$('#morn_bf').val(mornBfSet);
	$('#morn_bw').val(mornBwSet);

	// evening comp
	$('#eve_w').val(eveWeightSet);
	$('#eve_bf').val(eveBfSet);
	$('#eve_bw').val(eveBwSet);
	
	// done checkbox state
	$('#supplements_done').attr('checked',supplementsDoneSet);
	$('#meals_done').attr('checked',mealsDoneSet);
	$('#hydrated_done').attr('checked',hydratedDoneSet);
	
	// trigger checkbox state
	$('#supplements_trigger').attr('checked',supplementsTriggerSet);
	$('#meals_trigger').attr('checked',mealsTriggerSet);
	$('#hydrated_trigger').attr('checked',hydratedTriggerSet);
	
	if (supplementsTriggerSet == true){
		$('#supplements_comment').show();
		console.log()
	}
	if (mealsTriggerSet == true){
		$('#meals_comment').show();
	}
	if (hydratedTriggerSet == true){
		$('#hydrated_comment').show();
	}
	
	// comments
	$('#supplements_comment').val(supplementsCommentSet);
	$('#meals_comment').val(mealsCommentSet);
	$('#hydrated_comment').val(hydratedCommentSet);
	$('#eve_comment').val(eveCommentSet);
	
	// sleep quality
	$('#sleep_quality').val(sleepSet);
	$('#sleep_counter').html(sleepSet);

  // appending the date at the very bottom of the presentation
  $("h4 span").html(todaysDate);

  // removing the background on the body and html
  toggleBackground(false);

  // hiding the form, showing the workout
  $("#workouts").fadeIn('fast');
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

function submitBodyComp(bodyCompData){
  // detecting if inside phonegap to not trigger proxy php
  var proxySet;

  if(window.PhoneGap){
    proxySet = "http://www.trainingpeaks.com/tpwebservices/service.asmx/ImportFileForUser";
  } else {
    proxySet = "proxy.php";
  }

/*
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
*/

var email = "rick@rickkattouf.com";
var subject = "Body composition for " + todaysDate;

// validation checks
// testing if email address was entered appropriately
var emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// if email validation checks out, send the email
 if(email.length > 0 && emailRegex.test(email)){

	console.log('sending mail to: ' + email);

	// creating the email url that also contains the data
	to_email = "mailto:" + email + "?subject=" + subject + "&body=" + bodyCompData;

	// redirecting user to the email link
	window.location.href = to_email;

	clearData();
} else {
	console.log('whoops, something is wrong with what the user input');
	alert("Email address isn't in the correct format.")
}


}

// showing comment field if the checkbox is clicked
$('.check_comment').click(function(){
	// must do next 3 times to step to the textarea element
	$(this).next().next().next().slideToggle('fast');
});

// if data changes, set the cookie
$('#workouts input[type="number"]').change(function() {
	var inputChanged = $(this).attr('id');
	var inputValue = $(this).val();
	
	setCookie(inputChanged, inputValue, 9999);
});

$('#workouts input[type="checkbox"]').change(function() {
	var inputChanged = $(this).attr('id');
	var inputValue = $(this).attr('checked');
		
	setCookie(inputChanged, inputValue, 9999);
});

$('#workouts input[type="range"]').change(function() {
	var inputChanged = $(this).attr('id');
	var inputValue = $(this).val();
	
	setCookie(inputChanged, inputValue, 9999);
});

$('#workouts textarea').change(function() {
	var inputChanged = $(this).attr('id');
	var inputValue = $(this).val();
	
	setCookie(inputChanged, inputValue, 9999);
});



// click handler. checks data submitted for errors, converts to byte data for trainingpeaks
// this is a terribly bad way to do it. for future versions, make it an each that enumerates
$('#log_submit').click(function() {
	
	var bodyCompData = [] ;
	var name;
	var value;
	var checked;

	// morning inputs
	name = "<b>Morning</b>";
	value = "";
	bodyCompData.push({'name':name,'value':value});
	
	$('#morning input[type="number"]').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			name = $(this).data('descriptor');
			// setting value of input
			value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
						
		}
	});
	
	// evening inputs
	name = "<br/><b>Evening</b>";
	value = "";
	bodyCompData.push({'name':name,'value':value});
	
	$('#evening input[type="number"]').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			name = $(this).data('descriptor');
			// setting value of input
			value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
						
		}
	});


	// checkboxes
	name = "<br/><b>Plan Details</b>";
	value = "";
	bodyCompData.push({'name':name,'value':value});
	
	
	$("#workouts input[type='checkbox']").not("[name$='trigger']").each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			name = $(this).data('descriptor');
			checked = $(this).attr('checked');
			
			if(checked == true) {
				value = "Yes"
			} else {
				value = "No";
			}
			
			bodyCompData.push({'name':name,'value':value});
			
		}
	});
	
	// sleep range
	name = "<br/><b>Sleep</b>";
	value = "";
	bodyCompData.push({'name':name,'value':value});
	
	$('#workouts input[type="range"]').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			name = $(this).data('descriptor');
			value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
		}
	});

	// textareas 
	name = "<br/><b>Comments</b>";
	value = "";
	bodyCompData.push({'name':name,'value':value});
	
	$('#workouts textarea').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			name = $(this).data('descriptor');
			value = $(this).val();
		
			bodyCompData.push({'name':name + "<br/>",'value':value});
		}

	});
	
	// gathering items in the array and pulling them out into a single object
	var singleData = {};
	var finalObject = "";
	
	$.each(bodyCompData , function(i,e) {
		singleData[e.name] = e.value;
		
		finalObject += e.name + ": " + singleData[e.name] + "<br />";		
	});

	// Once everything's checked out, submit it
	submitBodyComp(finalObject);

});


// click handler. assigns cookie, passes cookie variables to the queryTrainingPeaks function
$('#tp_submit').click(function() {
  if((!$('[name=username]').val() || (!$('[name=password]').val()))) {
    alert('Informa needs a username and password.')
    return false;
  }

  $('#loading_message').slideDown('fast');

  var username = $('[name=username]').val();
	var password = $('[name=password]').val();

	setCookie('tp_username', username, 9999);
	setCookie('tp_password', password, 9999);

	queryTrainingPeaks(username,password);

});

// updates sleep slider
$("input[type=range]").change(function(){
	var sleepValue = $("input[type=range]").val();
	$('#sleep_counter').html(sleepValue);
});


// removing the user, sending back to form
$('#clear_user').click(function() {
	clearData();
  clearUser();
});

function clearData() {
	// getting stored values for items if they exist
	// morning comp
	deleteCookie('morn_w');		
	deleteCookie('morn_bf');
	deleteCookie('morn_bw');
	
	// evening comp
	deleteCookie('eve_w');
	deleteCookie('eve_bf');
	deleteCookie('eve_bw');
	
	// done checkbox state
	deleteCookie('supplements_done');
	deleteCookie('meals_done');
	deleteCookie('hydrated_done');
	
	// trigger checkbox state
	deleteCookie('supplements_trigger');
	deleteCookie('meals_trigger');
	deleteCookie('hydrated_trigger');
	
	// comments
	deleteCookie('supplements_comment');
	deleteCookie('meals_comment');	
	deleteCookie('hydrated_comment');
	deleteCookie('eve_comment');
	
	// sleep quality
	deleteCookie('sleep_quality');
}

function clearUser(){
  deleteCookie('tp_username');
  deleteCookie('tp_password');

  console.log("Removing association with user");

  toggleBackground(true);

  // clearing login form values
  $('[name=username]').val('');
  $('[name=password]').val('');

  showForm();
}


}); // end of document ready