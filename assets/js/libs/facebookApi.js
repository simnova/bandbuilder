define(['jquery','jsdefaults'], function ($,JsDefaults) {

  // Constructor
  var initialized = false;
  var fbLoaded = undefined;

  if(initialized == false){
    initialized = true;
    (function (d) {
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) { return; }
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    } (document));

    var defer = new $.Deferred();
    // ----------
    // Load the SDK Asynchronously

    window.fbAsyncInit = function () {
      FB.init(JsDefaults.facebook);
      FB.Canvas.setAutoGrow();
      defer.resolve();
    }
    fbLoaded = defer.promise();
  }

  function FacebookApi() {


    

  }
  FacebookApi.Execute = function(callback){
    fbLoaded.done(callback);
  };
  
  return (FacebookApi);
});



