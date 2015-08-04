var Bcrypt = require('bcrypt');
var Joi = require('joi');

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
            if(userExist) {
              reply({userExists : true});
            } else {
            //encrypt password
              Bcrypt.genSalt(10, function(err, salt) {
                Bcrypt.hash(user.password, salt, function(err, encrypted) {
                    user.password = encrypted;
                    db.collection('users').insert(user,function(err,writeResult) {
                    if(err) {
                      reply('Internal Mongo Error', err);
                    } else {
                      reply(writeResult);
                    }
                  });
                });
              });
            }
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
    }
    // {
    //   method: 'GET',
    //   path: '/users?id={id}',
    //   handler: function(request,reply) {
    //     var user_id = encodeURIComponent(request.params.id);

    //   }
    // }
  ]);

  next();
}

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
}