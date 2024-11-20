const http = require('http')
//const os = require('os')
const fs = require('fs');
const path = require('path');
const port = 8090;

console.log(`Server strating on ${port}`);


var handler = function (request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  console.log(url.pathname);
  if (url.pathname === '/leaderboard') {
    const filePath = path.join(__dirname, 'GameFiles', 'leaderboard.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        response.writeHead(500);
        response.end('Error loading file');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data);
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
};

var www = http.createServer(handler);
www.listen(port);