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
          var uniqReservationQuery = {
            $and: [
              {machine: reservation.machine},
              {day: reservation.day},
              {hour: reservation.hour}
            ]
          };
          Auth.authenticated(request, function(result) {
            if(!result.authenticated) {
              reply({authenticated : false});
            } else {
              db.collection('reservations').count(uniqReservationQuery, function(err,reservationExists) {
                if(err) {reply('Internal Mongo Error',err);}
                else {
                  if(reservationExists) {reply({reservationExists : true});}
                  else {
                    reservation.user_id = result.user_id;
                    db.collection('users').findOne({_id : result.user_id},function(err,user) {
                      if(err) {reply('Internal Mongo Error',err);}
                      else {
                        reservation.user = user.name;
                        db.collection('reservations').insert(reservation,function(err,writeResult) {
                          if(err) {reply('Internal Mongo Error',err);}
                          else {reply(writeResult);}
                        });
                      }
                    });
                  }
                }
              })
            }
          });
        },
        validate: {
          payload: {
            reservation: {
              machine: Joi.number().min(1).max(5).required(),
              day: Joi.string().min(5).max(20).required(),
              hour: Joi.string().min(2).max(2).required()
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/reservations/day={day}',
      handler: function(request,reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var day = encodeURIComponent(request.params.day);
        db.collection('reservations').find({day : day}).toArray(function(err,reservations) {
          if(err) {reply('Internal Mongo Error',err);}
          else {reply(reservations);}
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'reservations-routes',
  version: '0.0.1'
};