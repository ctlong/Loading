var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next) {

  server.route([
    {
      method: 'POST',
      path: '/users',
      config: {
        handler: function(request,reply){
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload.user;
          var uniqUserQuery = {
            $or: [
              {username: user.username},
              {email: user.email}
            ]
          };
          db.collection('users').count(uniqUserQuery,function(err,userExist) {
            if(userExist) {return reply({userExists : true});}
            //encrypt password
            Bcrypt.genSalt(10, function(err, salt) {
              Bcrypt.hash(user.password, salt, function(err, encrypted) {
                user.password = encrypted;
                db.collection('users').insert(user,function(err,writeResult) {
                  if(err) {return reply('Internal Mongo Error', err);}
                  reply(writeResult);
                });
              });
            });
          });
        },
        validate: {
          payload: {
            user: {
              name: Joi.string().min(2).max(20).optional(),
              email: Joi.string().email().max(50).required(),
              username: Joi.string().min(5).max(20).required(),
              password: Joi.string().min(5).max(20).required()
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/users',
      handler: function(request,reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var username = request.query.username;
        var password = request.query.password
        Auth.authenticated(request,function(result) {
          if(!result.authenticated) {return reply(result);}
          db.collection('users').findOne({$and: [{username : username},{_id : result.user_id}]},function(err,userMongo) {
            if(err) {return reply('Internal Mongo Error ', err);}
            if(userMongo === null) {return reply({userExists: false});}
            Bcrypt.compare(password, userMongo.password, function(err, same) {
              if(err) {return reply('Bcrypt error',err)}
              if(!same) {return reply({authorized : false});}
              reply({authorized : true,user : userMongo});
            });
          });
        });
      }
    },
    {
      method: 'PUT',
      path: '/users',
      config: {
        handler: function(request,reply) {
          Auth.authenticated(request,function(result) {
            if(!result.authenticated) {return reply(result);}
            var db = request.server.plugins['hapi-mongodb'].db;
            var oldPassword = request.payload.updatedUser.oldPassword;
            var newPassword = request.payload.updatedUser.newPassword;
            var email = request.payload.updatedUser.email;
            if(!email) {
              db.collection('users').findOne({_id : result.user_id},function(err,userMongo) {
                if(err) {return reply('Internal Mongo Error ', err);}
                if(userMongo === null) {return reply({userExists: false});}
                Bcrypt.compare(oldPassword, userMongo.password, function(err, same) {
                  if(err) {return reply('Bcrypt error',err)}
                  if(!same) {return reply({authorized : false});}
                  Bcrypt.genSalt(10, function(err, salt) {
                    if(err) {return reply('Internal Bcrypt Error',err);}
                    Bcrypt.hash(newPassword, salt, function(err, encrypted) {
                      if(err) {return reply('Internal Bcrypt Error',err);}
                      db.collection('users').update({_id : result.user_id},{$set: {password : encrypted}},function(err,writeResult) {
                        if(err) {return reply(err);}
                        reply(writeResult);
                      });
                    });
                  });
                });
              });
            } else {
              db.collection('users').update({_id : result.user_id},{$set: {email : email}},function(err,writeResult) {
                if(err) {return reply(err);}
                reply(writeResult);
              });
            }
          });
        },
        validate: {
          payload: {
            updatedUser: {
              oldPassword: Joi.string().min(5).max(20).optional(),
              newPassword: Joi.string().min(5).max(20).optional(),
              email: Joi.string().email().max(50).optional()
            }
          }
        }
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
}