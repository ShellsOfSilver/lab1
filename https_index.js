const http = require('http');
const app = require('./server');
const config = require('./server/config');
const {
  hostname,
  port,
} = config.server;

const server = http.createServer(app);
server.listen(7777, hostname, () => {
	console.log(hostname, 7777)
});
