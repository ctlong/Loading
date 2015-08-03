$(document).ready(function() {
  var User = function(username,password) {
    this.username = username;
    this.password = password;
  }

  User.prototype.loggedIn = function() {
    $.ajax({
      type: 'GET',
      url: 'reserv',
      success: function(response) {
        window.location.href = "/reserv";
      }
    })
  };

  User.prototype.logIn = function() {
    $.ajax({
      context: this,
      type: 'POST',
      url: 'sessions',
      data: {
        user: {
          username: this.username,
          password: this.password
        }
      },
      datatype: 'json',
      success: function(response) {
        if(response.ok) {
          this.loggedIn();
        } else if(!response.authorized) {
          runError('Your password does not match your username.');
        } else if(!response.userExists) {
          runError('This username does not exist.')
        } else {
          console.log(response);
        }
      }
    });
  };

  var runError = function(input) {
    $('#error').remove()
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $('section').prepend(html)
  }

  $(document).on('click','#log-in',function() {
    var name = $('input')[0].value;
    var email = $('input')[1].value;
    var curUser = new User(name,email,null,null);
    curUser.logIn();
  })

  $(document).on('click','#sign-up',function() {
    $.ajax({
      type: 'GET',
      url: 'sign-up',
      success: function(response) {
        window.location.href = "/sign-up";
      }
    });
  });

  $(document).on('click','#logo',function() {
    $.ajax({
      type: 'GET',
      url: '/',
      success: function(response) {
        window.location.href = "/";
      }
    });
  });
  
});