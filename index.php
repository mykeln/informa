

﻿<!doctype html>
<!--[if IEMobile 7 ]>    <html class="no-js iem7" manifest="default.appcache?v=1"> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!-- <html class="no-js" manifest="default.appcache?v=1"> --> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <title>Informa</title>
  
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="HandheldFriendly" content="True">
  <meta name="MobileOptimized" content="320"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="cleartype" content="on">
  
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />

  <link rel="apple-touch-startup-image" href="startup.png" />

  <link rel="apple-touch-icon-precomposed" href="touch-icon-iphone.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="touch-icon-ipad.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="touch-icon-iphone4.png" />
      
  <link rel="shortcut icon" href="touch-icon-iphone.png">
  
  <!-- styles --> 
  <link rel="stylesheet" href="css/style.css?v=1">  
    
  <!-- scripts -->
  <script src="js/libs/modernizr-custom.js"></script>

  
</head>

<body>

  <div id="container">

    <div id="main" role="main">
      
      <div id="loading_message">
        Loading...
      </div>

      <div id="tp_form">
        <form id="form" onsubmit="return false;">
          <fieldset>
            <label><input type="email" name="email" placeholder="Coach Email Address" /></label>
            <!--
            <label><input type="text" name="username" placeholder="TrainingPeaks Username" /></label>
            <label><input type="password" name="password" placeholder="Password" /></label>
          -->
          </fieldset>
          <fieldset>
            <input type="submit" id="tp_submit" value="Set User">
          </fieldset>
        </form>
      </div>
      
      <div id="workouts">

        <form id="form" onsubmit="return false;">
          <fieldset id="morning">            
            <h2>Morning</h2>
            <input id="morn_w" type="number" data-descriptor="Weight" min="90" max="500" maxlength="6" placeholder="Weight" />
            <input id="morn_bf"  type="number" data-descriptor="Body Fat %" min="3" max="75" maxlength="5" placeholder="Fat %" />
            <input id="morn_bw"  type="number" class="last" data-descriptor="Body Water %" min="3" max="75" maxlength="5" placeholder="Water %" />    
          </fieldset>
          <fieldset id="evening">
            <h2>Evening</h2>
            <input id="eve_w" type="number" data-descriptor="Weight"  min="90" max="500" maxlength="6" placeholder="Weight" />
            <input id="eve_bf"type="number" data-descriptor="Body Fat %"  min="3" max="75" maxlength="5" placeholder="Fat %" />
            <input id="eve_bw" type="number" class="last" data-descriptor="Body Water %"  min="3" max="75" maxlength="5" placeholder="Water %" />
            <textarea id="eve_comment" data-descriptor="Comments" placeholder="Comments" /></textarea>
          </fieldset>
          <fieldset id="more_information">
            <h2>More Information</h2>
            <div class="extra_item">
              <input id="supplements_trigger" type="checkbox" name="supplements_more_trigger" class="check_comment" />
              <input class="fastrespond" id="supplements_done" type="checkbox" data-descriptor="All supplements consumed" />
              <span>All Supplements Consumed</span>
              <textarea id="supplements_comment" data-descriptor="Supplement Comments" class="x-textarea" placeholder="Comments" /></textarea>              
            </div>
            <div class="extra_item">
              <input id="meals_trigger" type="checkbox"  name="meals_more_trigger" class="check_comment" />
              <input class="fastrespond" id="meals_done" type="checkbox" data-descriptor="All meals consumed" />
              <span>All Meals Consumed</span>
              <textarea id="meals_comment" data-descriptor="Food Comments" class="x-textarea" placeholder="Comments" /></textarea>
            </div>
            <div class="extra_item">
              <input id="hydrated_trigger" type="checkbox"  name="hydrated_more_trigger" class="check_comment" />
              <input class="fastrespond" id="hydrated_done" type="checkbox" data-descriptor="Properly hydrated" />
              <span>Properly Hydrated</span>
              <textarea id="hydrated_comment" data-descriptor="Hydration Comments" class="x-textarea" placeholder="Comments" /></textarea>
            </div>
          </fieldset>
          <fieldset>
            <h2>Sleep Quality<span id="sleep_counter">6</span></h2>
            <input id="sleep_quality" data-descriptor="Quality" type="range" min="1" max="10" />
          </fieldset>
          <fieldset>
            <input type="submit" id="log_submit" value="Send Report">
          </fieldset>
        </form>
        <h4><span></span><a id="clear_user" href="#">&times;</a></h4>
      </div>
      
      
    </div>
  </div> <!--! end of #container -->

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js"></script>
  <script>window.jQuery || document.write("<script src='js/libs/jquery-1.5.1.min.js'>\x3C/script>")</script>
  
  <!-- other scripts -->
  <script src="js/libs/date.js"></script>
  <script src="js/libs/bookmark_bubble.js"></script>
  
  
  <!-- scripts concatenated and minified via ant build script -->
  <script src="js/mylibs/helper.js"></script>
  <!-- end concatenated and minified scripts-->
  
  <script>
    MBP.scaleFix();
    yepnope({
      test : Modernizr.mq('(min-width)'),
      nope : ['js/libs/respond.min.js']
    });
  </script>
  
  <script src="js/script.js"></script>  
  <script src="js/libs/jquery.tappable.js"></script>
</body>
</html>
