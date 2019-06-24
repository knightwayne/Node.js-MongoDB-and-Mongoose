const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback =>{       //connects to database and stores connection in _db variable
  
  MongoClient.connect(
    '<MONGO-DB cloud url or your localhost url, with username and password>', 
    { useNewUrlParser: true }
    )
  .then(client=>{
    console.log("Connected!");
    _db=client.db();
    callback();
  })
  .catch(err=>{
    console.log(err);
  })
};

const getDb = () =>{                      //returning access to database
  if(_db){
    return _db;
  }
  throw 'No connection found';
};

module.exports = {
  mongoConnect: mongoConnect,
  getDb: getDb
}
