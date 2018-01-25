
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const { todos,
        populateTodos,
        users,
        populateUsers
} = require('./seed/seed');

// beforeEach is used to initiate the test database.
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo no found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {

    request(app)
      .get('/todos/1234abcd')
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        //query database using findById toNotExist
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy(); // change toNotExist -> toBeNull, or toBeFalsy
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .get('/todos/1234abcd')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    // grab the id of the first item
    let hexId = todos[0]._id.toHexString();
    // update text, set completed true
    let text = 'Text to be updated for test';
    let completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed }) // Use ES6
    //200
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
        // expect(res.body.todo.text).toBe(text);
      })
      // text is changed, completed is true, completed is a number, toBeA
      .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
      // grab the id of second todo item
      let hexId = todos[1]._id.toHexString();
      // update the text, set completed to false
      let text = 'Change the state of completed from True to False';
      let completed = false;

      request(app)
        .patch(`/todos/${hexId}`)
        .send({ text, completed }) // Use ES6
      //200
        .expect(200)
      // text is changed, completed false, completedAt is null .toNotExist
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeFalsy();
        })
      // text is changed, completed is true, completed is a number, toBeA
        .end(done);
    });

});
