const {MongoClient,ObjectID}    = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err , client)=>{
  if(err){
   return  console.log("Unable to connect mogodb");
  }
  console.log("Connecting to database");
  const db = client.db('TodoApp');

  db.collection('Todos').find().toArray().then((docs)=>{
    console.log("Todos");
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
  console.log("Unable to fetch data",err);
  });
client.close();
})
