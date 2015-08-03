$(document).ready(function() {
  var Reservation = function(machine,date) {
    this.machine = machine;
    this.date = date;
  }

  var loggedOut = function() {
    $.ajax({
      type: 'GET',
      url: url,
      success: function(response) {
        window.location.href = "/";
      }
    });
  };

  var moveOn = function(url) {
    $.ajax({
      type: 'GET',
      url: url,
      success: function(response) {
        window.location.href = "/"+url;
      }
    });
  };

  $(document).on('click','#sign-up',function() {
    $.ajax({
      type: 'GET',
      url: 'sign-up',
      success: function(response) {
        window.location.href = "/sign-up";
      }
    });
  });

  $(document).on('click','#log-out',function() {
    $.ajax({
      type: 'DELETE',
      url: 'sessions',
      success: function(response) {
        if(response.ok || response.message) {
          loggedOut();
        } else {
          console.log(response);
        }
      }
    });
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
    $.ajax({
      type: 'GET',
      url: 'reserve',
      success: function(response) {
        window.location.href = "/reserve";
      }
    });
  });

  //initiate dates on tables
  today = new Date().toString();
  $('#today').text(today.slice(0,15));
  tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15);
  $('#tmrw').text(tmrw);
});