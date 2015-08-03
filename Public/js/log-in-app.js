$(document).ready(function() {
  var User = function(name,email,username,password) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  } 

  $(document).on('click','#log-in',function() {
    var name = $('input')[0].value;
    var email = $('input')[1].value;
    var curUser = new User(name,email,null,null);
    curUser.
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