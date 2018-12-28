const request     = require('supertest');
const app         = require('./../app');
const {Todo}      = require('./../models/todo');
const {ObjectID}  = require('mongodb');
const {todos , populateTodos,users,populateUsers} = require('./seed/seed');
const {User}      = require('./../models/user');
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    test('It should create a new todo', (done) => {
      var text = "Test todo text";
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body.text).toBe(text);
            done();
        })
        .then((response) => {
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
        })
    });

    test('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          Todo.find().then((todos)=>{
            expect(todos.length).toBe(2);
              done();
          }).catch((e)=> done(e));

        });

    });

});


describe('GET /todos', () => {
    test('It should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });


});



describe('GET /', () => {
    test('It should create a new GET /', (done) => {
        request(app)
        .get('/')
        .then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('GET /todos/:id', () => {
    test('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    test('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    test('should return 404 if todo not found',(done)=>{
      var hexId = new ObjectID().toHexString();
      request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
    });

    test('should return 404 for no-object ids',(done)=>{
      request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
    });
});


describe('DELETE /todos/:id', () => {

    test('should remove a todo doc', (done) => {
      var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo)=>{
            expect(todo).toBeNull();
              done();
          }).catch((e)=> done(e));

        });
    });

    test('should not remove a todo doc', (done) => {
      var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo)=>{
            expect(todo).not.toBeNull();
              done();
          }).catch((e)=> done(e));

        });
    });

    test('should return 404 if todo not found',(done)=>{
      var hexId = new ObjectID().toHexString();
      request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
    });

    test('should return 404 for no-object ids',(done)=>{
      request(app)
      .get('/todos/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
    });
});


describe('PATCH /todos/:id' , ()=>{
  test('should update the todo ' , (done)=>{
    var hexId = todos[0]._id.toHexString();
   var text = 'This should be the new text';

   request(app)
     .patch(`/todos/${hexId}`)
     .set('x-auth', users[0].tokens[0].token)
     .send({
       completed: true,
       text
     })
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(text);
       expect(res.body.todo.completed).toBe(true);
       expect(res.body.todo.completedAt).toEqual(expect.any(Number));
     })
     .end(done);
  })

  test('should not update the todo created by other user ' , (done)=>{
    var hexId = todos[0]._id.toHexString();
    var text  = "This shold be the new text";

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed:true,
      text
    })
    .expect(404)
    .end(done);
  })

  test('should clear completedAt when todo is not completed ' , (done)=>{
    var hexId = todos[1]._id.toHexString();
    var text  = "This shold be the new text";

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed:false,
      text
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  })


})


describe('GET /users/me', () => {
    test('should return user if authenticated', (done) => {
      request(app)
      .get(`/users/me`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });

    test('should return 401 if not authenticated', (done) => {
        request(app)
        .get(`/users/me`)
        .expect(401)
        .expect((res)=>{
          expect(res.body).toEqual({});
        })
        .end(done);
    });
});



describe('POST /users', () => {
    test('should create a user', (done) => {
      var email = "arashdevelopppp@gmail.com";
      var password = "123arash!";
      request(app)
      .post(`/users`)
      .send({email,password})
      .expect(200)
      .expect((res)=>{
          expect(res.headers['x-auth']).not.toBeNull();
          expect(res.body._id).not.toBeNull();
          expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).not.toBeNull();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e)=>done(e));
      });
    });

    test('should return validation errors if request invalid', (done) => {
      request(app)
      .post('/users')
      .send({
        email:'and',
        password:'123'
      })
      .expect(400)
      .end(done)
    });

    test('should not create a user if email in use', (done) => {
      request(app)
      .post('/users')
      .send({
        email:users[0].email,
        password:'Password123'
      })
      .expect(400)
      .end(done)
    });
});


describe('POST /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
        expect(res.headers['x-auth']).not.toBeNull();
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.toObject().tokens[1]).toMatchObject({
          access:'auth',
          token:res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e));
    });
  });

  it('should reject invalid login',(done)=>{

    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password + '1'
    })
    .expect(400)
    .expect((res)=>{
        expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e)=>done(e));
    });
  });
})



describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout',(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e));
    });
  });

})
