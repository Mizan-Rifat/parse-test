Parse.initialize('myAppId');

Parse.serverURL = 'http://localhost:1337/parse';

$('#loginBtn').click(e => {
  const username = $('#username').val();
  const password = $('#password').val();
  Parse.User.logIn(username, password).then(res => {
    $('#chat').css('display', 'block');
  });
});
