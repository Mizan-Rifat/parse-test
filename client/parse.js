Parse.initialize('myAppId');
Parse.serverURL = 'http://localhost:1337/parse';

// const Posts = Parse.Object.extend('Posts');

// const postQuery = new Parse.Query(Posts);

// postQuery.equalTo('title', 'Post 6');

// postQuery.include('owner');
// postQuery.first().then(res => {
//   console.log(res);
// });

// postQuery.first().then(post => {
//   const postOwner = post.relation('owner');
//   postOwner
//     .query()
//     .find()
//     .then(res => {
//       console.log(res);
//     });
// });

const user = new Parse.User();
const userQuery = new Parse.Query(user);
userQuery.equalTo('username', 'Rifat');
userQuery.first().then(user => {
  console.log(user);
  const Posts = Parse.Object.extend('Posts');

  const postQuery = new Parse.Query(Posts);
  postQuery.equalTo('owner', user);
  postQuery.find().then(res => {
    console.log(res);
  });
});
