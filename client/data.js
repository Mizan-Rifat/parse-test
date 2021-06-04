Parse.initialize('myAppId');

Parse.serverURL = 'http://localhost:1337/parse';

const TEAMS_JSON_URL =
  'https://gist.githubusercontent.com/jawache/0be7f073eb27762d97cac34972ea3468/raw/e8b4f92e7ca677da38700e43e506971d9d592a2a/premier_teams.json';
const PLAYERS_JSON_URL =
  'https://gist.githubusercontent.com/jawache/e281399ba5d63dc10bd170dd2b0f707f/raw/9821e89146b13dc42abcf8fb7e69939c55ee5886/premier_football_players.json';

const Team = Parse.Object.extend('Team');
const Players = Parse.Object.extend('Players');

function createTeams() {
  $.getJSON(PLAYERS_JSON_URL, function (data) {
    data.forEach(function (item, index) {
      console.log('Saving team ' + item.name);
      if (item.squadMarketValue) {
        item.squadMarketValue = parseFloat(item.squadMarketValue.slice(0, -1).replace(',', ''));
      }
      const team = new Players();
      team.save(item).then(res => {
        console.log(res);
      });
    });
  });
}

const user = new Parse.User();
const Post = Parse.Object.extend('Posts');
const Comment = Parse.Object.extend('Comments');

const insertUser = async () => {
  const userQuery = new Parse.Query(user);
  userQuery.equalTo('email', 'mizanrifat@mail.com');
  const user1 = await userQuery.first();

  const post = new Post();
  post.set('title', 'Post 6');
  post.set('content', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, vitae?');
  post.set('author', user1);

  post.save();
};
const insertComment = async () => {
  const postQuery = new Parse.Query(Post);
  postQuery.equalTo('title', 'Post 1');
  const post1 = await postQuery.first();

  post1.relation('comments');

  const commentsQuery = new Parse.Query(Comment);
  commentsQuery.equalTo('title', 'comments 1');
  const comments1 = await commentsQuery.first();

  const comment = new Comment();
  comment.set('comment', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, vitae?');
  comment.set('post', post1);

  comment.save();
};

// insertUser();
insertComment();
const getData = async () => {
  // const userQuery = new Parse.Query(user);
  // userQuery.equalTo('email', 'mizan@mail.com');
  // const user1 = await userQuery.first();

  const postQuery = new Parse.Query(Post);
  postQuery.equalTo('title', 'Post 1');
  postQuery.include('author');
  const post1 = await postQuery.first();

  console.log(post1.get('author').get('username'));
};

// getData();
