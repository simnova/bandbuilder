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
    var Views = {};

    Views.Default = Backbone.View.extend({

      stage: undefined,
      keyboardist: {},
      drummer: {},
      frontman: {},
      bassist: {},
      wholeband: {},
      muted: false,

      tagName: "div",

      template: "bandBuilder/default",

      events: {
        "click .bandMember" : "modifyMember",
        "click .bookNow" : "bookNow",
        "click .completeBand:not(.disabled)" : "addPhoto",
        "click .shareButton" : "share",
        "click .addPhotoButton" : "addPhoto",
        "click .advancedShareButton" : "advancedShare",
        "click .shareApp" : "inviteFriends",
        "click .sound" : "changeSound"
      }, // events


      initialize: function () {
        var view = this;
        // may need to convert from buzz.js to jplayer.org for legacy support

        view.keyboardist.sound = new buzz.sound("/assets/sound/687787_SOUNDDOGS__mu", { formats: ["ogg", "mp3", "wav"], preload: true });
        view.drummer.sound = new buzz.sound("/assets/sound/179330_SOUNDDOGS__th", { formats: ["ogg", "mp3", "wav"], preload: true});
        view.frontman.sound = new buzz.sound("/assets/sound/female_vocals_01", { formats: ["ogg", "mp3", "wav"], preload: true});
        view.bassist.sound = new buzz.sound("/assets/sound/185829_SOUNDDOGS__gu", { formats: ["ogg", "mp3", "wav"], preload: true});
        view.wholeband.sound = new buzz.sound("/assets/sound/153659_Head-Rush-Prod-Cue-4-shortened", { formats: ["ogg", "mp3", "wav"], preload: true});
        
        app.dispatcher.on("updatePlayer", function (friendDetails) {
          var player;
          var className;
          switch (friendDetails.playerName) {
            case "keyboardist":
              player = view.keyboardist;
              className = "keyboards";
              break;
            case "drummer":
              player = view.drummer;
              className = "drums";
              break;
            case "frontman":
              player = view.frontman;
              className = "vocals";
              break;
            case "bassist":
              player = view.bassist;
              className = "guitar";
              break;
          }

          var imageSize = 85;

          var updateCanvasElemment = function(response){
            var x = player.bitmap.x,
                y = player.bitmap.y,
                img = new Image();

              img.crossOrigin = 'anonymous'; // or ''
              img.src = '/imageproxy/?url=' + response.picture.data.url;
              $(img).load(function () {

                player.bitmap.image = img;
                // facebook doesn't always return pictures at the coorect dimensions,
                player.bitmap.scaleX = imageSize / img.width; 
                player.bitmap.scaleY = imageSize / img.height;

                player.fbid = friendDetails.fbid;
                player.fbName = friendDetails.fbName;
                if(view.stage !== undefined){
                    view.stage.update();
                }
                
              });
          }

          if(player.bitmap !== undefined){
            window.FB.api(friendDetails.fbid +'/?fields=picture.width('+ imageSize + ').height('+ imageSize + '),name',function(response){
              updateCanvasElemment(response);
              $('.builderDiv .' + className).css('background-image','url(/imageproxy/?url='+ response.picture.data.url +')');
              player.fbid = friendDetails.fbid;
              player.fbName = friendDetails.fbName;
              
              if(
                view.keyboardist.fbid !== undefined ||
                view.drummer.fbid !== undefined ||
                view.frontman.fbid !== undefined ||
                view.bassist.fbid !== undefined 
                ){
                $('.completeBand').removeClass('disabled');
              }
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
          view.keyboardist.bitmap = addPlayer(75,132,"keyboardist");
          view.drummer.bitmap = addPlayer(321,132,"drummer");
          view.frontman.bitmap = addPlayer(198,132,"frontman");
          view.bassist.bitmap = addPlayer(444,132,"bassist");

          stage.update();

        }; // loadCanvas

        var manifest = [];

        manifest.push({ src: "/assets/images/post-base.jpg", id: "band_background"});
        manifest.push({ src: "/assets/images/silhouette_85x85.gif", id: "head_button"});

        var loader = new window.createjs.PreloadJS();
        loader.setMaxConnections(30);
        loader.onComplete = function () {
          if (loader.progress === 1) {
            loadCanvas();
          }
        };
        loader.loadManifest(manifest);

        window._gaq.push(['_trackPageview','step_2-BandPage']);
        
      }, // afterRender

      bookNow: function(event){
        var view = this;
        var targetUrl = 'http://link.hertz.com/link.html?id=31948&LinkType=HZLK&target=specialoffers/index.jsp?targetPage=LN_25offwkndwkly.xml&Category=Q ';
        window.open(targetUrl,'_blank');
        window._gaq.push(['_trackPageview','step_4-BookNow']);
      }, //bookNow

      changeSound: function (event) {
        var view = this;
        if($('.sound').hasClass('muted')){
          $('.sound').removeClass('muted');
          view.muted = false;
          window._gaq.push(['_trackEvent', 'Sound', 'UnMute']);
        } else {
          $('.sound').addClass('muted');
          view.muted = true;
          window._gaq.push(['_trackEvent', 'Sound', 'Mute']);
        }
      }, //mute

      modifyMember: function (event) {
        var view = this;
        var playerName = $(event.currentTarget).data("role");
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
        window._gaq.push(['_trackEvent', 'FacebookRequests', 'ShowDialog']);
        var callback = function (response) {
            //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            if (response !== undefined && response !== null) {
                window.alert("thanks for sharing!");
                window._gaq.push(['_trackEvent', 'FacebookRequests', 'Share','FriendCount',response.to.length]);
            }else{
              window._gaq.push(['_trackEvent', 'FacebookRequests', 'CloseDialog']);
            }

        }

        window.FB.api(
          'me?fields=picture.width(55).height(55),name,first_name,last_name', 
          function (item) {
            var me = {
                name: item.name,
                id: item.id,
                profileImage: item.picture.data.url,
                firstName : item.first_name,
                lastName : item.last_name
            };
            window.FB.ui({
              method: 'apprequests',
              message: me.firstName + ' thinks you rock. Build Your Band and save money with Hertz.',
              data:'request-in-app'
            }, callback);
          }
        );




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
      addPhoto3: function(event){

        $(".builderDiv").hide();
        $(".thanksDiv").show();
      },
      addPhoto : function (event) {
        var view = this;
        var appId = JsDefaults.facebook.appId;
        var totalBandMembers = 0;

        var postMSG='I made my band with the @[' + appId + ':Rockstar Creator] app, now all we need is a name. What do you think? %0d%0a %0d%0a Starring:';
        if(view.keyboardist.fbid !== undefined){
          postMSG = postMSG + ' @[' +view.keyboardist.fbid +':'+ view.keyboardist.fbName +'] on the keyboards,';
          totalBandMembers++;
        }
        if(view.drummer.fbid !== undefined){
          postMSG = postMSG + ' @[' + view.drummer.fbid +':'+ view.drummer.fbName +'] on the drums,';
          totalBandMembers++;
        }
        if(view.frontman.fbid !== undefined){
          postMSG = postMSG + ' @[' + view.frontman.fbid +':'+ view.frontman.fbName+'] as the singer,';
          totalBandMembers++;
        }
        if(view.bassist.fbid !== undefined){
          postMSG = postMSG + ' @[' + view.bassist.fbid + ':'+ view.bassist.fbName +'] on the guitar,';
          totalBandMembers++;
        }

        postMSG = postMSG.slice(0,postMSG.length-1); // remove last comma
        postMSG = postMSG + ' %0d%0a %0d%0a Build Your Band at: ' + JsDefaults.facebook.canvasUrl + '?app_data=wallpost'

        var url='https://graph.facebook.com/me/photos?access_token='+window.FB.getAccessToken()+"&message="+postMSG;
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

        if(view.muted == false){
          view.wholeband.sound.play();
        }
        

        $.ajax({
          url: url,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          dataType: 'json',
          type: 'POST',
          success: function (data) {
              $(".builderDiv").hide();
              $(".thanksDiv").show();
              window._gaq.push(['_trackEvent', 'CreateBand','PostBand','Total Band Members',totalBandMembers]);
              window._gaq.push(['_trackPageview','step_3-OfferPage']);
          },
          error: function (jqXHR, textStatus, errorThrown){
            //alert("error:" + textStatus + errorThrown);
              $(".builderDiv").hide();
              $(".thanksDiv").show();
              window._gaq.push(['_trackPageview','step_3-OfferPage']);
          }
        });//ajax

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