define([], function () {
  function JsDefaults() {};

  // static properties
  JsDefaults.facebook = {
    /*
    LOCAL
    appId: '415256608538274',

    STAGE
    appId: '416912428373385',
    */

    appId: '415256608538274', // App ID
    channelUrl: '//+window.location.hostname+/channel.html', // Channel File
    status: true, // check login status
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse XFBML
    fanpageUrl: 'http://www.facebook.com/pages/12378123hertz/188563874521119',
    fanpageId: 416912428373385
  };
  return JsDefaults;
});
