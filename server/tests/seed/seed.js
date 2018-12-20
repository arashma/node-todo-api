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
    token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
  }]
},{
  _id  : userTowId,
  email:'arashdevelopermid@gmail.com',
  password:'userTowpass',
}];

const todos  = [{
  _id  : new ObjectID(),
  text : "First todo text"
},{
  _id  : new ObjectID(),
  text:"second todo text"
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
