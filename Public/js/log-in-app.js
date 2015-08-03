$(document).ready(function() {
  var User = function(username,password) {
    this.username = username;
    this.password = password;
  }

  User.prototype.logIn = function() {
    $.ajax({
      type: 'GET',
      
    })
  };

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