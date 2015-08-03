$(document).ready(function() {
  var Reservation = function(machine,date) {
    this.machine = machine;
    this.date = date;
  }

  var fillTable = function(response,table,hour) {
    for(var a=hour;a<24;a++) {
      var html = '';
      html += '<tr>';
      html +=   '<td>';
      html +=     a + ':00';
      html +=   '</td>';
      for(var b=1;b<6;b++) {
        var stylish = '<td style="background-color:lightgrey;">';
        var input = 'Open';
        for(var c=0;c<response.length;c++) {
          if(response[c].machine == b && response[c].hour == a) {
            input = response[c].user;
            stylish = '<td>';
          }
        }
        html += stylish;
        html +=   input;
        html += '</td>';
      }
      html += '</tr>'
      $('#table'+table).append(html);
    }
  };

  var getReservationData = function(date,table) {
    date = date.replace(' ','-');
    date = date.replace(' ','-');
    date = date.replace(' ','-');

    $.ajax({
      type: 'GET',
      url: 'reservations/day=' + date,
      dataType: 'json',
      success: function(response) {
        if(table == 1) {
          fillTable(response,table,parseInt(new Date().toString().slice(16,18)));
        } else {
          fillTable(response,table,0);
        }
      }
    });
  };

  var loggedOut = function() {
    $.ajax({
      type: 'GET',
      url: '/',
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
      dataType: 'json',
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

  //initiate dates on tables and fill tables
  today = new Date().toString();
  $('#today').text(today.slice(0,15));
  tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15);
  $('#tmrw').text(tmrw);
  getReservationData(today.slice(0,15),1);
  getReservationData(tmrw,2);
});