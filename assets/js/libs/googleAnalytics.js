define(['jquery','jsdefaults'], function ($,JsDefaults) {

  
  var initialized = false;
  var fbLoaded = undefined;

  var _gaq = window._gaq || (window._gaq = []);
  _gaq.push(['_setAccount', JsDefaults.googleAnalyticsAccount]);
  if(window.location.hostname == 'localhost'){
    _gaq.push(['_setDomainName', 'none']);
  }

  if(initialized == false){
    initialized = true;
    (function() {
      var ga = document.createElement('script'); 
      ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; 
      s.parentNode.insertBefore(ga, s);
    })();
  }

  // Constructor
  function GoogleAnalytics() { /****/ }

  
  return (GoogleAnalytics);
});
