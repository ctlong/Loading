var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next) {
  server.route([
    {
      method: 'POST',
      path: '/sessions',
      
    }
  ]);

}

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
}