define([
  "app",

  //Libs
  "backbone",
  "jquery",
  "jsdefaults",
  // non exporting libaries
  "createjs",
  "preloadjs",
  "buzz"
  ],
  function (app, Backbone, $, JsDefaults) {
    "use strict";
    var Views = {};

    Views.Default = Backbone.View.extend({

      stage: undefined,
      keyboardist: {},
      drummer: {},
      frontman: {},
      bassist: {},
      muted: false,

      tagName: "div",

      template: "bandBuilder/default",

      events: {
        "click .shareButton" : "share",
        "click .addPhotoButton" : "addPhoto",
        "click .advancedShareButton" : "advancedShare",
        "click .inviteFriends" : "inviteFriends",
        "click .mute" : "mute"
      }, // events


      initialize: function () {
        var view = this;

       // var createjs = new CreateJs();
        // may need to convert from buzz.js to jplayer.org for legacy support
        view.keyboardist.sound = new buzz.sound("/assets/sound/206507_SOUNDDOGS__sy", { formats: ["ogg", "mp3", "wav"], preload: true });
        view.drummer.sound = new buzz.sound("/assets/sound/206156_SOUNDDOGS__fu", { formats: ["ogg", "mp3", "wav"], preload: true});
        view.frontman.sound = new buzz.sound("/assets/sound/185912_SOUNDDOGS__gu", { formats: ["ogg", "mp3", "wav"], preload: true});
        view.bassist.sound = new buzz.sound("/assets/sound/186516_SOUNDDOGS__ba", { formats: ["ogg", "mp3", "wav"], preload: true});

        app.dispatcher.on("updatePlayer", function (friendDetails) {
          var player;
          switch (friendDetails.playerName) {
            case "keyboardist":
              player = view.keyboardist;
              break;
            case "drummer":
              player = view.drummer;
              break;
            case "frontman":
              player = view.frontman;
              break;
            case "bassist":
              player = view.bassist;
              break;
          }
          if(player.bitmap !== undefined){
            window.FB.api(friendDetails.fbid +'/?fields=picture.width(94).height(94),name',function(response){
              var x = player.bitmap.x,
                  y = player.bitmap.y,
                  img = new Image();

              img.crossOrigin = 'anonymous'; // or ''
              img.src = '/imageproxy/?url=' + response.picture.data.url;
              $(img).load(function () {


                player.bitmap.image = img;
                // facebook doesn't always return pictures at the coorect dimensions,
                player.bitmap.scaleX = 94 / img.width; 
                player.bitmap.scaleY = 94 / img.height;

                player.fbid = friendDetails.fbid;
                player.fbName = friendDetails.fbName;
                if(view.stage !== undefined){
                    view.stage.update();
                }
                
              });
            });
          }
        }, this);
      },

      afterRender: function () {
        var view = this;

        var loadCanvas = function () {

          var canvas = $(".bandCanvas").get(0);
          view.stage = new window.createjs.Stage(canvas);
          var stage = view.stage;
          var bitmap = new window.createjs.Bitmap(loader.getResult("band_background").result);

          bitmap.scaleX = 1;
          bitmap.scaleY = 1;

          var addPlayer = function (coordX, coordY,name) {
            var bitmap = new window.createjs.Bitmap(loader.getResult("head_button").result),
                player = stage.addChild(bitmap);

            bitmap.x = coordX;
            bitmap.y = coordY;
            bitmap.onClick = function (event) {
              view.clickPlayer(name);
            };

            return bitmap;
          }; // addPlayer

          var background = stage.addChild(bitmap);
          view.keyboardist.bitmap = addPlayer(205,80,"keyboardist");
          view.drummer.bitmap = addPlayer(390,160,"drummer");
          view.frontman.bitmap = addPlayer(550,100,"frontman");
          view.bassist.bitmap = addPlayer(760,60,"bassist");

          stage.update();

        }; // loadCanvas

        var manifest = [];

        manifest.push({ src: "/assets/images/band_background.gif", id: "band_background"});
        manifest.push({ src: "/assets/images/head_button.gif", id: "head_button"});

        var loader = new window.createjs.PreloadJS();
        loader.setMaxConnections(30);
        loader.onComplete = function () {
          if (loader.progress === 1) {
            loadCanvas();
          }
        };
        loader.loadManifest(manifest);
        
      }, // afterRender

      mute: function (event) {
        var view = this;
        if($('.mute').hasClass('muted')){
          $('.mute').removeClass('muted').addClass('soundOn');
          view.muted = false;
        } else {
          $('.mute').removeClass('soundOn').addClass('muted');
          view.muted = true;
        }
      }, //mute

      clickPlayer: function (playerName) {
        var view = this;

        if(view.muted == false){
          switch (playerName) {
            case "keyboardist":
              view.keyboardist.sound.play();
              break;
            case "drummer":
              view.drummer.sound.play();
              break;
            case "frontman":
              view.frontman.sound.play();
              break;
            case "bassist":
              view.bassist.sound.play();
              break;
          }
        }

        app.dispatcher.trigger("clickPlayer", playerName);
      }, //clickPlayer

      advancedShare : function (event) {
        var view = this;
        //http://beej.us/pizza/images/pizzalogo2.png

        var appId = JsDefaults.facebook.appId,
            fanpageUrl = JsDefaults.facebook.fanpageUrl,
            fanPageId = JsDefaults.facebook.fanpageId,
            url = fanpageUrl + '?sk=app_' + appId;

        // calling the API ...
        var obj = {
            method: 'feed',
            link: url,
            picture: "http://beej.us/pizza/images/pizzalogo2.png",
            name:'I made my band with the @[' + appId + ':Rockstar Creator] cool heh? (starring: @[' +view.keyboardist.fbid +':'+ view.keyboardist.fbName +'] as the keyboardist, @[' + view.drummer.fbid +':'+ view.drummer.fbName +'] as the drummer, @[' + view.frontman.fbid +':'+ view.frontman.fbName+'] as the frontman, @[' + view.bassist.fbid + ':'+ view.bassist.fbName +'] as the bassist)',
            caption: 'Get your own rockstar name with Hertz',
            description: 'Rock it out with a hertz rental and get $30 off a rental. The Hertz rockstar name generator is a fun way to explore your inner rock star!',
            place: fanPageId,
            tags: view.keyboardist.fbid +"," + view.drummer.fbid +"," + view.frontman.fbid +"," + view.bassist.fbid,
            properties: {
                "Try it yourself": { 'text': 'Get your name!', 'href': url },
                "Or just rent": { 'text': 'Rent with Hertz', 'href': 'http://www.hertz.com' }
            },
            actions: [{ name: 'Rent a Car', link: 'http://www.hertz.com'}],
            ref: 'appshare'
        };

        var callback = function (response) {
            //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            if (response !== undefined && response !== null) {
                window.alert("thanks for sharing!");
            }

        }

        window.FB.ui(obj, callback);
      }, // advancedShare

      inviteFriends: function(event){

        var callback = function (response) {
            //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            if (response !== undefined && response !== null) {
                window.alert("thanks for sharing!");
            }

        }
        window.FB.ui({method: 'apprequests',
          message: 'I just created a band and saved money with Hertz you can too!'
        }, callback);

      }, //inviteFriends

      share : function (event) {
        var view = this;
        var appId = JsDefaults.facebook.appId;
        var postMSG='My I made my band with the @[' + appId + ':Rockstar Creator] cool heh?';
        var url='https://graph.facebook.com/me/feed?access_token='+window.FB.getAccessToken()+"&message="+postMSG;
        // var imgURL="http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg";//change with your external photo url
        var formData = new FormData();
        var dataURItoBlob = function(dataURI) {
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for (var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        }

        formData.append("source",dataURItoBlob(view.stage.toDataURL()));

        $.ajax({
          url: url,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',

          success: function(data){
              alert("POST SUCCESSFUL");
          }
        });
      }, // share

      addPhoto : function (event) {
        var view = this;
        var appId = JsDefaults.facebook.appId;
        var postMSG='My I made my band with the @[' + appId + ':Rockstar Creator] cool heh? (starring: @[' +view.keyboardist.fbid +':'+ view.keyboardist.fbName +'] as the keyboardist, @[' + view.drummer.fbid +':'+ view.drummer.fbName +'] as the drummer, @[' + view.frontman.fbid +':'+ view.frontman.fbName+'] as the frontman, @[' + view.bassist.fbid + ':'+ view.bassist.fbName +'] as the bassist)';
        var url='https://graph.facebook.com/me/photos?access_token='+window.FB.getAccessToken()+"&message="+postMSG+"&privacy={'value':'ALL_FRIENDS'}";
        //var url='https://graph.facebook.com/me/photos?access_token='+window.FB.getAccessToken();
        // var imgURL="http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg";//change with your external photo url
        var formData = new FormData();
        var dataURItoBlob = function (dataURI) {
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for (var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        }

        formData.append("source",dataURItoBlob(view.stage.toDataURL()));

        $.ajax({
          url: url,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',

          success: function (data) {
              $(".builderDiv").hide();
              $(".thanksDiv").show();
          },error: function (jqXHR, textStatus, errorThrown){
            alert("error:" + textStatus + errorThrown);
          }
        });
      }, //addPhoto

      share3 : function (event) {
        var appId = JsDefaults.facebook.appId;
        var fanpageUrl = JsDefaults.facebook.fanpageUrl;
        var url = fanpageUrl + '?sk=app_' + appId;
        // calling the API ...

        var dataURItoBlob = function (dataURI) {
                    var binary = atob(dataURI.split(',')[1]);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
                }
        var options = {
            source: dataURItoBlob(stage.toDataURL())
        };

        var callback = function (response) {
            //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            if (response !== undefined && response !== null) {
              console.log(response);
                alert("thanks for sharing!");
            }

        }

        window.FB.api('me/photos','post',options, callback);
      }, // share3
      
      share2 : function (event) {
        var appId = JsDefaults.facebook.appId;
        var fanpageUrl = JsDefaults.facebook.fanpageUrl;
        var url = fanpageUrl + '?sk=app_' + appId;
        // calling the API ...
        var obj = {
            method: 'feed',
            link: url,
            picture: stage.toDataURL(),
            name: 'My rock star name is whoha, @@100001852255810 do you think it matches my music tastes?',
            caption: 'Get your own rockstar name with Hertz',
            description: 'Rock it out with a hertz rental and get $30 off a rental. The Hertz rockstar name generator is a fun way to explore your inner rock star!',
            properties: {
                "Try it yourself": { 'text': 'Get your name!', 'href': url },
                "Or just rent": { 'text': 'Rent with Hertz', 'href': 'http://www.hertz.com' }
            },
            actions: [{ name: 'Rent a Car', link: 'http://www.hertz.com'}],
            ref: 'appshare'
        };

        var callback = function (response) {
            //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            if (response !== undefined && response !== null) {
                alert("thanks for sharing!");
            }

        }

        window.FB.ui(obj, callback);
      }, // share2

      // Provide data to the template
      serialize: function () {
        //return this.model.toJSON();
      }

    });

    return Views;
  }
);