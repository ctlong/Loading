var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      headers: ['Acess-Control-Allow-Credentials'],
      credentials: true
    }
  }
});