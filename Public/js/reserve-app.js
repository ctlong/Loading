$(document).ready(function() {
  var Reservation = function() {
    this.machine;
    this.day;
    this.hour;
  }

  Reservation.prototype.makeReservation = function() {
    $.ajax({
      context: this,
      type: 'POST',
      url: 'reservations',
      data: {
        reservation: {
          machine: this.machine,
          day: this.day,
          hour: this.hour
        }
      },
      dataType: 'json',
      success: function(response) {
        if(response.ok) {
          moveOn('reserve');
        } else if(response.reservationExists) {
          if(new Date(this.day).toString() == new Date(today.slice(0,15)).toString()) {
            runError('This reservation is taken',0);
          } else {
            runError('This reservation is taken',1);
          }
        } else if(response.reservationLimit) {
          if(new Date(this.day).toString() == new Date(today.slice(0,15)).toString()) {
            runError('You cannot book more than two spots per day',0);
          } else {
            runError('You cannot book more than two spots per day',1);
          }
        } else if(!response.authenticated) {
          logOut();
        } else {
          console.log(response);
        }
      }
    });
  };

  var fillTable = function(response,table,hour) {
    for(var a=hour;a<24;a++) {
      var html = '';
      html += '<tr>';
      html +=   '<td>';
      if(a<10) {html += '0' + a + ':00';}
      else{html +=     a + ':00';}
      html +=   '</td>';
      for(var b=1;b<6;b++) {
        var opener = '<td><button class="btn btn-success res">';
        var input = 'Open';
        var closer = '</button></td>'
        for(var c=0;c<response.length;c++) {
          if(response[c].machine == b && response[c].hour == a) {
            opener = '<td style="background-color:orange;font-size:18px;color:white;padding-top:8px;">';
            input =   response[c].user;
            closer = '</td>';
          }
        }
        html += opener;
        html +=   input;
        html += closer;
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
      url: 'reservations?day=' + date,
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

  var logOut = function() {
    $.ajax({
      type: 'DELETE',
      url: 'sessions',
      dataType: 'json',
      success: function(response) {
        if(response.ok || response.message) {
          window.location.href = "/";
        } else {
          console.log(response);
        }
      }
    });
  }

  var moveOn = function(url) {
    window.location.href = "/"+url;
  };

  var runError = function(input,section) {
    $('#error').remove()
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $($('section')[section]).prepend(html)
  }

  Reservation.prototype.getValues = function(button,table) {
    var hour;
    var machine;
    var ind;
    for(var a=1;a<24;a++) {
      if($(button).parent().parent()[0] == $(table+' tr')[a]) {
        ind = a;
      }
    }
    $(table).find('tr').each(function (i, el) {
      if(i == ind) {
        hour = $($(this).find('td')[0]).text().slice(0,2);
        var tds = $(this).find('td').each(function(index,elem){
          if(elem == $(button).parent()[0]) {
            machine = index;
          }
        });
      }
    });
    this.machine = machine;
    this.hour = hour;
  }

  $(document).on('click','.res',function() {
    var newReservation = new Reservation();
    if($(this).parent().parent().parent().parent().attr('id') == 'table1') {
      newReservation.day = today.slice(0,15).replace(' ','-').replace(' ','-').replace(' ','-');
      newReservation.getValues(this,'#table1');
    } else {
      newReservation.day = tmrw.replace(' ','-').replace(' ','-').replace(' ','-');
      newReservation.getValues(this,'#table2');
    }
    newReservation.makeReservation();
  });

  $(document).on('click','#log-out',function() {
    logOut();
  });

  $(document).on('click','a',function() {
      url = $(this).text().toLowerCase();
      moveOn(url);
  });

  $(document).on('click','#logo',function() {
    moveOn('reserve');
  });

  //initiate dates on tables and fill tables
  var today = new Date().toString();
  $('#today').text(today.slice(0,15));
  var tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15);
  $('#tmrw').text(tmrw);
  getReservationData(today.slice(0,15),1);
  getReservationData(tmrw,2);
});