define([
// Application.
  "app",

// Libs
  "backbone",

// Views
  "modules/common/views"

],

// Map dependencies from above array.
function (app, Backbone, Views) {

  // Create a new module.
  var Common = app.module();


  Common.Model = Backbone.Model.extend({
      /****/
  });

  // Photos Views
  // ------------------

  // Attach the views sub-module into this module
  Common.Views = Views;

  // Return the module for AMD compliance.
  return Common;

});
