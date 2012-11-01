define([
  "app",

//Libs
  "backbone",
  "jquery",
  "facebookApi",
//Libs with no export
  "stroll"
  ],
  function (app, Backbone, $,FacebookApi) {
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
        "click .friendList > li" : "selectFriend"
      },
      selectFriend: function(event){
        var view = this;
        var friend = $(event.currentTarget);
        view.$el.fadeOut(1000);
        var friendDetails = {
            playerName: view.playerName,
            image: $('img',friend).attr('src'),
            fbid: $(friend).data('id'),
            fbName: $(friend).data('value'),
        }
        app.dispatcher.trigger("updatePlayer", friendDetails);
      },
      filterKeyUp: function(event){
        var view = this;
        var filter = $(event.target).val().toLowerCase();
        view.filterFriendList(filter);
      },
      filterFriendList: function(filter){
        var view = this;
        // This is where the magic happens..
        //stroll.bind('.friendList', { live: false });
        if(view.filterList === undefined){
          view.filterList =$(".friendList li");
          view.filterListLen = view.filterList.length;
        }

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
        stroll.bind('.friendList', { live: true });
      },
      afterRender: function(){
        stroll.bind('.friendList', { live: true });
        var populateUserInfo = function () {
            var friends = [];
            window.FB.api('me/friends?fields=picture.width(34).height(34),name,first_name,last_name', function (response) {
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
                friends = _.sortBy(friends, function(friend){ return friend.lastName + " " + friend.firstName}); 
                var personTemplate = "<% _.each(friends, function(friend){ %><li class='visible' data-id='<%= friend.id %>' data-value='<%= friend.name %>' data-search-value='<%= friend.name.toLowerCase() %>'><img src='<%= friend.profileImage %>' width='34' height='34'/><span><%= friend.name %></span></li><% }); %>";
                var results =  _.template(personTemplate, {friends : friends});
                $(".friendList").html(results);
            });
        };

        var checkAuthResponseStatus = function(response) {
          if (response.status === 'connected') {
              // the user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
              populateUserInfo();
          } else if (response.status === 'not_authorized') {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              //showLogin();
          } else {
              // the user isn't logged in to Facebook.
              //();
          }
        };

        //ensure this code only executes after FB has been intialized properly
        FacebookApi.Execute(function(){
          FB.Event.subscribe('auth.authResponseChange', function (response) {
            checkAuthResponseStatus(response);
          });
        })
      },

      initialize: function(){
        var view = this;
        view.facebookApi = new FacebookApi();
        app.dispatcher.on("clickPlayer", function (playerName) {
          view.playerName = playerName;

          view.$el.fadeIn(1000);
        });


      },

      // Provide data to the template
      serialize: function () {
        //return this.model.toJSON();
      }

    });

    return Views;
  }
);