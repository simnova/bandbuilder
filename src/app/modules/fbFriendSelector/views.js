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
      className:"fbFriendSelector",

      template: "fbFriendSelector/selector",

      events: {
        "keyup .friendFilter" : "filterKeyUp",
        "click .friendList > li" : "selectFriend",
        "click .closeButton" : "close"
      }, //events

      initialize: function () {
        var view = this;

        jQuery.fn.center = function () {
         this.css("position","absolute");
         //this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
         this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
         return this;
        }
        //view.$el.center();

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
          $("img.lazy").trigger("scroll")
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
          },
          onHide: function(h) {
            /* callback executed on window hide. Hide notice, overlay. */
            h.w.fadeOut("slow",function() { if(h.o) h.o.remove(); }); 
          }
        });

        var populateUserInfo = function () {
            window.FB.api(
              'me/friends?fields=picture.width(34).height(34),name,first_name,last_name', 
              function (response) {
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
                });
                friends = _.sortBy(friends, function (friend) { return friend.lastName + " " + friend.firstName}); 
                var personTemplate = "<% _.each(friends, function(friend){ %><li class='visible' data-id='<%= friend.id %>' data-value='<%= friend.name %>' data-search-value='<%= friend.name.toLowerCase() %>'><img src='/assets/images/silhouette.gif' data-original='<%= friend.profileImage %>' class='lazy' width='34' height='34'/><span><%= friend.name %></span></li><% }); %>";
                var results =  _.template(personTemplate, {friends : friends});
                $(".friendList").html(results);
                console.log("populateUserInfo completed");

                //window.stroll.bind('.friendList', { live: true });
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
          view.filterList =$(".friendList li");
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
        //stroll.bind('.friendList', { live: false });

      } // filterFriendList 

    }); //Views
    return Views;
  }
);