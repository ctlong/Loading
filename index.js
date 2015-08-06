var Hapi = require('hapi');
var Path = require('path');
var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      headers: ['Access-Control-Allow-Credentials'],
      credentials: true
    }
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates')
});

var plugins = [
  {register: require('./routes/static-pages.js')},
  {register: require('./routes/sessions.js')},
  {register: require('./routes/users.js')},
  {register: require('./routes/reservations.js')},
  {register: require('./routes/posts.js')},
  {
    register: require('yar'),
    options: {
      cookieOptions: {
        password: process.env.COOKIE_PASSWORD || 'hellohellohello',
        isSecure: false
      }
    }
  },
  {
    register: require('hapi-mongodb'),
    options: {
      url: process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/loading',
      settings: {
        db: {
          native_parser: false
        }
      }
    }
  }
];

server.register(plugins,function(err) {
  if(err) {
    throw err;
  }
  server.start(function() {
    console.log('info', 'server running at: '+server.info.uri);
  });
});