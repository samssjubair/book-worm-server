const express = require('express');
const cors= require('cors');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8efx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bookWorm").collection("products");
  app.get('/allProducts',(req,res)=>{
      productCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })
  app.post('/addProduct',(req,res)=>{
      productCollection.insertOne(req.body)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })
});



app.listen(port,()=>{
    console.log("Server running at port "+ port);
})

