$(document).ready(function() {
  var User = function(name,email,username) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.id;
  }

  User.prototype.getUserInfo = function(username,password) {
    $.ajax({
      context: this,
      type: 'GET',
      url: 'users?username='+username+'&password='+password,
      dataType: 'json',
      success: function(response) {
        if(response.authorized) {
          this.name = response.user.name;
          this.email = response.user.email;
          this.id = response.user['_id'];
          this.username = response.user.username;
          this.loggedIn();
        } else if(response.authenticated == false) {
          logOut();
        }else if(response.userExists === false) {
          runError('Your username is wrong',0);
        } else if(response.authorized === false) {
          runError('Your password is wrong',0);
        } else {
          console.log(response);
        }
      }
    })
  };

  User.prototype.loggedIn = function() {
    $('section > p').remove();
    $('section > h2').remove();
    var html = '';
    html += '<section>';
    html +=   '<h2>'+this.name+'</h2>';
    html +=   '<p><span>Email:</span><span>'+this.email+'</span><button class="btn btn-success">Edit</button></p>';
    html +=   '<p><span>Password</span><button class="btn btn-success">Edit</button></p>';
    $($('section')[0]).prepend(html);
    $('section').show();
  }

  var logOut = function() {
    $.ajax({
      type: 'DELETE',
      url: 'sessions',
      dataType: 'json',
      success: function(response) {
        if(response.ok || response.message) {
          window.location.href = "/";
        } else {
          console.log(response);
        }
      }
    });
  };

  var moveOn = function(url) {
    window.location.href = "/"+url;
  };

  var runError = function(input,section) {
    $('#error').remove();
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $($('section')[section]).prepend(html)
  };

  $(document).on('click','#log-in',function() {
    var curUser = new User();
    curUser.getUserInfo($('input')[0].value,$('input')[1].value);
  });

  $(document).on('click','#log-out',function() {
    logOut();
  });

  $(document).on('click','a',function() {
    if(this == $('a')[0]) {
      moveOn('profile');
    } else if(this == $('a')[1]) {
      moveOn('reserve');
    } else if(this == $('a')[2]) {
      moveOn('chart');
    } else {
      moveOn('forum');
    }
  });

  $(document).on('click','#logo',function() {
    moveOn('reserve');
  });

  //initiate dates on tables and fill tables
  var today = new Date().toString();
  var tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15);
  // getReservationData(today.slice(0,15),1);
  // getReservationData(tmrw,2);
});