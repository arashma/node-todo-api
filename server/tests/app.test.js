const request = require('supertest');
const app = require('./../app');
const {Todo} = require('./../models/todo');

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
        });
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
