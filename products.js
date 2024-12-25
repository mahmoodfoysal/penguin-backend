const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const productsRoute = (productsCollection) => {
    // get api 
    router.get("/", async(req, res) => {
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

    // post api 
    router.post("/", async (req, res) => {
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
      
      return router
};

module.exports = productsRoute;