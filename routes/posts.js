var Auth = require('./auth');
var Joi = require('joi');

exports.register = function(server,options,next) {
  
  server.route([
    {
      method: 'POST',
      path: '/posts',
      config: {
        handler: function(request,reply) {
          Auth.authenticate(request,function(result) {
            if(!result.authenticated) {return reply(result);}
            var db = request.server.plugins['hapi-mongodb'].db;
            var post = request.payload.post;
            db.collection('users').findOne({_id : result.user_id},function(err,userMongo) {
              if(err) {return reply('Internal Mongo Error',err);}
              if(userMongo === null) {return reply({userExists : false});}
              db.collection('posts').insert
            });
          });
        },
        validate: {
          payload: {
            post: {
              type: Joi.string().min(1).max(15).required(),
              date: Joi.date().required(),
              message: Joi.string().min(3).max(100).required()
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/posts',
      handler: function(request,reply) {
        Auth.authenticate(request,function(result) {
          if(!result.authenticated) {return reply(result);}
          reply(result);
        });
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'posts-routes',
  version: '0.0.1'
};