const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '1210587',
  key: '621503252a4608413ccc',
  secret: '6686587d8f5faa2744ce',
  cluster: 'ap2',
  useTLS: true,
});

Parse.Cloud.define('message', req => {
  // console.log(req.params.value);
  pusher.trigger('private-message', 'my-event', { message: req.params.value });
  return req.params.value;
});

Parse.Cloud.define('asyncFunction', async req => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  req.log.info(req);
  return 'Hi async';
});

Parse.Cloud.beforeSave('Messages', (req) => {
  req.object.set('deletedFromSender',false);
  req.object.set('deletedFromReceiver',false);
  req.object.set('seen',false);
},{
  fields:{
    messageTo:{
      required:true,
    },
    messageFrom:{
      required:true,
    },
    message:{
      required:true,
    },
    channel:{
      required:true,
    },
  }
});

Parse.Cloud.afterSave('Messages', function(request) {
  // if (request.object.existed()) {
  //   return;
  // }

  const channel = request.object.get("channel");
  pusher.trigger(channel, 'incomingMessage', request.object);
});
