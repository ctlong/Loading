var Auth = require('./auth');
var Joi = require('joi');

exports.register = function(server,options,next) {
  
  server.route([
    {
      method: 'POST',
      path: '/posts',
      config: {
        handler: function(request,reply) {
          Auth.authenticated(request,function(result) {
            if(!result.authenticated) {return reply(result);}
            var db = request.server.plugins['hapi-mongodb'].db;
            var post = request.payload.post;
            db.collection('users').findOne({_id : result.user_id},function(err,userMongo) {
              if(err) {return reply('Internal Mongo Error',err);}
              if(userMongo === null) {return reply({userExists : false});}
              post.user_id = result.user_id;
              post.user = userMongo.name;
              db.collection('posts').insert(post,function(err,writeResult) {
                if(err) {return reply('Internal Mongo Error',err);}
                reply(writeResult);
              });
            });
          });
        },
        validate: {
          payload: {
            post: {
              type: Joi.string().min(1).max(20).required(),
              date: Joi.string().min(21).max(21).required(),
              message: Joi.string().min(1).max(200).required()
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/posts',
      handler: function(request,reply) {
        Auth.authenticated(request,function(result) {
          if(!result.authenticated) {return reply(result);}
          var db = request.server.plugins['hapi-mongodb'].db;
          db.collection('posts').find({}).toArray(function(err,posts) {
            if(err) {return reply('Internal Mongo Error',err);}
            reply({user : result.user_id, data : posts});
          });
        });
      }
    },
    {
      method: 'DELETE',
      path: '/posts',
      config: {
        handler: function(request,reply) {
          Auth.authenticated(request,function(result) {
            if(!result.authenticated) {return reply(result);}
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
            var id = ObjectId(request.payload.post.id)
            db.collection('posts').findOne({user_id : result.user_id,_id : id},function(err,usersPost) {
              if(!usersPost) {return reply({usersPost : false});}
              db.collection('posts').remove({_id : id},function(err,writeResult) {
                if(err) {return reply('Internal Mongo Error',err);}
                reply(writeResult);
              });
            });
          });
        },
        validate: {
          payload: {
            post: {
              id: Joi.string().min(5).max(50).required()
            }
          }
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'posts-routes',
  version: '0.0.1'
};