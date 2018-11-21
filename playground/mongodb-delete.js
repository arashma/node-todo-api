const {MongoClient,ObjectID}    = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err , client)=>{
  if(err){
   return  console.log("Unable to connect mogodb");
  }
  console.log("Connecting to database");
  const db = client.db('TodoApp');

//delete Many
  db.collection('Todos').deleteMany({text:"flan flan"}).then((result)=>{
   console.log(result);
  },(err)=>{
    console.log("unable to deleted data",err);
  });

  //delete One
    db.collection('Todos').deleteOne({text:"flan flan"}).then((result)=>{
     console.log(result);
    },(err)=>{
      console.log("unable to deleted data",err);
    });

client.close();
})
