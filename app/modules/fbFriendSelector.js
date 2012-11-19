define([
// Application.
  "app",

// Libs
  "backbone",

// Views
  "modules/fbFriendSelector/views"

],

// Map dependencies from above array.
function (app, Backbone, Views) {

  // Create a new module.
  var FbFriendSelector = app.module();


  FbFriendSelector.Model = Backbone.Model.extend({
  		/****/
  });

  // Photos Views
  // ------------------

  // Attach the views sub-module into this module
  FbFriendSelector.Views = Views;

  // Return the module for AMD compliance.
  return FbFriendSelector;

});
