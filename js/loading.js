ajaxRequest('GET', 'php/request.php/photos/', loadPhotos);

//------------------------------------------------------------------------------
//--- loadPhotos------------------------------------------------------------
//------------------------------------------------------------------------------
// load Photos.
// \param ajaxResponse The data received via the Ajax request.

function loadPhotos(ajaxResponse){
  var data;
  // Decode JSON response.
  data= JSON.parse(ajaxResponse);
  //Display photos
  thumbnails = $('#thumbnails');
  for(var i=0;i<data.length;i++){
    var element = document.createElement('div');
    element.className = 'col-xs-2 col-md-2';
    element.innerHTML = '<a href="#" class="thumbnail"><img src="' +
      data[i].src + '" id="photo-' + data[i].id + '"></a>';
    thumbnails.append(element);
    //Display photo event
    $('#photo-' + data[i].id).unbind('click').click(
      function (event){
        var id;
        id = event.target.id.substr(6);
        event.preventDefault();
        ajaxRequest('GET', 'php/request.php/photos/' + id, loadPhoto);
        ajaxRequest('GET', 'php/request.php/comments/'+id, loadComments);
      });
  }
}

//------------------------------------------------------------------------------
//--- loadPhoto------------------------------------------------------------
//------------------------------------------------------------------------------
// load Photo.
// \param ajaxResponse The data received via the Ajax request.

function loadPhoto(ajaxResponse)
{
  var data;
  var text='';
  // Decode JSON response.
  data = JSON.parse(ajaxResponse);
  //Display photo
  text = '<div class="panel panel-default"><div class="panel-body">';
  text += '<h2>' + data[0].title + '</h2>';
  text += '<div class="row"><div class="col-xs-12 col-md-12">';
  text += '<a href="#" class="thumbnail"><img src="' + data[0].src + '">';
  text += '</a></div></div></div></div>';
  $('#photo').html(text);
  $('#photo').attr('photoid', data[0].id);
}

//------------------------------------------------------------------------------
//--- loadcomments ------------------------------------------------------------
//------------------------------------------------------------------------------
// load comments.
// \param ajaxResponse The data received via the Ajax request.

function loadComments(ajaxResponse){
  $("#comments-add").show();
  var data;
  var text;
  var photoId = $('#photo').attr('photoid');
  // Decode JSON response.
  data = JSON.parse(ajaxResponse);
  // Fill comments.
  for (var i = 0; i < data.length; i++)
  {
    $('#comments').append(
      '<div class="panel panel-default"><div class="panel-body">' +
      data[i].userLogin + ' : ' + data[i].comment +
      '<a><span id=del' + data[i].id +
      ' class="glyphicon glyphicon-trash pull-right" aria-hidden="true"></a></div></div>');
  //Delete comments event
    $('#del' + data[i].id).unbind('click').click(function (event)
    {
      var id = event.target.id.substr(3);
      ajaxRequest('DELETE', 'php/request.php/comments/'+id, function ()
        {
          $('#comments').html('');
          ajaxRequest('GET', 'php/request.php/comments/'+photoId, loadComments);
        });
    });
  }
}

//ADD comments event
$('#add-button').unbind('click').click(function (event)
{
  var photoId = $('#photo').attr('photoid');
  event.preventDefault();
  ajaxRequest('POST', 'php/request.php/comments/', function ()
  {
    $('#comments').html('');
    ajaxRequest('GET', 'php/request.php/comments/'+photoId, loadComments);
  },'photoId='+ photoId +'&text=' + $('#commentaires').val());
  console.log($('#comments').val());
});
