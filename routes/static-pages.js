exports.register = function(server,options,next) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function(request,reply) {
        reply.view('index');
      }
    },
    {
      method: 'GET',
      path: '/public/{path*}',
      handler: {
        directory: {
          path: 'public',
          listing: true
        }
      }
    },
    {
      method: 'GET',
      path: '/bower_components/{path*}',
      handler: {
        directory: {
          path: 'bower_components',
          listing: true
        }
      }
    },
    {
      method: 'GET',
      path: '/sign-up',
      handler: function(request,reply) {
        reply.view('sign-up');
      }
    },
    {
      method: 'GET',
      path: '/log-in',
      handler: function(request,reply) {
        reply.view('log-in');
      }
    },
    {
      method: 'GET',
      path: '/reserve',
      handler: function(request,reply) {
        reply.view('reserve');
      }
    },
    {
      method: 'GET',
      path: '/profile',
      handler: function(request,reply) {
        reply.view('profile');
      }
    },
    {
      method: 'GET',
      path: '/forum',
      handler: function(request,reply) {
        reply.view('forum');
      }
    },
    {
      method: 'GET',
      path: '/chart',
      handler: function(request,reply) {
        reply.view('chart');
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-routes',
  version: '0.0.1'
}