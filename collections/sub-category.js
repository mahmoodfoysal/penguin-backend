const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const subCategoryRoute = (subCategoryCollection) => {
  // get api
  router.get("/api/admin/get-sub-category", async (req, res) => {
    const getSubCategory = subCategoryCollection.find();
    const result = await getSubCategory.toArray();
    res.send({
      list_data: result,
      message: "Successful",
    });
  });

  //   post api

  router.post("/api/admin/insert-update/sub-categoty", async (req, res) => {
    const {
      _id,
      par_cat_id,
      sub_cat_id,
      par_cat_name,
      sub_cat_name,
      user_info,
      status
    } = req.body;

    const data = {
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
      par_cat_name: typeof par_cat_name === "string" ? par_cat_name : null,
      sub_cat_name: typeof sub_cat_name === "string" ? sub_cat_name : null,
      user_info: typeof user_info === "string" ? user_info : null,
      status: typeof status === "number" ? status : null,
    };
    if (
      data.par_cat_id === null ||
      data.sub_cat_id === null ||
      !data.sub_cat_name ||
      !data.user_info ||
      !data.par_cat_name ||
      data.status === null
    ) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields" });
    }
    try {
      if (_id) {
        const catId = new ObjectId(_id);
        const result = await subCategoryCollection.updateOne(
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
        res.status(201).send({ message: "Update Successful", id: _id });
      } else {
        const result = await subCategoryCollection.insertOne(data);
        res.status(201).send({ message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update category" });
    }
  });

  router.patch(
    "/api/admin/update-sub-category-status/:id",
    async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { status } = req.body;
        const updateDoc = {
          $set: { status },
        };
        const result = await subCategoryCollection.updateOne(filter, updateDoc);
        res.status(201).send({
          message:
            status === 1
              ? "Category active successful"
              : "Category inactive successful",
        });
      } catch (error) {
        res
          .status(500)
          .send({ message: "An error occurred while updating the status." });
      }
    }
  );

  return router;
};

module.exports = subCategoryRoute;
