const express = require('express');
const cors= require('cors');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const {  ObjectId } = require('bson');
require('dotenv').config();

const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8efx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bookWorm").collection("products");
  const ordersCollection = client.db("bookWorm").collection("orders");
  app.get('/allProducts',(req,res)=>{
      productCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })

  app.get('/product/:id',(req,res)=>{
      const id= req.params.id;
      
      productCollection.find({_id: ObjectId(id) })
      .toArray((err,document)=>{
          res.send(document[0]);
      })
  })
  app.post('/addProduct',(req,res)=>{
      productCollection.insertOne(req.body)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })

  app.post('/placeOrder',(req,res)=>{
      ordersCollection.insertOne(req.body)
      .then(result=>
        res.send(result.insertedCount>0))
  })

  app.get('/allOrders',(req,res)=>{
    ordersCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
        res.send(documents);
    })
  })
});



app.listen(process.env.PORT || port,()=>{
    console.log("Server running at port "+ port);
})

