$(document).ready(function() {

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