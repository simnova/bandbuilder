define([
  "app",

//Libs
  "backbone",
  "jquery",
  "facebookApi",
//Libs with no export
  "stroll"
  ],
  function (app, Backbone, $, FacebookApi) {
    var Views = {};

    Views.Default = Backbone.View.extend({
      playerName : undefined,
      facebookApi : undefined,
      filterList : undefined,
      filterListLen : undefined,
      requestLoad: false,
      className:"fbFriendSelector",

      template: "fbFriendSelector/selector",

      events: {
        "keyup .friendFilter" : "filterKeyUp",
        "click .friendList > div" : "selectFriend",
        "click .closeButton" : "close"
      }, //events

      initialize: function () {
        var view = this;

        app.dispatcher.on("clickPlayer", function (playerName) {
          view.playerName = playerName;
          view.$el.parent().jqmShow();
          window.document.activeElement.blur();
          $("input").blur();
          $('.friendFilter').cancelZoom(); // prevents IOS zooming


          $(".role").hide();
          $("." + playerName).show();
          $("img.lazy").show().lazyload({         
             container: $(".friendList"),
             effect : "fadeIn"
          });
          view.requestLoad();
        });
      }, //initialize

      // Provide data to the template
      serialize: function () {
        //return this.model.toJSON();
      },

      afterRender: function () {
        console.log("afterRenderFired");
        var view = this;

        
        view.$el.parent().jqm({
          modal: true,
          onShow: function(h) {
            /* callback executed when a trigger click. Show notice */
            h.w.css('opacity',0.92).fadeIn(); 
            view.requestLoad();
          },
          onHide: function(h) {
            /* callback executed on window hide. Hide notice, overlay. */
            h.w.fadeOut("slow",function() { if(h.o) h.o.remove(); }); 
          }
        });

        var populateUserInfo = function () {

            var processResponse = function (response) {
                var friends = [];
                _.each(response.data, function (item) {
                    var friend = {
                        name: item.name,
                        id: item.id,
                        profileImage: item.picture.data.url,
                        firstName : item.first_name,
                        lastName : item.last_name
                    };
                    friends.push(friend);
                }); //each
                return friends;
            }; //processResponse

            var allFriends = [];

            var getUserData = function(callback){
              window.FB.api(
                'me?fields=picture.width(55).height(55),name,first_name,last_name', 
                function (item) {
                  var friend = {
                      name: item.name,
                      id: item.id,
                      profileImage: item.picture.data.url,
                      firstName : item.first_name,
                      lastName : item.last_name
                  };
                  allFriends.push(friend);
                  callback();
                }
              );
            }; //getUserData

            var getFriends = function(callback){
              window.FB.api(
                'me/friends?fields=picture.width(55).height(55),name,first_name,last_name', 
                function (response) {
                  allFriends = allFriends.concat(processResponse(response));
                  callback();
              });
            }; //getFriends

            getUserData(function(){
              getFriends(function(){
                allFriends = _.sortBy(allFriends, function (friend) { return friend.lastName + " " + friend.firstName}); 
                var personTemplate = "<% _.each(allFriends, function(friend){ %><div class='visible' data-id='<%= friend.id %>' data-value='<%= friend.name %>' data-search-value='<%= friend.name.toLowerCase() %>'><img src='/assets/images/silhouette.gif' data-original='<%= friend.profileImage %>' class='lazy' width='55' height='55'/><div><span><%= friend.name %></span></div></div><% }); %>";
                var results =  _.template(personTemplate, {allFriends : allFriends});
                $(".friendList").html(results);
              });
            });

        }; //populateuserInfo

        var checkAuthResponseStatus = function (response) {
          if ( response.status === 'connected' ) {
              // the user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
              populateUserInfo();
          } else if ( response.status === 'not_authorized' ) {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              app.router.navigate('/',true);
          } else {
              // the user isn't logged in to Facebook.
              app.router.navigate('/',true);
          }
        }; //checkAuthResponseStatus

        //ensure this code only executes after FB has been intialized properly
        
        FacebookApi.Execute(function () {
          window.FB.Event.subscribe('auth.authResponseChange', function (response) {
           // checkAuthResponseStatus(response);
          });
          window.FB.getLoginStatus(function (response) {
            checkAuthResponseStatus(response);
          });
        })
      }, //afterRender
      close: function(event){
        var view = this;
        view.$el.parent().jqmHide();
      }, //close
      selectFriend: function (event) {
        var view = this;
        var friend = $(event.currentTarget);
        view.$el.parent().jqmHide();
        var friendDetails = {
            playerName: view.playerName,
            image: $('img',friend).attr('src'),
            fbid: $(friend).data('id'),
            fbName: $(friend).data('value'),
        };
        app.dispatcher.trigger("updatePlayer", friendDetails);
      }, // selectFriend

      requestLoad: function(){
        var view = this;

        var typewatch = (function(){
          var timer = 0;
          return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
          }  
        })();

        if(view.requestLoad == false){
          view.requestLoad = true;
          typewatch(function () {
            // executed only 500 ms after the last keyup event.
            $("img.lazy").trigger("scroll");
              view.requestLoad = false;
              console.log("lazyLoad");
          }, 500);
        };

      },
      filterKeyUp: function (event) {
        var view = this;
        var filter = $(event.target).val().toLowerCase();
        view.filterFriendList(filter);
      }, // filterKeyUp
      filterFriendList: function (filter) {
        var view = this;
        // This is where the magic happens..
        //stroll.unbind('.friendList');
        if(view.filterList === undefined){
          view.filterList =$(".friendList > div");
          view.filterListLen = view.filterList.length;
        };

        for (var i = 0; i < view.filterListLen; i++) {
            var li = $(view.filterList[i]);
            //var $visibleText = $("span",this);


            // If the list item contains the filter text then leave it there/show it
            if (li.data("search-value").indexOf(filter) >= 0) {
                li.show(); 
                var matcher = new RegExp("(" + filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ")", "ig");
                $("span",li).html(li.data("value").replace(matcher, "<strong>$1</strong>"));
            }
            else {
                li.hide(); 
            }
        };
        
        view.requestLoad();
        //stroll.bind('.friendList', { live: false });

      } // filterFriendList 

    }); //Views
    return Views;
  }
);