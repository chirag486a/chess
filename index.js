const http = require("http");
const path = require("path");
const port = 8000
const hostName = '127.0.0.1';
// SERVER
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "content-type": "text/html",
  })
  res.end(`<h1>Server Up on Running</h1>`)
})

server.listen(port, hostName, () => {
  console.log(path.join(__dirname+"/index.js"));
  console.log(`listening on ${hostName}:${port}`);
})