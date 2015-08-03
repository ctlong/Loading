var Auth = require('./auth');
var Joi = require('joi');

exports.register = function(server,options,next) {
  
  server.route([
    {
      method: 'POST',
      path: '/reservations',
      config: {
        handler: function(request,reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var reservation = request.payload.reservation;
          Auth.authenticated(request, function(result) {
            if(!result.authenticated) {
              reply({authenticated : false});
            } else {
              reservation.user_id = result.user_id;
              db.collection('reservations').insert(reservation,function(err,writeResult) {
                if(err) {reply('Internal Mongo Error',err);}
                else {reply(writeResult);}
              });
            }
          });
        },
        validate: {
          payload: {
            reservation: {
              machine: Joi.number().min(1).max(5).required(),
              date: Joi.date().min('Aug 03 2015').required()
            }
          }
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'reservations-routes',
  version: '0.0.1'
};