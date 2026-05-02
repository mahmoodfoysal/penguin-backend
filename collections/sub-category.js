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

  router.post("/api/admin/insert-update/sub-category", async (req, res) => {
    const {
      _id,
      par_cat_id,
      sub_cat_id,
      par_cat_name,
      sub_cat_name,
      user_info,
      status,
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
        data.modifiedAt = new Date();
        const result = await subCategoryCollection.updateOne(
          {
            _id: catId,
          },
          {
            $set: data,
          },
        );
        if (result.modifiedCount === 0) {
          return res.status(400).send({ message: "No data modified" });
        }
        res
          .status(201)
          .send({ message: "Update Successful", id: _id, status: 201 });
      } else {
        data.createdAt = new Date();
        const result = await subCategoryCollection.insertOne(data);
        res
          .status(200)
          .send({ message: "Successful", id: result.insertedId, status: 200 });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update" });
    }
  });

  router.patch(
    "/api/admin/update-sub-category-status/:id",
    async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { status, user_info } = req.body;
        const updateDoc = {
          $set: { status, user_info, modifiedAt: new Date() },
        };

        const result = await subCategoryCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Not found" });
        }

        res.status(200).send({
          status: 200,
          id: id,
          status_code: status,
          message:
            status === 1
              ? "Category active successful"
              : "Category inactive successful",
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "An error occurred while updating the status." });
      }
    },
  );

  // delete api
  router.delete("/api/admin/delete-sub-category-list/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await subCategoryCollection.deleteOne(filter);
    res.status(200).send({
      status: 200,
      message: "Deleted successful",
      deletedCount: result?.deletedCount,
    });
  });

  return router;
};

module.exports = subCategoryRoute;
