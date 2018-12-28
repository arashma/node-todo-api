const {ObjectID}  = require('mongodb');
const {Todo}      = require('./../../models/todo');
const {User}      = require('./../../models/user');
const jwt       = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTowId = new ObjectID();
const users  = [{
  _id  : userOneId,
  email:'arashdeveloper@gmail.com',
  password:'userOnepass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
  _id  : userTowId,
  email:'arashdevelopermid@gmail.com',
  password:'userTowpass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTowId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTowId
}];


const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
};

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTow = new User(users[1]).save();

    return Promise.all([userOne , userTow])
  }).then(()=>done());
}

module.exports = {todos , populateTodos,populateUsers ,users};
