const express = require("express");
const app = express();
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  Collection,
} = require("mongodb");
require("dotenv").config();
const bannerRoutes = require('./banner.js');
const imageCategoryRoute = require('./image-category.js');
const productsRoute = require("./products.js");
const adminRoute = require("./admin-controller.js");
const parentCategoryRoute = require("./parent-category.js");
const dashboardMenuRoute = require("./dashboard-menu.js");
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

    // ############################################ all database collection write here ########################################### 
    const database = client.db("penguin-ecommerce");
    const bannerCollection = database.collection("banner");
    const imgageCategoryCollection = database.collection("image-category");
    const productsCollection = database.collection("products");
    const adminCollection = database.collection("admin");
    const menuCollection = database.collection("dashboard-menu");
    const parentCatCollection = database.collection("parent-category");

    // ############################################ all database collection write here ########################################### 

    // ############################################ all collection route write here ########################################### 
    // banner
    app.use("/banner", bannerRoutes(bannerCollection));

    // image category 
    app.use('/image-category', imageCategoryRoute(imgageCategoryCollection));

    // products 
    app.use("/products", productsRoute(productsCollection));

    // admin controller 
    app.use('/admin', adminRoute(adminCollection));
    
    // parent category 
    app.use("/parent-category", parentCategoryRoute(parentCatCollection));

    // dashboard menu 
    app.use("/dashboard-menu", dashboardMenuRoute(menuCollection));

    // ############################################ all collection route write here ########################################### 


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
