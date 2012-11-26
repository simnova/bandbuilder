define([
  "app",

//Libs
  "backbone",
  "jquery",
  "facebookApi",
  "preloadjs"
//Libs with no export

  ],
  function (app, Backbone, $,FacebookApi) {
    var Views = {};

    Views.GetStarted = Backbone.View.extend({
      authorized:false,

      template: "common/getStarted",

      events: {
        "click .getstarted" : "getStarted"
      },

      getStarted: function(event){
        var view = this;
        var target = $(event.currentTarget);
        if(!view.authorized){
          window._gaq.push(['_trackEvent', 'FacebookAuthRequest','Show Dialog']);
          FB.login(function(response) {
            if (response.authResponse) {


              FB.api('/me/permissions',function(response){
                if(response.data[0]["publish_stream"] == 1){
                  view.authorized = true;
                  app.router.navigate('builder',true);
                  window._gaq.push(['_trackEvent', 'FacebookAuthRequest','User Granted Authorization']);
                }else{
                  view.authorized = false;
                  alert("You must authorize all permissions before continuing.");
                  window._gaq.push(['_trackEvent', 'FacebookAuthCheck','User Granted Authorization - Rejected publish_stream']);
                }
              });


            } else {
              // user didn't authorize just sit here and do nothing
              window._gaq.push(['_trackEvent', 'FacebookAuthRequest','User Rejected Authorization']);
            }
          }, {scope: 'publish_stream'});
        } else {

          app.router.navigate('builder',true);
        }
      },

      afterRender: function(){
        var view = this;

        var checkAuthResponseStatus = function(response) {
          if (response.status === 'connected') {
              // the user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
              FB.api('/me/permissions',function(response){
                if(response.data[0]["publish_stream"] == 1){
                  view.authorized = true;
                  window._gaq.push(['_trackEvent', 'FacebookAuthCheck','Already Authorized']);
                }else{
                  view.authorized = false;
                  window._gaq.push(['_trackEvent', 'FacebookAuthCheck','Already Authorized - not publish_stream']);
                }
              });
              
          } else if (response.status === 'not_authorized') {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              view.authorized = false;
              window._gaq.push(['_trackEvent', 'FacebookAuthCheck','Not Yet Authorized']);
          } else {
              // the user isn't logged in to Facebook.
              view.authorized = false;
              window._gaq.push(['_trackEvent', 'FacebookAuthCheck','Not Logged In']);
          }
        };

        //ensure this code only executes after FB has been intialized properly
        FacebookApi.Execute(function(){
         /* FB.Event.subscribe('auth.authResponseChange', function (response) {
            checkAuthResponseStatus(response);
          }); */
          FB.getLoginStatus(function(response) {
            checkAuthResponseStatus(response);
          }, true);
        })
      },

      initialize: function(){ 
        /* preload hover images, could do sprites, but this is easier for right now */
        var manifest = [];
        manifest.push({ src: "/assets/images/step-one-cta-hover.jpg"});
        manifest.push({ src: "/assets/images/share-app-hover.jpg"});
        manifest.push({ src: "/assets/images/book-now-hover.jpg"});
        manifest.push({ src: "/assets/images/complete-band-hover.jpg"});
        manifest.push({ src: "/assets/images/tickets_hover.png"});

        var loader = new window.createjs.PreloadJS();
        loader.setMaxConnections(30);
        loader.onComplete = function () {
          /* do nothing */
        };
        loader.loadManifest(manifest);
      },

      // Provide data to the template
      serialize: function () {
        //return this.model.toJSON();
      }

    });

    return Views;
  }
);