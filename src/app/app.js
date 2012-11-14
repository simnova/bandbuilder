define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone",

  // Plugins.
  "plugins/backbone.layoutmanager",
  "jqueryUi",
  "lazyload",
  "jqmodal",
  "cancelzoom"
],

function($, _, Backbone) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/",
    dispatcher : _.clone(Backbone.Events)
  };
  var ismobile = true;
  var scaleScreen = function () {
    var scaleAmount = window.innerWidth / 1024;
    alert(scaleAmount);
    /*
    $('#main').css({
      'transform-origin': '0 0',
      '-ms-transform-origin': '0 0',
      '-webkit-transform-origin': '0 0',
      '-o-transform-origin': '0 0',
      '-moz-transform-origin': '0 0',
      'transform': 'scale(' + scaleAmount + ' , ' + scaleAmount + ')',
      '-ms-transform': 'scale(' + scaleAmount + ' , ' + scaleAmount + ')',
      '-webkit-transform': 'scale(' + scaleAmount + ' , ' + scaleAmount + ')',
      '-o-transform': 'scale(' + scaleAmount + ' , ' + scaleAmount + ')',
      '-moz-transform': 'scale(' + scaleAmount + ' , ' + scaleAmount + ')',
      'left': '0',
      'top': '0',
      'text-align': 'inherit',
    });
*/

  }



  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: "app/templates/",

    fetch: function(path) {
      // Concatenate the file extension.
      path = path + ".html";

      // If cached, use the compiled template.
      if (JST[path]) {
        return JST[path];
      }

      // Put fetch into `async-mode`.
      var done = this.async();

      // Seek out the template asynchronously.
      $.get(app.root + path, function(contents) {
        done(JST[path] = _.template(contents));
      });
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(options) {
      // Create a new Layout with options.
      var layout = new Backbone.Layout(_.extend({
        el: "body"
      }, options));

      // Cache the refererence.
      return this.layout = layout;
    }
  }, Backbone.Events);

});
