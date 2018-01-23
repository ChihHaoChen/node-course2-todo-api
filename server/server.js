require('./config/config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

const app = express();

const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
  // get the id
  const id = req.params.id;
  // Validate the id -> if not valid, return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  } else {
    // remove todo by ID
    Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo) {
        res.status(404).send();
      }
      else {
        res.status(200).send({todo});
      }
    }, (err) => {
      // error, and send status(400) and empty body
      res.status(400).send();
    });
  }
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;

  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('The data with this ID is not available.');
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST/users
app.post('/users', (req, res) => {
  let user = new User(_.pick(req.body, ['email', 'password']));
  
  user.save().then(() => {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//if(!module.parent) {
  app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
  });
//}
module.exports = { app }; //since the module we want to export also called app
