
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

let obj = new ObjectId();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server`);
  }

  console.log(`Connected to MongoDB server`);
  // let db = client.db('TodoApp'); // inside the argument is 'TodoApp' string
  //
  // // db.collection('Todos').insertOne({
  // //   text: 'Something to do',
  // //   completed: false
  // // }, (err, result) => {
  // //   if (err) {
  // //     return console.log('Unable to insert todo', err);
  // //   }
  // //   console.log(JSON.stringify(result.ops, undefined, 2));
  // // });
  //
  //Insert new doc into User {name, age, location}
  db.collection('Users').insertOne({
    name: 'Chih-Hao Chen',
    age: 37,
    location: 'Montreal'
    }, (err, result) => {
      if (err)  {
        return console.log(`Unable to insert a new user due to ${err}`);
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
    });

  client.close(); // db.close() has changed to client.close()
});
