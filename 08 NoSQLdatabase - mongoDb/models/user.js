const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User{
  constructor(username, email, cart, id){
    this.username=username;
    this.email=email;
    this.cart=cart;
    this._id=id;
    //this._id=id ? mongodb.ObjectID(id) : null;
  }

  save(){ //save or update
    const db = getDb();
    if(this._id){   //update
      return db.collection('users').updateOne({_id: this._id}, {$set: this})
    }
    else{          //save
      return db.collection('users').insertOne(this)  //returning promise
      .then(result=>{
        //  console.log(result);
        return result;
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }

  addToCart(product){
    //console.log(this.cart);
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: {items: updatedCartItems} } }
      );
  }

  static findById(userId){
    const db=getDb();
    return db.collection('users').find({_id: mongodb.ObjectID(userId)})
    .next()
    .then(user=>{
      console.log(user);
      return user;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': mongodb.ObjectId(this._id) })
      .toArray();
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: mongodb.ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: mongodb.ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
