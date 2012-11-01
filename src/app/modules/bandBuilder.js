define([
// Application.
  "app",

// Libs
  "backbone",

// Views
  "modules/bandBuilder/views"

],

// Map dependencies from above array.
function (app, Backbone, Views) {

  // Create a new module.
  var BandBuilder = app.module();


  BandBuilder.Model = Backbone.Model.extend({
      /****/
  });

  // Photos Views
  // ------------------

  // Attach the views sub-module into this module
  BandBuilder.Views = Views;

  // Return the module for AMD compliance.
  return BandBuilder;

});
