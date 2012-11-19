define([], function () {
  function JsDefaults() {};

  var production = "buildyourband.azurewebsites.net";
  var staging = "bandbuilder.soscale.com";
  var local = "localhost":


  // static properties
  JsDefaults.facebook = {
    channelUrl: '//+window.location.hostname+/channel.html', // Channel File
    status: true, // check login status
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse XFBML
    frictionlessRequests: true
  };


  switch(window.location.hostname){

    base staging:
      JsDefaults.facebook.appId = '416912428373385';
      JsDefaults.facebook.fanpageUrl= 'http://www.facebook.com/pages/12378123hertz/188563874521119';
      JsDefaults.facebook.fanpageId= 416912428373385;
      break;

    case local:
      JsDefaults.facebook.appId = '416912428373385';
      JsDefaults.facebook.fanpageUrl= 'http://www.facebook.com/pages/12378123hertz/188563874521119';
      JsDefaults.facebook.fanpageId= 416912428373385;
      break;

    case production:
    default:
      JsDefaults.facebook.appId = '552144748135209';
      JsDefaults.facebook.fanpageUrl= 'http://www.facebook.com/hertz';
      JsDefaults.facebook.fanpageId= 91062694654;
      break;

  }//switch

  return JsDefaults;
});
