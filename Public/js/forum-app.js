$(document).ready(function() {
  var User = function(id) {
    this.id = id;
  }

  var Post = function() {
    this.type;
    this.message;
    this.user;
    this.date = new Date().toString().slice(0,21);
    this.id;
    this.user_id;
  }

  Post.prototype.removePost = function(button) {
    $.ajax({
      context: this,
      type: 'DELETE',
      url: 'posts',
      data: {
        post: {
          id: this.id
        }
      },
      dataType: 'json',
      success: function(response) {
        if(response.ok) {
          $(button).parent().remove();
        } else if(response.authenticated == false) {
          logOut();
        } else if(response.usersPost == false) {
          logOut();
        } else {
          console.log(response);
        }
      },
      error: function(response) {
        console.log(response);
      }
    })
  };

  Post.prototype.makePost = function() {
    $.ajax({
      context: this,
      type: 'POST',
      url: 'posts',
      data: {
        post: {
          type: this.type,
          message: this.message,
          date: this.date
        }
      },
      dataType: 'json',
      success: function(response) {
        if(response.ok) {
          $('article').remove();
          getPosts();
          $('#add-post').modal('hide');
        } else if(response.userExists == false) {
          logOut();
        } else if(response.authenticated == false) {
          logOut();
        } else {
          console.log(response);
        }
      },
      error: function(response) {
        console.log(response);
        runError('Your title and/or message are not within the required character limits')
      }
    });
  };

  Post.prototype.insert = function(user) {
    var html = '';
    html += '<article>';
    html += '<p class="name">' + this.user + '<span class="glyphicon glyphicon-asterisk" aria-hidden="true"></span></p>';
    html += '<p class="date">' + this.date + '</p>';
    if(this.user_id == user.id) {
      html += '<button class="btn btn-default remove" data-id="' + this.id + '">Delete</button>';
    }
    html += '<h5 class="title">' + this.type + '</h5>';
    html += '<p class="message">' + this.message + '</p>';
    html += '</article>';
    $('#forum').append(html);
  };

  var getPosts = function() {
    $.ajax({
      type: 'GET',
      url: 'posts',
      dataType: 'json',
      success: function(response) {
        if(response.data) {
          var posts = response.data.reverse();
          var user = new User(response.user);
          for(var a in posts) {
            var post = new Post();
            post.date = posts[a].date;
            post.message = posts[a].message;
            post.user_id = posts[a].user_id;
            post.user = posts[a].user;
            post.id = posts[a]._id;
            post.type = posts[a].type;
            post.insert(user);
          }
          if($('article').length == 0) {
            $('#forum').append('<h4>No Posts</h4>');
          }
        } else if(!response.authenticated) {
          logOut();
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
  }

  var moveOn = function(url) {
    window.location.href = "/"+url;
  };

  var runError = function(input) {
    $('#error').remove()
    var html = '';
    html += '<p id="error">';
    html +=   input;
    html += '</p>';
    $('.modal-body').prepend(html)
  }

  $(document).on('click','.remove',function() {
    var post = new Post();
    post.id = $(this).attr('data-id');
    post.removePost(this);
  });

  $(document).on('click','#save',function() {
    var newPost = new Post();
    newPost.type = $('#add-post input')[0].value;
    newPost.message = $('#add-post input')[1].value;
    newPost.makePost();
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
  getPosts();
});