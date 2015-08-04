var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next) {
  server.route([
    {
      method: 'POST',
      path: '/sessions',
      config: {
        handler: function(request,reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload.user;
          db.collection('users').findOne({username : user.username},function(err,userMongo) {
            if(err) {return reply('Internal Mongo Error ', err);}
            if(userMongo === null) {return reply({userExists: false});}
            Bcrypt.compare(user.password, userMongo.password, function(err, same) {
              if(!same) {
                return reply({authorized : false});
              }
              var randomKeyGenerator = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
              }
              var session = {
                user_id: userMongo._id,
                session_id: randomKeyGenerator()
              };
              db.collection('sessions').insert(session, function(err, writeResult) {
                if(err) {return reply('Internal Mongo Error',err);}
                request.session.set('hapi_twitter_session', session);
                reply(writeResult);
              });
            });
          });
        },
        validate: {
          payload: {
            user: {
              username: Joi.string().min(1).max(20).required(),
              password: Joi.string().min(1).max(20).required()
            }
          }
        }
      }
    },
    {
      method: 'DELETE',
      path: '/sessions',
      handler: function(request, reply) {
        var session = request.session.get('hapi_twitter_session');
        var db = request.server.plugins['hapi-mongodb'].db;
        if (!session) { 
          reply({ "message": "Already logged out" });
        } else {
          db.collection('sessions').remove({ "session_id": session.session_id }, function(err, writeResult) {
            if (err) {reply('Internal MongoDB error', err);}
            else {reply(writeResult);}
          });
        }
      }
    },
    {
      method: 'GET',
      path: '/sessions/authorized',
      handler: function(request,reply) {
        Auth.authorized(request,function(result) {
          reply(result);
        })
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
}