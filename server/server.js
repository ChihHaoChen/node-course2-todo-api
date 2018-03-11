require('./config/config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  try {
    const doc = await todo.save();
    res.send(doc);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({
        _creator: req.user._id
      })
    res.send({todos});
  } catch(e) {
    res.status(400).send(e);
  }
});

// some useful comments to avoid the testing error
// Uncaught error outside test suite// Uncaught Error: listen EADDRINUSE :::3000
app.get('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  // 1st step : check if the id is valid or not by isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  }
  else {
    try {
      const todo = await Todo.findOne({
        _id: id,
        _creator: req.user._id
      })
      if (!todo) {
        res.status(404).send();
      } else {
        // res.status(200).send(JSON.stringify(todo, undefined, 2));
        res.status(200).send({todo});
      }
    } catch(e) {
      res.status(400).send();
    }
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  // get the id
  const id = req.params.id;
  // Validate the id -> if not valid, return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  } else {
    // remove todo by ID
    try {
      const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });
      if(!todo) {
        res.status(404).send();
      }
      else {
        res.status(200).send({todo});
      }
    } catch(e) {
      res.status(400).send();
    }
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
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

  try {
    const todo = await Todo.findOneAndUpdate({
      _id : id,
      _creator: req.user._id
    }, {$set: body}, {new: true});
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch(e) {
    res.status(400).send();
  }
});

// POST/users
app.post('/users', async (req, res) => {
  const user = new User(_.pick(req.body, ['email', 'password']));
  try {
    await user.save()
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  // get the value by req.header with the key 'x-auth'
  res.send(req.user);
});

// POST /users/login(email, body)
app.post('/users/login', async (req, res) => {
  try {
    const body = new User(_.pick(req.body, ['email', 'password']));
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send();
  }
});

// this route is used to delete the token when users log out
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

//if(!module.parent) {
  app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
  });
//}

module.exports = { app }; //since the module we want to export also called app
