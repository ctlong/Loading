$(document).ready(function() {
  var Chart = function() {
    this.graphDataDay;
    this.mon = 0;
    this.tue = 0;
    this.wed = 0;
    this.thu = 0;
    this.fri = 0;
    this.sat = 0;
    this.sun = 0;
    this.graphDataHour;
    this.one = 0;
    this.two = 0;
    this.three = 0;
    this.four = 0;
    this.five = 0;
    this.six = 0;
    this.seven = 0;
    this.eight = 0;
    this.nine = 0;
    this.ten = 0;
    this.eleven = 0;
    this.twelve = 0;
    this.thirteen = 0;
    this.fourteen = 0;
    this.fifteen = 0;
    this.sixteen = 0;
    this.seventeen = 0;
    this.eighteen = 0;
    this.nineteen = 0;
    this.twenty = 0;
    this.twentyOne = 0;
    this.twentyTwo = 0;
    this.twentyThree = 0;
  }

  Chart.prototype.graph = function() {
    var highChartConfigDay = {
      chart: {type: 'column'},
      title: {text: 'Washing Machine Usage'},
      subtitle: {text: 'By day'},
      xAxis: {
        categories: ['Mon','Tue','Wed','Thur','Fri','Sat','Sun']
      },
      yAxis: {
        title: {text:'Number of reservations'}
      },
      series: [{name: 'reservations', data: this.graphDataDay}]
    };

    $('#chart').highcharts(highChartConfigDay);

    var cats = [];
    for(var a=0;a<24;a++) {
      if(a<10) {
        cats.push('0' + a + ':00');
      } else {
        cats.push(a + ':00');
      }
    }

    var highChartConfigHour = {
      chart: {type: 'column'},
      title: {text: 'Washing Machine Usage'},
      subtitle: {text: 'By hour'},
      xAxis: {
        categories: cats
      },
      yAxis: {
        title: {text:'Number of reservations'}
      },
      series: [{name: 'reservations', data: this.graphDataHour}]
    };

    $('#chart2').highcharts(highChartConfigHour);
  };

  Chart.prototype.sortData = function(array) {
    for(var a in array) {
      if(array[a].day.slice(0,3) == 'Mon') {
        this.mon++;
      } else if(array[a].day.slice(0,3) == 'Tue') {
        this.tue++;
      } else if(array[a].day.slice(0,3) == 'Wed') {
        this.wed++;
      } else if(array[a].day.slice(0,3) == 'Thu') {
        this.thu++;
      } else if(array[a].day.slice(0,3) == 'Fri') {
        this.fri++;
      } else if(array[a].day.slice(0,3) == 'Sat') {
        this.sat++;
      } else {
        this.sun++;
      }
      if(array[a].hour == '00') {
        this.zero++;
      } else if(array[a].hour == '01') {
        this.one++;
      } else if(array[a].hour == '02') {
        this.two++;
      } else if(array[a].hour == '03') {
        this.three++;
      } else if(array[a].hour == '04') {
        this.four++;
      } else if(array[a].hour == '05') {
        this.five++;
      } else if(array[a].hour == '06') {
        this.six++;
      } else if(array[a].hour == '07') {
        this.seven++;
      } else if(array[a].hour == '08') {
        this.eight++;
      } else if(array[a].hour == '09') {
        this.nine++;
      } else if(array[a].hour == '10') {
        this.ten++;
      } else if(array[a].hour == '11') {
        this.eleven++;
      } else if(array[a].hour == '12') {
        this.twelve++;
      } else if(array[a].hour == '13') {
        this.thirteen++;
      } else if(array[a].hour == '14') {
        this.fourteen++;
      } else if(array[a].hour == '15') {
        this.fifteen++;
      } else if(array[a].hour == '16') {
        this.sixteen++;
      } else if(array[a].hour == '17') {
        this.seventeen++;
      } else if(array[a].hour == '18') {
        this.eighteen++;
      } else if(array[a].hour == '19') {
        this.nineteen++;
      } else if(array[a].hour == '20') {
        this.twenty++;
      } else if(array[a].hour == '21') {
        this.twentyOne++;
      } else if(array[a].hour == '22') {
        this.twentyTwo++;
      } else {
        this.twentyThree++;
      }
    }
    this.graphDataDay = [this.mon,this.tue,this.wed,this.thu,this.fri,this.sat,this.sun];
    this.graphDataHour = [this.one,this.two,this.three,this.four,this.five,this.six,this.seven,this.eight,this.nine,this.ten,this.eleven,this.twelve,this.thirteen,this.fourteen,this.fifteen,this.sixteen,this.seventeen,this.eighteen,this.nineteen,this.twenty,this.twentyOne,this.twentyTwo,this.twentyThree];
    this.graph();
  };

  var getReservationData = function() {
    $.ajax({
      type: 'GET',
      url: 'reservations',
      dataType: 'json',
      success: function(response) {
        if(response.data) {
          var reservations = response.data.reverse();
          var chart = new Chart();
          chart.sortData(reservations);
        } else {
          console.log(response);
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
  getReservationData();
});