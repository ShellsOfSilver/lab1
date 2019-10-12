const http = require('http');
const https = require('https');
const app = require('./server');
const fs = require('fs');
const path = require('path');
const config = require('./server/config');

const {
  hostname,
  port,
} = config.server;
const options = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.crt")),
    ca: [

          fs.readFileSync(path.join(__dirname, "ca.crt")),

          fs.readFileSync(path.join(__dirname, "ca.key"))

       ]
};

const server = https.createServer(options, app);
// const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
