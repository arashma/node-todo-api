var express       = require('express');
var bodyparser    = require('body-parser');
const  _          = require('lodash');

var {mongoose}    = require('./db/mongoose');
var {Todo}        = require('./models/todo');
var {User}        = require('./models/user');
var {authenticate}= require('./middleware/authenticate');
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

//POST /users
app.post('/users',(req,res)=>{
  var body  = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(() =>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user.toJSON());
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

//POST /users/login {email,password}
app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCreditials(body.email , body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user);
      });
  }).catch((e)=>{
    res.status(400).send();
  })
});


app.get('/users/me',authenticate,(req,res)=>{
 res.send(req.user);
})
module.exports = app;
