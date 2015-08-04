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

  $('#date').text(new Date().toString().slice(0,15));
});