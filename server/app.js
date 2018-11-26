var express       = require('express');
var bodyparser    = require('body-parser');


var {mongoose}    = require('./db/mongoose');
var {Todo}        = require('./models/todo');
var {User}        = require('./models/user');

var app           = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get('/' , (req , res)=>{
  res.send("Hello world");
});

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

})

module.exports = app;
