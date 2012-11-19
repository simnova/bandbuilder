(function ($, window, undefined) {
    FacebookAPI = $.Deferred();

    window.fbAsyncInit = function () {
        FB.init(appConfigs.facebook);


        // ----------
        // facebook event handler: user logged in
        FB.Event.subscribe('auth.login', function (response) {
            // MediaMind
            ebConversionTracker('234800');
            // setTimeout('window.location.href=window.location.href', 0); // forces client cookie to be created...
        });


        // ----------
        // facebook event handler: user logged out
        FB.Event.subscribe('auth.logout', function (response) {
            // setTimeout('window.location.href=window.location.href', 0); // or removed
        });


        // ----------
        // facebook event handler: user liked something
        FB.Event.subscribe('edge.create', function (targetUrl) {
            var s_click = s_gi(s_account);s_click.linkTrackVars='eVar9,eVar15,eVar33,prop12,prop9';s_click.prop9 = 'campbells:describe v8';s_click.linkTrackEvents='event17';s_click.events='event17';s_click.prop12 = 'http://www.describev8.com';s_click.eVar9='like';s_click.eVar15='facebook';s_click.eVar33=targetUrl;var s_code = s_click.tl(this,'o','social click');if (s_code) document.write(s_code);s_click=null;
            //_gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]); // track like button click
        });


        // ----------
        // facebook event handler: user un-liked something
        FB.Event.subscribe('edge.remove', function (targetUrl) {
            //_gaq.push(['_trackSocial', 'facebook', 'like-remove', targetUrl]); // track like button click
        });

        // ----------
        // facebook event handler: user created a comment
        FB.Event.subscribe('comment.create', function (commentDetail) {
            //_gaq.push(['_trackSocial', 'facebook', 'comment', commentDetail.href]); // track like button click
        });

        // ----------
        // facebook event handler: user removed a comment
        FB.Event.subscribe('comment.remove', function (commentDetail) {
            //_gaq.push(['_trackSocial', 'facebook', 'comment-remove', commentDetail.href]); // track like button click
        });

        // ----------
        // facebook event handler: user sends a message
        FB.Event.subscribe('message.send', function (targetUrl) {
            //_gaq.push(['_trackSocial', 'facebook', 'send', targetUrl]); // track like button click
        });


        // ----------
        // force iframe to resize (grow) for dynamic content
        FB.Canvas.setAutoGrow();


        // ----------
        // notify application when facebook API has loaded. facebook API calls should be wrapped in
        // the deferred done method: namespace.facebook.done(function () {});
        FacebookAPI.resolve();
    };

    FacebookAPI.promise();
})(jQuery, window);

function renderFB() {
  FacebookAPI.done(function () {
    FB.XFBML.parse();
  });
}

// ----------
// Load the SDK Asynchronously
(function (d) {
  var js, id = 'facebook-jssdk'; if (d.getElementById(id)) { return; }
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  d.getElementsByTagName('head')[0].appendChild(js);
} (document));
