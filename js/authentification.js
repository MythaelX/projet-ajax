'use strict';

//------------------------------------------------------------------------------
//--- authentication -----------------------------------------------------------
//------------------------------------------------------------------------------
// Display authentication form.
function authentication()
{
  $('#authentication-send').off('click').click(validateLogin);
  $("#authentication").show();
}

//------------------------------------------------------------------------------
//--- validateLogin ------------------------------------------------------------
//------------------------------------------------------------------------------
// Validate the login.
// \param event The callback event.
function validateLogin(event)
{
  var login;
  var password;
  var text;
  var xhr;

  event.preventDefault();

  // Check login/password fields.
  login = $('#login').val();
  password = $('#password').val();
  $('#errors').html('');
  if (login == '' || password == '')
  {
    text = '<div id="errors" class="alert alert-danger" role="alert">';
    text += '<span class="glyphicon glyphicon-exclamation-sign"'
    text += ' aria-hidden="true"></span>';
    text += '<strong> L\'un des champs est vide.</strong></div>';
    $('#errors').html(text);
  }
  else
  {
    // Create login cookie.
    Cookies.set('login', login);
    // Create XML HTTP request.
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/request.php/authenticate', true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' +
      password));
    // Add the onload function.
    xhr.onload = function ()
    {
      switch (xhr.status)
      {
        case 200:

          Cookies.set('token', xhr.responseText);
          $("#authentication").hide();
          $('#infos').html('Authentification OK');
          ajaxRequest('GET', 'php/request.php/photos/', loadPhotos);
          break;
        default:
          console.log("a");
          httpErrors(xhr.status);
      }
    };
    // Send XML HTTP request.
    xhr.send();
  }
}
