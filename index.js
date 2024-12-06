const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, Collection } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da6po2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
      // ***************************code write here*************************** 
    //   const database = client.db("karma-ecommerce");
    //   const cardCategoryCollection = database.collection("card-category");

     
  

  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Penguin server running...!')
})

app.listen(port, () => {
  console.log(`Penguin server running at port ${port}`)
})