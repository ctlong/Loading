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
            if(err) {reply('Internal Mongo Error ', err);}
            else {
              if(userMongo === null) {
                reply({userExists: false});
              } else {
                Bcrypt.compare(user.password, userMongo.password, function(err, same) {
                  if(!same) {
                    reply({authorized : false});
                  } else {
                    var randomKeyGenerator = function() {
                      return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
                    }
                    var session = {
                      user_id: userMongo._id,
                      session_id: randomKeyGenerator()
                    };
                    db.collection('sessions').insert(session, function(err, writeResult) {
                      if(err) {reply('Internal Mongo Error',err);}
                      else {
                        request.session.set('hapi_twitter_session', session);
                        reply(writeResult);
                      }
                    });
                  }
                });
              }
            }
          });
        },
        validate: {
          payload: {
            user: {
              username: Joi.string().min(5).max(20).required(),
              password: Joi.string().min(5).max(20).required()
            }
          }
        }
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
}