
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server`);
  }
  console.log('Connection is good');

  let db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectId('5a5cfb4c82e4109703259a35')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
    location: 'Japan'
  }, {
    $inc: { age: 2 },
    $set: { name: 'Chih-Hao Chen'}
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  client.close(); // db.close() has changed to client.close()
});
