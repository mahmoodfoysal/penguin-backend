const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const parentCategoryRoute = (parentCatCollection) => {
  // get api
  router.get("/api/admin/get-parent-category", async (req, res) => {
    const getParentCat = parentCatCollection.find();
    const result = await getParentCat.toArray();
    res.status(200).send({
      list_data: result,
      message: "Successful",
      status: 200,
    });
  });

  //   post api

  router.post("/api/admin/insert-update-parent-category", async (req, res) => {
    const { _id, par_cat_id, par_cat_name, status, user_info } = req.body;

    const data = {
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      par_cat_name: typeof par_cat_name === "string" ? par_cat_name : null,
      status: typeof status === "number" ? status : null,
      user_info: typeof user_info === "string" ? user_info : null,
    };
    if (
      !data.par_cat_id === null ||
      !data.par_cat_name ||
      !data.status === null ||
      !data.user_info
    ) {
      return res
        .status(400)
        .send({ error: "Invalid or missing required fields" });
    }
    try {
      if (_id) {
        const catId = new ObjectId(_id);
        data.modifiedAt = new Date();
        const result = await parentCatCollection.updateOne(
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
        const result = await parentCatCollection.insertOne(data);
        res
          .status(201)
          .send({ message: "Successful", id: result.insertedId, status: 200 });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update category" });
    }
  });

  // update category status
  router.patch(
    "/api/admin/update-parent-category-status/:id",
    async (req, res) => {
      try {
        const id = req.params.id; // You defined it as 'id' here
        const filter = { _id: new ObjectId(id) };
        const { status, user_info } = req.body;
        const updateDoc = {
          $set: { status, user_info, modifiedAt: new Date() },
        };

        const result = await parentCatCollection.updateOne(filter, updateDoc);

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
  // delete parent category
  router.delete(
    "/api/admin/delete-parent-category-list/:id",
    async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await parentCatCollection.deleteOne(filter);
      res.status(200).send({
        message: "Parent category deleted successful",
        deletedCount: result?.deletedCount,
        status: 200,
      });
    },
  );

  return router;
};

module.exports = parentCategoryRoute;
