$(document).ready(function() {
  var User = function(username,password) {
    this.username = username;
    this.password = password;
  }

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
      dataType: 'json',
      success: function(response) {
        if(response.ok) {
          $('#success').modal('show')
          setTimeout(function() {
            window.location.href = "/reserve";
          },1500);
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
    $('section').append(html)
  }

  $(document).on('click','#log-in',function() {
    var name = $('input')[0].value;
    var email = $('input')[1].value;
    var curUser = new User(name,email,null,null);
    curUser.logIn();
  })

  $(document).on('click','#sign-up',function() {
    window.location.href = "/sign-up";
  });

  $(document).on('click','#logo',function() {
    window.location.href = "/";
  });
  
});