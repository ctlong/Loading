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
              return reply({authenticated : false});
            }
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
                if(err) {return reply('Internal Mongo Error',err);}
                if(reservationLimit > 1) {return reply({reservationLimit : true});}
                db.collection('users').findOne({_id : result.user_id},function(err,user) {
                  if(err) {reply('Internal Mongo Error',err);}
                  reservation.user = user.name;
                  db.collection('reservations').insert(reservation,function(err,writeResult) {
                    if(err) {return reply('Internal Mongo Error',err);}
                    reply(writeResult);
                  });
                });
              });
            });
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
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
        var user_id = request.query.id;
        if(day && user_id) {
          user_id = ObjectId(user_id);
          db.collection('reservations').find({$and: [{day : day},{user_id : user_id}]}).toArray(function(err,reservations) {
            if(err) {return reply('Internal Mongo Error',err);}
            reply(reservations);
          });
        } else if(day) {
          db.collection('reservations').find({day : day}).toArray(function(err,reservations) {
            if(err) {return reply('Internal Mongo Error',err);}
            reply(reservations);
          });
        }
        else {
          db.collection('reservations').find({}).toArray(function(err,reservations) {
            if(err) {return reply('Internal Mongo Error',err);}
            reply({data : reservations});
          });
        }
      }
    },
    {
      method: 'DELETE',
      path: '/reservations',
      handler: function(request,reply) {
        Auth.authenticated(request,function(result) {
          if(!result.authenticated) {return reply(result);}
          var db = request.server.plugins['hapi-mongodb'].db;
          var reservation = request.payload.reservation;
          var removeReservationQuery = {
            $and: [
              {day : reservation.day},
              {hour : reservation.hour},
              {machine : parseInt(reservation.machine)}
            ]
          };
          db.collection('reservations').remove(removeReservationQuery,function(err,writeResult) {
            if(err) {return reply('Internal Mongo Error',err);}
            reply(writeResult);
          });
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