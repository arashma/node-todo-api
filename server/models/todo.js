var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
  text:{
    type:String,
    required:true
  },
  completed:{
    type: Boolean,
    defult:true
  },
  completedAt:{
    type:Number,
    defult:null
  }
});


module.exports = {Todo};
