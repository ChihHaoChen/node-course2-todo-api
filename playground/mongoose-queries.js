const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const id = '5a63f1f49a75641909d9beb1';

const userId = '5a5d6a62fd05a004563579b7';

// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid.')
// }
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

// User.findById(userId).then((user) => {
//   if (!user) {
//     return console.log('The user with this id is not found.')
//   }
//   console.log('User found by ID', JSON.stringify(user, undefined, 2));
// }).catch((e) => console.log(e));

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('The user with this id is not found.')
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.loog(e);
});
