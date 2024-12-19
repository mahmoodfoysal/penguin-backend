const express = require("express");
const app = express();
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  Collection,
} = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da6po2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // ***************************code write here***************************
    const database = client.db("karma-ecommerce");
    const bannerCollection = database.collection("banner");
    const imgageCategoryCollection = database.collection("image-category");

    const { ObjectId } = require("mongodb"); // Ensure ObjectId is imported

    app.post("/banner", async (req, res) => {
      const { _id, prod_id, prod_img, title1, title2, title_details } = req.body;
      const data = {
        prod_id: typeof prod_id === "number" ? prod_id : null,
        prod_img: typeof prod_img === "string" && prod_img.trim() ? prod_img : null,
        title1: typeof title1 === "string" && title1.trim() ? title1 : null,
        title2: typeof title2 === "string" && title2.trim() ? title2 : null,
        title_details:
          typeof title_details === "string" && title_details.trim()
            ? title_details
            : null,
      };
      if (
        data.prod_id === null ||
        data.prod_img === null ||
        data.title1 === null ||
        data.title2 === null ||
        data.title_details === null
      ) {
        return res.status(400).send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const updateDocId = new ObjectId(_id);
    
          const result = await bannerCollection.updateOne(
            { _id: updateDocId },
            { $set: data }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: "Banner not found" });
          }
          res.send(result);
        } else {
          const result = await bannerCollection.insertOne(data);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to create or update Banner" });
      }
    });

    app.post('/image-category', async(req, res) => {
      const {_id, cat_id, cat_img, cat_name} = req.body;

      const data = {
        cat_id: typeof cat_id === 'number' ? cat_id : null,
        cat_img: typeof cat_img === 'string' ? cat_img : null,
        cat_name: typeof cat_name === 'string' ? cat_name : null
      };

      if(data.cat_id === null || data.cat_img === null || data.cat_name === null) {
        return res.status(400).send({error: "Invalid or missing required fields"});
      }
      try {
        if(_id) {
          const updateDocId = new ObjectId(_id)
          const result = await imgageCategoryCollection.updateOne(
          {
            _id: updateDocId
          },
          {
            $set: data
          }
        );
        if(result.matchedCount === 0) {
          return res.status(404).send({error: "Category not found"});
        }
        res.send(result)
        }
        else {
          const result = await imgageCategoryCollection.insertOne(data);
          res.status(201).send(result);
        }
      }
      catch(error) {
        res.status(500).send({ error: "Failed to create or update image category" });
      }
    })
    

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Penguin server running...!");
});

app.listen(port, () => {
  console.log(`Penguin server running at port ${port}`);
});
