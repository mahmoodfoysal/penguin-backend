const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const subSubCategoryRoute = (subSubCategoryCollection) => {
  // get api
  router.get("/api/admin/get-sub-sub-category", async (req, res) => {
    const getSubSubCategory = subSubCategoryCollection.find();
    const result = await getSubSubCategory.toArray();
    res.status(200).send({
      list_data: result,
      message: "Successful",
    });
  });

  // post api
  router.post("/api/admin/insert-update/sub-sub-categoty", async (req, res) => {
    const {
      _id,
      par_cat_id,
      sub_cat_id,
      sub_sub_cat_id,
      par_cat_name,
      sub_cat_name,
      sub_sub_cat_name,
      userInfo,
      status,
    } = req.body;
    const data = {
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
      sub_sub_cat_id:
        typeof sub_sub_cat_id === "number" ? sub_sub_cat_id : null,
      par_cat_name: typeof par_cat_name === "string" ? par_cat_name : null,
      sub_cat_name: typeof sub_cat_name === "string" ? sub_cat_name : null,
      sub_sub_cat_name:
        typeof sub_sub_cat_name === "string" ? sub_sub_cat_name : null,
      userInfo: typeof userInfo === "string" ? userInfo : null,
      status: typeof status === "number" ? status : null,
    };

    if (
      data.par_cat_id === null ||
      data.sub_cat_id === null ||
      data.sub_sub_cat_id === null ||
      !data.userInfo ||
      !data.par_cat_name ||
      !data.sub_cat_name ||
      !data.sub_sub_cat_name ||
      data.status === null
    ) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields" });
    }

    try {
      if (_id) {
        const catID = new ObjectId(_id);
        const result = await subSubCategoryCollection.updateOne(
          {
            _id: catID,
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
        const result = await subSubCategoryCollection.insertOne(data);
        res.status(201).send({ message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update category" });
    }
  });

//   status update 
  router.patch(
    "/api/admin/update-sub-sub-category-status/:id",
    async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { status } = req.body;
        const updateDoc = {
          $set: { status },
        };
        const result = await subSubCategoryCollection.updateOne(filter, updateDoc);
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

module.exports = subSubCategoryRoute;
