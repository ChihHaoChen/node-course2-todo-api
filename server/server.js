const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get /todos/123kkkdfs

// app.listen(3000, () => {
//   console.log(`Start on port 3000.`);
// });

// some useful comments to avoid the testing error
// Uncaught error outside test suite// Uncaught Error: listen EADDRINUSE :::3000
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  // 1st step : check if the id is valid or not by isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  }
  else {
    Todo.findById(id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        // res.status(200).send(JSON.stringify(todo, undefined, 2));
        res.status(200).send({todo});
      }
    }, (err) => {
      res.status(400).send();
    });
  }
});


if(!module.parent) {
  app.listen(3000, () => {
    console.log(`Start on port 3000.`);
  });
}
module.exports = { app }; //since the module we want to export also called app
