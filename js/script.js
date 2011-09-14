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


} else {
	console.log('whoops, something is wrong with what the user input');
	alert("Email address isn't in the correct format.")
}


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

	var bodyCompData = [] ;

	// inputs
	$('#workouts input[type="number"]').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			var name = $(this).data('descriptor');
			var value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
						
		}
	});


	// checkboxes	
	$('#workouts input:checked').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			var name = $(this).data('descriptor');
			var checked = $(this).attr('checked');
			
			if((name != "supplements_more_trigger") && (name != "meals_more_trigger") && (name != "hydrated_more_trigger")){
				if(checked == true) {
					bodyCompData.push({'name':name,'value':'Yes'});
				}
			}
		}
	});
	
	// sleep range
	$('#workouts input[type="range"]').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			var name = $(this).data('descriptor');
			var value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
		}
	});

	// textareas 
	$('#workouts textarea').each(function(index) {
		if($(this).val()){
			// assigning variables for key/value based on data in form
			var name = $(this).data('descriptor');
			var value = $(this).val();
		
			bodyCompData.push({'name':name,'value':value});
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