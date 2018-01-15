
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server`);
  }

  console.log(`Connected to MongoDB server`);
  let db = client.db('TodoApp'); // inside the argument is 'TodoApp' string

  db.collection('Todos').find({
    _id: new ObjectId('5a5cefdb82e410970325968b')
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log(`Unable to fetch todos due to ${err}`);
  });

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log(`Unable to fetch todos due to ${err}`);
  });

  db.collection('Users').find().count().then((countUser) => {
    console.log(`Total number of users is : ${countUser}`);
  }, (err) => {
    console.log(`Unable to count Users due to ${err}`);
  });

  db.collection('Users').find({ location: 'Montreal' }).toArray().then((users) => {
    console.log(JSON.stringify(users, undefined, 2));
  }, (err) => {
    console.log(`Unable to fetch User data`);
  });


  client.close(); // db.close() has changed to client.close()
});
