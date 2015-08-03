$(document).ready(function() {
  
  var User = function(name,email,username,password) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  User.prototype.signedUp = function() {
    $.ajax({
      type: 'GET',
      url: 'log-in',
      success: function(response) {
        window.location.href = "/log-in";
        runError('Your sign up was a success, you may now log in');
      }
    });
  };

  User.prototype.signUp = function() {
    $.ajax({
      context: this,
      type: 'POST',
      url: 'users',
      data: {
        user: {
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password
        }
      },
      datatype: 'json',
      success: function(response) {
        if(response.ok) {
          this.signedUp();
        } else if(response.userExists) {
          runError('Either this username or this email already exists');
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

  $(document).on('click','#sign-up',function() {
    var newUser = new User();
    newUser.name = $('input')[0].value;
    newUser.email = $('input')[1].value;
    newUser.username = $('input')[2].value;
    newUser.password = $('input')[3].value;
    newUser.signUp();
  });

  $(document).on('click','#log-in',function() {
    $.ajax({
      type: 'GET',
      url: 'log-in',
      success: function(response) {
        window.location.href = "/log-in";
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