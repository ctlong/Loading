$(document).ready(function() {

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