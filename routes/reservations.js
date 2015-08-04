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
              var uniqReservationQuery = {
                $and: [
                  {day: reservation.day},
                  {hour: reservation.hour},
                  {machine: reservation.machine}
                ]
              };
              db.collection('reservations').count(uniqReservationQuery,function(err,reservationExists) {
                if(err) {return reply('Internal Mongo Error',err);}
                if(reservationExists) {return reply({reservationExists : true});}
                var withinLimitQuery = {
                  $and: [
                    {user_id: reservation.user_id},
                    {day: reservation.day}
                  ]
                };
                db.collection('reservations').count(withinLimitQuery, function(err,reservationLimit) {
                  if(err) {reply('Internal Mongo Error',err);}
                  else {
                    if(reservationLimit > 1) {reply({reservationLimit : true});}
                    else {
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
                });
              });
            }
          });
        },
        validate: {
          payload: {
            reservation: {
              machine: Joi.number().min(1).max(5).required(),
              day: Joi.string().min(1).max(20).required(),
              hour: Joi.string().min(1).max(2).required()
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/reservations',
      handler: function(request,reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var day = request.query.day;
        if(day) {
          db.collection('reservations').find({day : day}).toArray(function(err,reservations) {
            if(err) {reply('Internal Mongo Error',err);}
            else {reply(reservations);}
          });
        }
        else {
          db.collection('reservations').find({}).toArray(function(err,reservations) {
            if(err) {reply('Internal Mongo Error',err);}
            else {reply(reservations);}
          });
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