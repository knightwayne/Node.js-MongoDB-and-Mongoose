const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
/*const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product{
  constructor(title, price, description, imageUrl, id, userId){
    this.title=title;
    this.price=price;
    this.description=description;
    this.imageUrl=imageUrl;
    this._id=id ? mongodb.ObjectID(id) : null;
    this.userId=userId;           //embedding userID reference
  }

  save(){ //save or update
    const db = getDb();
    if(this._id){   //update
      return db.collection('products').updateOne({_id: this._id}, {$set: this})
    }
    else{          //save
      return db.collection('products').insertOne(this)  //returning promise
      .then(result=>{
        //console.log(result);
        return result;
      })
      .catch(err=>{
        console.log(err);
      })
    }
    
  }

  static fetchAll(){
    const db=getDb();
    return db.collection('products').find().toArray()
    .then(products=>{
      //console.log(products);
      return products;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  static findById(prodId){
    const db=getDb();
    return db.collection('products').find({_id: mongodb.ObjectID(prodId)})
    .next()
    .then(product=>{
      //console.log(product);
      return product;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  static deleteById(prodId){
    const db=getDb();
    return db.collection('products').deleteOne({_id: mongodb.ObjectID(prodId)})
    .then(product=>{
      //console.log(product);
      return product;
    })
    .catch(err=>{
      console.log(err);
    })
  }
}

module.exports = Product;*/
