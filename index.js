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
    const database = client.db("penguin-ecommerce");
    const bannerCollection = database.collection("banner");
    const imgageCategoryCollection = database.collection("image-category");
    const productsCollection = database.collection("products");
    const adminCollection = database.collection("admin");
    const menuCollection = database.collection("dashboard-menu");
    const parentCatCollection = database.collection("parent-category");

    const { ObjectId } = require("mongodb");

    // ##################################### All post api write here ##########################################

    // banner post
    app.post("/banner", async (req, res) => {
      const { _id, prod_id, prod_img, title1, title2, title_details } =
        req.body;
      const data = {
        prod_id: typeof prod_id === "number" ? prod_id : null,
        prod_img:
          typeof prod_img === "string" && prod_img.trim() ? prod_img : null,
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
        return res
          .status(400)
          .send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const updateDocId = new ObjectId(_id);

          const result = await bannerCollection.updateOne(
            { _id: updateDocId },
            { $set: data }
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({ error: "No data modified" });
          }
          res
            .status(201)
            .send({ message: "Update Successful", id: result.modifiedCount });
        } else {
          const result = await bannerCollection.insertOne(data);
          res
            .status(201)
            .send({ message: "Successful", id: result.insertedId });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to create or update Banner" });
      }
    });

    // category image post
    app.post("/image-category", async (req, res) => {
      const { _id, cat_id, cat_img, cat_name } = req.body;

      const data = {
        cat_id: typeof cat_id === "number" ? cat_id : null,
        cat_img: typeof cat_img === "string" ? cat_img : null,
        cat_name: typeof cat_name === "string" ? cat_name : null,
      };

      if (
        data.cat_id === null ||
        data.cat_img === null ||
        data.cat_name === null
      ) {
        return res
          .status(400)
          .send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const updateDocId = new ObjectId(_id);
          const result = await imgageCategoryCollection.updateOne(
            {
              _id: updateDocId,
            },
            {
              $set: data,
            }
          );
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: "No data modified" });
          }
          res
            .status(201)
            .send({ message: "Update Successful", id: result.modifiedCount });
        } else {
          const result = await imgageCategoryCollection.insertOne(data);
          res
            .status(201)
            .send({ message: "Successful", id: result.insertedId });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "Failed to create or update image category" });
      }
    });

    // products post
    app.post("/products", async (req, res) => {
      const {
        _id,
        parent_cat_id,
        sub_cat_id,
        sub_sub_cat_id,
        sub_sub_sub_cat_id,
        prod_id,
        prod_image,
        prod_name,
        price,
        prod_type,
        rating,
        stock,
        prod_brand,
        description,
        currency_id,
        currency_name,
        status,
      } = req.body;

      const data = {
        parent_cat_id: typeof parent_cat_id === "number" ? parent_cat_id : null,
        sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
        sub_sub_cat_id:
          typeof sub_sub_cat_id === "number" ? sub_sub_cat_id : null,
        sub_sub_sub_cat_id:
          typeof sub_sub_sub_cat_id === "number" ? sub_sub_sub_cat_id : null,
        prod_id: typeof prod_id === "number" ? prod_id : null,
        prod_image: typeof prod_image === "string" ? prod_image : null,
        prod_name: typeof prod_name === "string" ? prod_name : null,
        price: typeof price === "number" ? price : null,
        prod_type: typeof prod_type === "string" ? prod_type : null,
        stock: typeof stock === "number" ? stock : null,
        currency_id: typeof currency_id === "number" ? currency_id : null,
        rating: typeof rating === "number" ? rating : null,
        currency_name: typeof currency_name === "string" ? currency_name : null,
        description: typeof description === "string" ? description : null,
        prod_brand: typeof prod_brand === "string" ? prod_brand : null,
        status: typeof status === "number" ? status : null,
      };

      if (
        parent_cat_id === null ||
        prod_id === null ||
        prod_image === null ||
        prod_name === null ||
        price === null ||
        prod_type === null ||
        stock === null ||
        currency_id === null ||
        currency_name === null ||
        status === null
      ) {
        return res
          .status(404)
          .send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const updateDocId = new ObjectId(_id);
          const result = await productsCollection.updateOne(
            {
              _id: updateDocId,
            },
            {
              $set: data,
            }
          );
          if (result.modifiedCount === 0) {
            return res.status(400).send({ error: "No data modified" });
          }
          res
            .status(201)
            .send({ message: "Update Successful", id: result.modifiedCount });
        } else {
          const result = await productsCollection.insertOne(data);
          res
            .status(201)
            .send({ message: "Successful", id: result.insertedId });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "Failed to create or update image category" });
      }
    });

    app.post("/admin", async (req, res) => {
      const { _id, email, role, role_id } = req.body;

      const data = {
        email: typeof email === "string" ? email : null,
        role: typeof role === "string" ? role : null,
        role_id: typeof role_id === "number" ? role_id : null,
      };
      if (!email || !role || !role_id) {
        return res
          .status(404)
          .send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const adminId = new ObjectId(_id);
          const result = await adminCollection.updateOne(
            {
              _id: adminId,
            },
            {
              $set: data,
            }
          );
          if (result.modifiedCount === 0) {
            return res.status(400).send({ message: "No data modified" });
          }
          res
            .status(201)
            .send({ message: "Update Successful", id: _id });
        } else {
          const result = await adminCollection.insertOne(data);
          res
            .status(201)
            .send({ message: "Successful", id: result.insertedId });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to create or update admin" });
      }
    });

    // post parent category 

    app.post("/parent-category", async (req, res) => {
      const { _id, par_cat_id, par_cat_name } = req.body;

      const data = {
        par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
        par_cat_name: typeof par_cat_name === "string" ? par_cat_name : null
      };
      if (data.par_cat_id === null || !data.par_cat_name ) {
        return res
          .status(404)
          .send({ error: "Invalid or missing required fields" });
      }
      try {
        if (_id) {
          const catId = new ObjectId(_id);
          const result = await parentCatCollection.updateOne(
            {
              _id: catId,
            },
            {
              $set: data,
            }
          );
          if (result.modifiedCount === 0) {
            return res.status(400).send({ message: "No data modified" });
          }
          res
            .status(201)
            .send({ message: "Update Successful", id: _id });
        } else {
          const result = await parentCatCollection.insertOne(data);
          res
            .status(201)
            .send({ message: "Successful", id: result.insertedId });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to create or update admin" });
      }
    });

    // #################################### all get api code write here #########################################

    // get  banner data
    app.get("/banner", async (req, res) => {
      try {
        const getBanner = bannerCollection.find();
        const result = await getBanner.toArray();
        res.send({
          list_data: result,
          message: "Successful",
        });
      } catch (error) {
        res.status(404).send({ error: "Banner data can not fetch" });
      }
    });

    app.get("/image-category", async (req, res) => {
      try {
        const getImageCategory = imgageCategoryCollection.find();
        const result = await getImageCategory.toArray();
        res.send({
          list_data: result,
          message: "Successful",
        });
      } catch (error) {
        res.status(404).send({ error: "Image category data can not fetch" });
      }
    });

    app.get("/products", async (req, res) => {
      try {
        const getProducts = productsCollection.find();
        const result = await getProducts.toArray();
        res.send({
          list_data: result,
          message: "Successful",
        });
      } catch (error) {
        res.status(404).send({ error: "Products data can not fetch" });
      }
    });

    app.get('/dashboard-menu', async(req, res) => {
      try {
        const getDashboardMenu = menuCollection.find();
        const result = await getDashboardMenu.toArray();
        res.send({
          list_data: result,
          message: "Successful"
        })
      }
      catch (error) {
        res.status(404).send({error: 'Menu can not found'});
      }
    });

    // get admin
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await adminCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "Admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin, message: "Successful" });
    });

    // get admin 
    app.get('/admin', async(req, res) => {
      const getAdmin = adminCollection.find();
      const result = await getAdmin.toArray();
      res.send({
        list_data: result,
        message: 'Successful'
      });
    })

    // parent category 
    app.get('/parent-category', async(req, res) => {
      const getParentCat = parentCatCollection.find();
      const result = await getParentCat.toArray();
      res.send({
        list_data: result,
        message: 'Successful'
      });
    });
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
