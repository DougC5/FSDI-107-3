console.log('hello from Node');

const http = require('http');
const express = require('express');
const app = express();

//Object constructor for teh mongo schema
let Item;

//Config Sections enable for CORS for testing
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 

// Config body parse to speak JSON

let bparse = require('body-parser');
app.use(bparse.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>This is about me</h1>');
});

app.get('/error', (req, res) => {

  res.status(502);
  res.send('<h1>ERROR</h1>');
});

// ********
// ******** API test for Mongo  ********
// ********
app.get('/API/test', function(req, res){
  let testItem = new Item({
    name: 'super',
    desc: 'just a test',
    price: 40,
    user: 'Doug'
  });

  //save the object as a document on the collection
  testItem.save( function(err, resultObj)  {
    if(err){
      console.log('error saving object');
      res.status(500);
      res.send('Error, could not save to the database');
    }
    res.send('object saved');
  });
});

// ********
// ******** API/points  ********
// ********

let items = [];
let count = 1;

app.get('/API/points', (req, res) => {
  //read database
  Item.find({}, (err, data) => {
    if(err){
      console.log('error getting data');
      console.log(err);
      res.status(500);
      res.json(error);
    }
    res.json(data);
  });
});

app.post('/API/points', (req, res) => {
  console.log('post recieved! ' + req.body);
  let itemFromClient = req.body;

  //create mongo Object
  let itemMongo = new Item(itemFromClient);

  itemMongo.save( function(err, itemSaved)  {
    if(err){
      console.log('error saving the item');
      res.status(500);
      res.json(err);
    }
    itemSaved.id = itemSaved._id;
    res.status(201);
    res.json(itemSaved);
    //res.send('object saved');
  });



});

// MONOG Config

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {

  userMongoClient:true

});

let db = mongoose.connection;

db.on('error', error => {
  console.log("Error: database not connected");
});

db.on('open', () => {
  console.log('Im Alive!! ');

// Create Scema
  var itemSchema = Schema({
    id: String,
    user: String,
    cart: Boolean,
    name: String,
    desc: String,
    price: Number,
    img: String,
    cat: String

  });

  Item = mongoose.model('Items107', itemSchema);
});

// -END- MONOG Config


const server = app.listen(8080, () => {
  console.log('Server started at local host 8080');
});
