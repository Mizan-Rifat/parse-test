Parse.initialize('myAppId');

Parse.serverURL = 'http://localhost:1337/parse';
const pusher = new Pusher('621503252a4608413ccc', {
  authEndpoint: 'http://127.0.0.1:1337/pusher/auth',
  cluster: 'ap2',
});

const channel = pusher.subscribe('private-message');
channel.bind('my-event', function (data) {
  console.log(data);
});

$('#form').submit(e => {
  e.preventDefault();
  const value = $('input').val();
  Parse.Cloud.run('message', { value });
  // var triggered = channel.trigger('private-ChannelName', 'data');
});
