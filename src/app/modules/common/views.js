define([
  "app",

//Libs
  "backbone",
  "jquery",
  "facebookApi",
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
          FB.login(function(response) {
            if (response.authResponse) {
              view.authorized = true;
              app.router.navigate('app',true);
            } else {
              // user didn't authorize just sit here and do nothing
            }
          }, {scope: 'publish_stream'});
        } else {
          app.router.navigate('app',true);
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
              view.authorized = true;
          } else if (response.status === 'not_authorized') {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              view.authorized = false;
          } else {
              // the user isn't logged in to Facebook.
              view.authorized = false;
          }
        };

        //ensure this code only executes after FB has been intialized properly
        FacebookApi.Execute(function(){
          FB.Event.subscribe('auth.authResponseChange', function (response) {
            checkAuthResponseStatus(response);
          });
        })
      },

      initialize: function(){ 
      /* *** */ 
        var facebookApi = new FacebookApi();
      },

      // Provide data to the template
      serialize: function () {
        //return this.model.toJSON();
      }

    });

    return Views;
  }
);