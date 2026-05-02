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
      res.status(500).send({ error: "Data can not fetch" });
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
      stock,
      prod_brand,
      description,
      currency_id,
      currency_name,
      user_info,
      discount,
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
      currency_name: typeof currency_name === "string" ? currency_name : null,
      description: typeof description === "string" ? description : null,
      prod_brand: typeof prod_brand === "string" ? prod_brand : null,
      user_info: typeof user_info === "string" ? user_info : null,
      status: typeof status === "number" ? status : null,
      discount: typeof discount === "number" ? discount : null,
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
        .status(400)
        .send({ error: "Invalid or missing required fields" });
    }

    try {
      if (_id) {
        const updateDocId = new ObjectId(_id);
        data.modifiedAt = new Date();
        const result = await productsCollection.updateOne(
          {
            _id: updateDocId,
          },
          {
            $set: data,
          },
        );
        if (result.modifiedCount === 0) {
          return res.status(404).send({ error: "No data modified" });
        }
        res
          .status(201)
          .send({ message: "Update Successful", id: _id, status: 201 });
      } else {
        data.createdAt = new Date();
        const result = await productsCollection.insertOne(data);
        res
          .status(200)
          .send({ message: "Successful", id: result.insertedId, status: 200 });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update" });
    }
  });

  // delete api
  router.delete("/api/admin/delete-product-list/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.status(200).send({
      status: 200,
      message: "Product delete successful",
      deletedCount: result?.deletedCount,
    });
  });

  // update product status

  router.patch("/api/admin/update-product-status/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const { status, user_info } = req.body;
      const updateDoc = {
        $set: { status, user_info, modifiedAt: new Date() },
      };

      const result = await productsCollection.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Not found" });
      }

      res.status(200).send({
        status: 200,
        id: id,
        status_code: status,
        message: status === 1 ? "Active successful" : "Inactive successful",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the status." });
    }
  });

  // get single products
  router.get("/api/penguin/get-product-list/:id/:prod_id", async (req, res) => {
    try {
      const { id, prod_id } = req.params;

      const query = {
        _id: new ObjectId(id),
        prod_id: Number(prod_id), // match both
      };

      const result = await productsCollection.findOne(query);

      if (!result) {
        return res.status(404).send({
          message: "Product not found",
        });
      }

      res.status(200).send({
        details_data: result,
        message: "Successful",
      });
    } catch (error) {
      res.status(500).send({
        error: "Failed to fetch",
      });
    }
  });

  // stock update
  router.patch("/api/penguin/get-product-list/stock/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateStock = req.body;
      const updatedDoc = {
        $set: {
          stock: updateStock.stock,
          modifiedAt: new Date(),
        },
      };
      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send({
        stock: result?.stock,
        message: "Updated",
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).send({ error: "Failed to update" });
    }
  });

  return router;
};

module.exports = productsRoute;
