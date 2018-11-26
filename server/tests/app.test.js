const request = require('supertest');
const app = require('./../app');
const {Todo} = require('./../models/todo');

const todos  = [{
  text : "First todo text"
},{
  text:"second todo text"
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos', () => {
    test('It should create a new todo', (done) => {
      var text = "Test todo text";
        request(app)
        .post('/todos')
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
        .expect(200)
        .expect((res)=>{
          expect(res.body.todos.length).toBe(2);
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
