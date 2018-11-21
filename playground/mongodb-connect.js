const {MongoClient,ObjectID}    = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err , client)=>{
  if(err){
   return  console.log("Unable to connect mogodb");
  }
  console.log("Connecting to database");
  const db = client.db('TodoApp');

  db.collection('Todos').insertOne({
    text:"someting to do",
    completed:false
  },(err,result)=>{
    if(err){
      return console.log("Unable insert todo");
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  })
client.close();
})
