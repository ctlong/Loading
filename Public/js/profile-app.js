$(document).ready(function() {
  var User = function(name,email,username) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.id;
  }
  var Reservation = function(hour,day,machine) {
    this.hour = hour;
    this.machine = machine;
    this.day = day;
  }

  User.prototype.getUserInfo = function(username,password) {
    $.ajax({
      context: this,
      type: 'GET',
      url: 'users?username='+username+'&password='+password,
      dataType: 'json',
      success: function(response) {
        if(response.authorized) {
          this.name = response.user.name;
          this.email = response.user.email;
          this.id = response.user._id;
          this.username = response.user.username;
          this.loggedIn();
        } else if(response.authenticated == false) {
          logOut();
        }else if(response.userExists === false) {
          runError('Your username is wrong',0);
        } else if(response.authorized === false) {
          runError('Your password is wrong',0);
        } else {
          console.log(response);
        }
      }
    })
  };

  User.prototype.loggedIn = function() {
    $('section > p').remove();
    $('section > h2').remove();
    var html = '';
    html += '<section>';
    html +=   '<h2>'+this.name+'</h2>';
    html +=   '<p><span>Email:</span><span>'+this.email+'</span><button class="btn btn-success">Edit</button></p>';
    html +=   '<p><span>Password:</span><span>*****</span><button class="btn btn-success">Edit</button></p>';
    $($('section')[0]).prepend(html);
    $('section').show();
    this.getReservationDataToday();
  }

  User.prototype.getReservationDataToday = function(date) {
    date = today.slice(0,15);
    date = date.replace(' ','-');
    date = date.replace(' ','-');
    date = date.replace(' ','-');

    $.ajax({
      context: this,
      type: 'GET',
      url: 'reservations?day='+date+'&id='+this.id,
      dataType: 'json',
      success: function(response) {
        if(response.length > 0) {
          for(var a in response) {
            var getReservation = new Reservation(response[a].hour,response[a].day,response[a].machine)
            getReservation.fillTable(parseInt(new Date().toString().slice(16,18)),'Today');
          }
          this.getReservationDataTmrw(false);
        } else {
          this.getReservationDataTmrw(true);
        }
      }
    });
  };

  User.prototype.getReservationDataTmrw = function(empty) {
    date = tmrw;
    date = date.replace(' ','-');
    date = date.replace(' ','-');
    date = date.replace(' ','-');

    $.ajax({
      context: this,
      type: 'GET',
      url: 'reservations?day='+date+'&id='+this.id,
      dataType: 'json',
      success: function(response) {
        if(response.length > 0) {
          for(var a in response) {
            var getReservation = new Reservation(response[a].hour,response[a].day,response[a].machine)
            getReservation.fillTable(0,'Tomorrow');
          }
        } else {
          if(empty) {emptyTable();}
        }
      }
    });
  };

  var emptyTable = function() {
    $('#table').hide();
    var html = '';
    html += '<h3>';
    html +=   'No Reservations';
    html += '</h3>';
    $($('section')[2]).append(html);
  };

  Reservation.prototype.fillTable = function(hour,day) {
    if(parseInt(this.hour) >= hour) {
      var html = '';
      html += '<tr>';
      html +=   '<td>';
      html +=     this.hour+':00';
      html +=   '</td>';
      html +=   '<td>';
      html +=     this.machine;
      html +=   '</td>';
      html +=   '<td>';
      html +=     day;
      html +=   '</td>';
      html +=   '<td><button class="btn btn-success remove">Remove</button></td>';
      html += '</tr>'
      $('#table').append(html);
    }
  };

  Reservation.prototype.runRemove = function(button) {
    $.ajax({
      context: this,
      type: 'DELETE',
      url: 'reservations',
      data: {
        reservation: {
          machine: this.machine,
          hour: this.hour,
          day: this.day
        }
      },
      dataType: 'json',
      success: function(response) {
        console.log(response);
        if(response.ok) {
          $(button).parent().parent().remove();
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
  };

  var moveOn = function(url) {
    window.location.href = "/"+url;
  };

  var runError = function(input,section) {
    $('#error').remove();
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $($('section')[section]).prepend(html)
  };

  $(document).on('click','.remove',function() {
    var removeReservation = new Reservation();
    var ind;
    for(var a=1;a<=4;a++) {
      if($(this).parent().parent()[0] == $('#table tr')[a]) {
        ind = a;
      }
    }
    $('#table').find('tr').each(function (i, el) {
      if(i == ind) {
        removeReservation.hour = $($(this).find('td')[0]).text().slice(0,2);
        removeReservation.machine = parseInt($($(this).find('td')[1]).text());
        if($($(this).find('td')[2]).text() == 'Today') {
          removeReservation.day = today.slice(0,15).replace(' ','-').replace(' ','-').replace(' ','-');
        } else {
          removeReservation.day = tmrw.replace(' ','-').replace(' ','-').replace(' ','-');
        }
      }
    });
    removeReservation.runRemove(this);
  })

  $(document).on('click','#log-in',function() {
    var curUser = new User();
    curUser.getUserInfo($('input')[0].value,$('input')[1].value);
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
  var tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15);
});