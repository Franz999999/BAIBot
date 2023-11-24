var http = require('http');
var fs = require('fs');
var startTime = new Date();

http.createServer(function(req, res) {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var uptimeInSeconds = Math.floor((new Date() - startTime) / 1000);

    var html = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWtweHY1cTd4d2M1cXEwZGs2dnV5OXJ3eTY3ZXMwM25razh1NG5vbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiTno2GL7HupVuz84/giphy.gif') no-repeat center center fixed;
      background-size: cover;
      color: white;
      font-family: Courier New, sans-serif;
    }
    .content {
      text-align: center;
      padding-top: 25px;
    }
    .outline-text {
      font-size: 128px;
      text-shadow: -2px -2px 2px black, 2px -2px 2px black, -2px 2px 2px black, 2px 2px 2px black;
    }
    .uptime-text {
      font-size: 64px;
      text-shadow: -2px -2px 2px black, 2px -2px 2px black, -2px 2px 2px black, 2px 2px 2px black;
    }
  </style>
</head>
<body>
  <div class="content">
    <p class="outline-text">Server is Running</p>
    <p class="uptime-text" id="uptime">Uptime:${formatUptime(uptimeInSeconds)}</p>
  </div>

  <script>
    function updateUptime() {
      fetch('/')
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const uptimeElement = doc.getElementById('uptime');
          document.getElementById('uptime').innerHTML = uptimeElement.innerHTML;
        });
    }

    setInterval(updateUptime, 1000);
  </script>
</body>
</html>
    `;

    res.write(html);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
}).listen(8080);

function formatUptime(uptimeInSeconds) {
  var days = Math.floor((uptimeInSeconds % (86400 * 30)) / 86400);
  var weeks = Math.floor(days % 7);
  var months = Math.floor(weeks % 4.34524);
  var years = Math.floor(months % 12);
  var hours = Math.floor(uptimeInSeconds / 3600);
  var minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  var seconds = uptimeInSeconds % 60;
  return years + "y " + months + "m " + weeks + "w " + days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}
