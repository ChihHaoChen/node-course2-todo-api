
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server`);
  }

  console.log(`Connected to MongoDB server`);
  let db = client.db('TodoApp'); // inside the argument is 'TodoApp' string

  // deleteMany
  // db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Something to do' }).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //   console.log(result);
  // });

  //********************************************************
  // deleteMany on Users
  db.collection('Users').deleteMany({ name: 'Oscar' }).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({ name: 'CH' }).then((result) => {
    console.log(result);
  });

  client.close(); // db.close() has changed to client.close()
});
