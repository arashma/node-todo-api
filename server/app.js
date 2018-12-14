var express       = require('express');
var bodyparser    = require('body-parser');
const  _          = require('lodash');

var {mongoose}    = require('./db/mongoose');
var {Todo}        = require('./models/todo');
var {User}        = require('./models/user');
var {ObjectID}    = require('mongodb');
var app           = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get('/' , (req , res)=>{
  res.send("Hello world");
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  })
},(e)=>{
  res.status(400).send(e);
})
app.post('/todos',(req,res)=>{
  console.log(JSON.stringify(req.body,undefined,2));

  var todo = new Todo({
    text:req.body.text
  });

  todo.save().then((doc)=>{
     res.send(doc);
  },(e)=>{
      res.status(400).send(e);
  })
});


app.get('/todos/:id',(req,res)=>{

   var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
     return res.status(404).send();
    }
   res.send({todo});

  }).catch((e)=>{
    res.status(404).send();
  });

});


app.post('/users',(req,res)=>{
  var body  = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then((user) =>{
    res.send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
})

module.exports = app;
