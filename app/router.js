define([
  // Application.
  "app",
  // Modules
  "modules/fbFriendSelector",
  "modules/bandBuilder",
  "modules/common"
],

function (app, FbFriendSelector, BandBuilder, Common) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({

    routes: {
      "": "index",
      "?*query": "index",
      "builder" : "app"
    }, // routes

    index: function (query) {
      app.useLayout({
        el: "#main",
        template: "layouts/intro"
      }).setViews({
        ".background": new Common.Views.GetStarted({})
      }).render().done(function () {

        window._gaq.push(['_trackPageview','step_1-LandingPage']);

        var urlParams = [],
            parseUrlParams = function () {
              var match,
                  pl     = /\+/g,  // Regex for replacing addition symbol with a space
                  search = /([^&=]+)=?([^&]*)/g,
                  decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                  query  = window.location.search.substring(1);

              while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            }; // parseUrlParams

        parseUrlParams();

        // Setting Campaign Tracking : https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiCampaignTracking

        if ("app_data" in urlParams){
          
          switch(urlParams["app_data"]){

            case "adshare":
              // Track traffic from Facebook - originating from ad unit
              window._gaq.push(
                ['_setCampSourceKey', 'facebook'],
                ['_setCampMediumKey', 'social-share-link'],
                ['_setCampNameKey', 'live-nation-rockstar-adunit']
              );
              break;

            case "twitter":
              // Track traffic from Twitter - originating from ad unit
              window._gaq.push(
                ['_setCampSourceKey', 'twitter'],
                ['_setCampMediumKey', 'social-share-link'],
                ['_setCampNameKey', 'live-nation-rockstar-adunit']
              );
              break;

            case "wallpost":
              // Track traffic from Facebook - originating from band wall post
              window._gaq.push(
                ['_setCampSourceKey', 'facebook'],
                ['_setCampMediumKey', 'in-app-feed-post'],
                ['_setCampNameKey', 'live-nation-rockstar-viral']
              );
              break;

          }; //switch

        } else if (urlParams["fb_source"] == "notification" && urlParams["notif_t"] == "app_request"){

          // Track traffic from Facebook - originating from app requsts 
          window._gaq.push(
            ['_setCampSourceKey', 'facebook'],
            ['_setCampMediumKey', 'in-app-referral'],
            ['_setCampNameKey', 'live-nation-rockstar-viral']
          );

        } else if ("fb_source" in urlParams){

          // https://developers.facebook.com/docs/fb_source/
          // Track traffic from Facebook Like, Send and anything else from Facebook as Campaign traffic
          window._gaq.push(
              ['_setCampSourceKey', 'facebook'],
              ['_setCampMediumKey', urlParams["fb_source"]],
              ['_setCampNameKey', 'live-nation-rockstar-viral'],
              ['_setCampContentKey', urlParams['fb_ref']]
          );

        }; // if block


      });
    }, // index

    app: function () {
      app.useLayout({
        el: "#main",
        template: "layouts/app"
      }).setViews({
        ".fbFriendSelectorContainer": new FbFriendSelector.Views.Default({}),
        ".bandBuilder": new BandBuilder.Views.Default({})
      }).render().done(function () {
        /* *** */
      });
    } // app

  }); // Router

  return Router;

});
