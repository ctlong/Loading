$(document).ready(function() {

  var fillTable = function(response) {
    var hour = parseInt(new Date().toString().slice(16,18));
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
      $('table').append(html);
    }
  };

  var getReservationData = function(date) {
    date = date.replace(' ','-');
    date = date.replace(' ','-');
    date = date.replace(' ','-');

    $.ajax({
      type: 'GET',
      url: 'reservations?day=' + date,
      dataType: 'json',
      success: function(response) {
        fillTable(response);
      }
    });
  };

  $(document).on('click','#sign-up',function() {
    window.location.href = "/sign-up";
  });

  $(document).on('click','#log-in',function() {
    window.location.href = "/log-in";
  });

  $(document).on('click','#logo',function() {
    window.location.href = "/";
  });

  //initiate date and fill table
  $('#date').text(new Date().toString().slice(0,15));
  getReservationData(new Date().toString().slice(0,15));
});