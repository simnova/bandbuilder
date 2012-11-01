define([
  // Application.
  "app",
  // Modules
  "modules/fbFriendSelector",
  "modules/bandBuilder/views",
  "modules/bandBuilder",
  "modules/common"
],

function(app, FbFriendSelector , BBViews, BandBuilder, Common) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "app" : "app"
    },


    index: function() {
      app.useLayout({
        el: "#main",
        template: "layouts/intro"
      }).setViews({
        ".background": new Common.Views.GetStarted({})
      }).render().done(function(){
          /* *** */
      });

    }, // index

    app: function(){
      console.log("app");
      var bb = new BBViews.Default({});
      app.useLayout({
        el: "#main",
        template: "layouts/app"
      }).setViews({
        ".fbFriendSelectorContainer": new FbFriendSelector.Views.Default({}),
        ".bandBuilder": new BandBuilder.Views.Default({}),
      }).render().done(function(){

      });

    } // app
  });

  return Router;

});
