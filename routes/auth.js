module.exports = {};

module.exports.authenticated = function(request,callback) {
  //retrieve session from cookie
  var cookie = request.session.get('hapi_twitter_session');
  //check if cookie exists
  if(!cookie) {return callback({authenticated : false});}
  //get session id from cookie
  var session_id = cookie.session_id;
  //check if session id exists in sessions
  var db = request.server.plugins['hapi-mongodb'].db;
  db.collection('sessions').findOne({session_id : session_id},function(err,session) {
    if(!session) {return callback({authenticated : false});}
    callback({authenticated : true, user_id : session.user_id});
  });
};