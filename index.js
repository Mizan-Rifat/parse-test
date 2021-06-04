// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');

const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },
};

const pusher = new Pusher({
  appId: '1210587',
  key: '621503252a4608413ccc',
  secret: '6686587d8f5faa2744ce',
  cluster: 'ap2',
  useTLS: true,
});

const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const mountPath = process.env.PARSE_MOUNT || '/parse';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}

app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});



// app.post("/pusher/auth", (req, res) => {
//   const socketId = req.body.socket_id;
//   const channel = req.body.channel_name;
//   const auth = pusher.authenticate(socketId, channel);
//   res.send(auth);
// });
//
app.post('/pusher/auth', function (req, res) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const sessionToken = req.headers.sessiontoken;

  if(sessionToken){
    const sessionQuery = new Parse.Query(Parse.Session);
    sessionQuery.equalTo('sessionToken',sessionToken);
    sessionQuery.include('user');
    sessionQuery.first({useMasterKey:true}).then((data) => {
      if(data){
        const presenceData = {
         user_id: data.get('user').id,
         user_info: {
           username: data.get('user').get('username'),
           email: data.get('user').get('email'),
         },
       };
        const auth = pusher.authenticate(socketId, channel,presenceData);
        res.send(auth);
      }else {
        res.status(403);
        res.send('Forbidden');
      }
    } );
  }else {
    res.status(403);
    res.send('Forbidden');
  }

  // console.log(req.headers);
  //
  // const user_id = channel.split('-')[1];
  // const User = new Parse.User();
  // const query = new Parse.Query(User);
  // query.get(user_id)
  //   .then(user=>{
  //     const sessionQuery = new Parse.Query(Parse.Session);
  //     sessionQuery.equalTo('user',user)
  //     sessionQuery.include('user')
  //     sessionQuery.first({useMasterKey:true}).then((data) => {
  //       if(data){
  //         const auth = pusher.authenticate(socketId, channel);
  //         res.send(auth);
  //       }else {
  //         res.status(403);
  //         res.send('Forbidden');
  //       }
  //     } );
  //   })
});


//
app.get('/test', async (req) => {

  const res = await pusher.get({ path: "/channels" });
  if (res.status === 200) {
    const body = await res.json();
    const channelsInfo = body.channels;
    console.log(channelsInfo);
  }

});

app.post("/client_event", function(req, res) {
  var timestamp = req.body.time_ms;
  var events = req.body.events;
  console.log(events);
  res.send(200);
});



const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
