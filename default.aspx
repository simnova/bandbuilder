<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!--  <meta name="viewport" content="width=device-width,initial-scale=1"> -->
  <meta name="viewport" content="width=320" />

  <title>Hertz - Build Your Band</title>

  <!-- Application styles. -->
  <link rel="stylesheet" href="/assets/css/index.css">
</head>

<body>
  <div id="fb-root"></div>
  <div id="viewporter">
    <!-- Main container. -->
    <div role="main" id="main"></div>
  </div>
  <!-- Application source. -->
  <script data-main="/app/config" src="/assets/js/libs/require.js"></script>

  <script type="text/javascript"> 
    var $buoop = {vs:{i:8,f:12,o:11,s:5,n:9}} 
    $buoop.ol = window.onload; 
    window.onload=function(){ 
     try {if ($buoop.ol) $buoop.ol();}catch (e) {} 
     var e = document.createElement("script"); 
     e.setAttribute("type", "text/javascript"); 
     e.setAttribute("src", "http://browser-update.org/update.js"); 
     document.body.appendChild(e); 
    } 
  </script> 
</body>
</html>
