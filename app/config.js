// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main", "../assets/js/libs/require.config"],

  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",
    vendor: "../assets/vendor",

    // Libraries.
    jquery: "../assets/js/libs/jquery",
    lodash: "../assets/js/libs/lodash",
    backbone: "../assets/js/libs/backbone",

    jqueryUi: "../assets/js/libs/jquery-ui-1.9.1.custom",
    stroll: "../assets/js/libs/stroll",
    jsdefaults: "../assets/js/libs/jsdefaults",
    facebookApi: "../assets/js/libs/facebookApi",
    googleAnalytics: "../assets/js/libs/googleAnalytics",
    
    createjs: "../assets/js/libs/easeljs-0.5.0.min",
    buzz: "../assets/js/libs/buzz",
    preloadjs: "../assets/js/libs/preloadjs-0.2.0.min",
    lazyload: "../assets/js/libs/lazyload",
    jqmodal: "../assets/js/libs/jqmodal",
    viewporter: "../assets/js/libs/viewporter",
    viewporterNative: "../assets/js/libs/viewporter.native",
    cancelzoom: "../assets/js/libs/cancelzoom",
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },
    jqueryUi: {
      deps: ["jquery"],
    },
    lazyload: {
      deps: ["jquery"],
    },
    jqmodal: {
      deps: ["jquery"],
    },
    cancelzoom: {
      deps: ["jquery"],
    },

    /*
    buzz: {
      exports: "buzz"
    },

    
    createjs: {
      exports: "createjs"
    }, 
    preloadjs: {
      deps: ["createjs"]
    },
    */
    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"]
  }

});
