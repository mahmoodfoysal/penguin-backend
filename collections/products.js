const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const productsRoute = (productsCollection) => {
  // get api
  router.get("/api/penguin/get-product-list", async (req, res) => {
    try {
      const getProducts = productsCollection.find();
      const result = await getProducts.toArray();
      res.status(200).send({
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      res.status(500).send({ error: "Products data can not fetch" });
    }
  });

  // post api
  router.post("/api/admin/insert-update-product-list", async (req, res) => {
    const {
      _id,
      par_cat_id,
      sub_cat_id,
      sub_sub_cat_id,
      prod_id,
      prod_image,
      prod_name,
      price,
      prod_type,
      prod_type_name,
      rating,
      stock,
      prod_brand,
      description,
      currency_id,
      currency_name,
      user_info,
      status,
    } = req.body;

    const data = {
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
      sub_sub_cat_id:
        typeof sub_sub_cat_id === "number" ? sub_sub_cat_id : null,
      prod_id: typeof prod_id === "number" ? prod_id : null,
      prod_image: typeof prod_image === "string" ? prod_image : null,
      prod_name: typeof prod_name === "string" ? prod_name : null,
      price: typeof price === "number" ? price : null,
      prod_type: typeof prod_type === "string" ? prod_type : null,
      prod_type_name:
        typeof prod_type_name === "string" ? prod_type_name : null,
      stock: typeof stock === "number" ? stock : null,
      currency_id: typeof currency_id === "number" ? currency_id : null,
      rating: typeof rating === "number" ? rating : null,
      currency_name: typeof currency_name === "string" ? currency_name : null,
      description: typeof description === "string" ? description : null,
      prod_brand: typeof prod_brand === "string" ? prod_brand : null,
      user_info: typeof user_info === "string" ? user_info : null,
      status: typeof status === "number" ? status : null,
    };

    if (
      data.par_cat_id === null ||
      data.sub_cat_id === null ||
      data.prod_id === null ||
      data.price === null ||
      data.stock === null ||
      data.currency_id === null ||
      !data.prod_name ||
      !data.prod_image ||
      !data.prod_type_name ||
      !data.prod_type ||
      !data.currency_name ||
      !data.user_info ||
      data.status === null
    ) {
      return res
        .status(400) // Change to 400 for a Bad Request
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
          return res.status(404).send({ error: "No data modified" });
        }
        res.status(201).send({ message: "Update Successful", id: _id });
      } else {
        const result = await productsCollection.insertOne(data);
        res.status(201).send({ message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res
        .status(500)
        .send({ error: "Failed to create or update image category" });
    }
  });

  // delete api
  router.delete("/api/admin/delete-product-list/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.status(200).send({
      message: "Product delete successful",
      deletedCount: result?.deletedCount,
    });
  });

  // update product status
  router.patch("/api/admin/update-product-status/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const { status } = req.body;
    const updateDoc = {
      $set: { status },
    };
    const result = await productsCollection.updateOne(filter, updateDoc);
    res.status(200).send({
      message:
        status === 1
          ? "Product active successful"
          : "Product inactive successful",
    });
  });

  // get single products
  router.get("/api/penguin/get-product-list/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.status(200).send({
        details_data: result,
        message: "Successful",
      });
    } catch (error) {
      res
        .status(500)
        .send({ error: "Faild to fatch product information" });
    }
  });

  return router;
};

module.exports = productsRoute;
