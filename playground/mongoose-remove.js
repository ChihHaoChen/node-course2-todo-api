const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({})
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove
Todo.findOneAndRemove({ _id: '5a64dbf6a5d7980c0b12feb2' }).then((todo) => {
  console.log(todo);
});

//Todo.findByIdAndRemove
// Todo.findByIdAndRemove('5a64db2ba5d7980c0b12fe56').then((todo) => {
//   console.log(todo);
// });
