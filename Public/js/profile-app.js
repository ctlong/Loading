$(document).ready(function() {
  var User = function(name,email,username) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.id;
    this.newPassword;
    this.oldPassword;
    this.password;
  }

  User.prototype.getUserInfo = function() {
    var constructHtml = function(name,email) {
      var html = '';
      html +=   '<h2>' + name + '</h2>';
      html +=   '<p><span>Email:</span><span id="current-email">' + email + '</span><button class="btn btn-success" data-toggle="modal" data-target="#change-email">Edit</button></p>';
      html +=   '<p><span>Password:</span><span>*****</span><button class="btn btn-success" data-toggle="modal" data-target="#change-password">Edit</button></p>';
      $($('section')[0]).prepend(html);
      $('section').show();
    }

    $.ajax({
      context: this,
      type: 'GET',
      url: 'users',
      dataType: 'json',
      success: function(response) {
        if(response.authorized) {
          this.name = response.user.name;
          this.email = response.user.email;
          this.username = response.user.username;
          this.id = response.user._id;
          constructHtml(this.name,this.email);
          this.getReservationDataToday();
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

  User.prototype.updateUser = function(type) {
    $.ajax({
      context: this,
      type: 'PUT',
      url: 'users',
      data: {
        updatedUser: {
          oldPassword : this.oldPassword,
          newPassword : this.newPassword,
          email : this.email
        }
      },
      dataType: 'json',
      success: function(response) {
        $('#response').remove();
        if(response.ok) {
          $('#change-' + type + ' .modal-body').append('<p id="response" style="color:green;">'+ type + ' successfully changed</p>');
          if(this.email) {$('#current-email').text(this.email);}
          setTimeout(function() {
            $('#change-' + type).modal('hide');
            $('#response').remove();
            $('.modal-body input').val('');
          },1000);
        } else if(response.authenticated == false || response.userExists == false) {
          logOut();
        } else if(response.authorized == false) {
          $('#change-password .modal-body').append('<p id="response">Wrong password</p>');
        } else {
          console.log(response);
        }
      },
      error: function(response) {
        console.log(response);
        $('#response').remove();
        var html;
        if(type == 'password') {html = 'Your password/s do not fit the required length';}
        else {html = 'This is not an email';}
        $('#change-' + type + ' .modal-body').append('<p id="response">' + html + '</p>');
      }
    });
  };

  User.prototype.getReservationDataToday = function() {
    day = today.slice(0,15);
    day = day.replace(' ','-');
    day = day.replace(' ','-');
    day = day.replace(' ','-');

    $.ajax({
      context: this,
      type: 'GET',
      url: 'reservations?day=' + day + '&id=' + this.id,
      dataType: 'json',
      success: function(response) {
        for(var a in response) {
          var getReservation = new Reservation(response[a].hour,response[a].day,response[a].machine)
          getReservation.fillTable(parseInt(new Date().toString().slice(16,18)),'Today');
        }
        this.getReservationDataTmrw();
      }
    });
  };

  User.prototype.getReservationDataTmrw = function() {
    day = tmrw;
    day = day.replace(' ','-');
    day = day.replace(' ','-');
    day = day.replace(' ','-');

    $.ajax({
      context: this,
      type: 'GET',
      url: 'reservations?day=' + day + '&id=' + this.id,
      dataType: 'json',
      success: function(response) {
        if(response.length > 0) {
          for(var a in response) {
            var getReservation = new Reservation(response[a].hour,response[a].day,response[a].machine)
            getReservation.fillTable(0,'Tomorrow');
          }
        } else {
          if($('#table tr').length == 1) {emptyTable();}
        }
      }
    });
  };

  var Reservation = function(hour,day,machine) {
    this.hour = hour;
    this.machine = machine;
    this.day = day;
  };

  Reservation.prototype.fillTable = function(hour,day) {
    if(parseInt(this.hour) >= hour) {
      var html = '';
      html += '<tr>';
      html +=   '<td>';
      html +=     this.hour + ':00';
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
        } else if(response.authenticated == false) {
          logOut();
        } else {
          console.log(response);
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
    $($('section')[1]).append(html);
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
    window.location.href = "/" + url;
  };

  var runError = function(input,section) {
    $('#error').remove();
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $($('section')[section]).prepend(html)
  };

  $(document).on('click','#save',function() {
    var updatedUser = new User();
    if($('#change-password #save')[0] == $(this)[0]) {
      updatedUser.oldPassword = $('#change-password input')[0].value;
      updatedUser.newPassword = $('#change-password input')[1].value;
      updatedUser.updateUser('password');
    } else {
      updatedUser.email = $('#change-email input')[0].value;
      updatedUser.updateUser('email');
    }
  });

  $(document).on('click','#cancel',function() {
    $('#response').remove();
    $('.modal-body input').val('');
  });

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
    curUser.getUserInfo();
    curUser.username = $('input')[0].value;
    curUser.password = $('input')[1].value;
    
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

  //initiate dates on tables, fill tables, and get User info
  var today = new Date().toString();
  var tmrw = new Date(today.slice(4,7) + ' 0' + (parseInt(today.slice(8,10))+1) + ' ' + today.slice(12,15)).toString().slice(0,15)
  var curUser = new User();
  curUser.getUserInfo();;
});