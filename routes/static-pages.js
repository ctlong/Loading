exports.register = function(server,options,next) {
  server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(request,reply) {
      reply.view('index');
    }
  }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-routes',
  version: '0.0.1'
}