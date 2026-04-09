const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const reviewRoute = (reviewCollection) => {
  // get api
  router.get("/api/penguin/get-review-list", async (req, res) => {
    const getReviewList = reviewCollection.find();
    const result = await getReviewList.toArray();
    res.send({
      list_data: result,
      message: "Successful",
    });
  });

  //   post api

  router.post("/api/penguin/insert-update/review", async (req, res) => {
    const {
      _id,
      fullName,
      email,
      comment,
      rating,
      prod_id,
      par_cat_id,
      sub_cat_id,
    } = req.body;

    const data = {
      fullName: typeof par_cat_name === "string" ? fullName : null,
      email: typeof sub_cat_name === "string" ? email : null,
      comment: typeof sub_cat_name === "string" ? comment : null,
      rating: typeof par_cat_id === "number" ? rating : null,
      prod_id: typeof par_cat_id === "number" ? prod_id : null,
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
    };
    if (
      !data.fullName ||
      !data.email ||
      !data.comment ||
      data.rating === null ||
      data.prod_id === null ||
      data.par_cat_id === null ||
      data.sub_cat_id === null
    ) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields" });
    }
    try {
      if (_id) {
        const reviewId = new ObjectId(_id);
        data.modifiedAt = new Date();
        const result = await reviewCollection.updateOne(
          {
            _id: reviewId,
          },
          {
            $set: data,
          },
        );
        if (result.modifiedCount === 0) {
          return res.status(400).send({ message: "No data modified" });
        }
        res.status(201).send({ message: "Update Successful", id: _id });
      } else {
        data.createdAt = new Date();
        const result = await reviewCollection.insertOne(data);
        res.status(201).send({ message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update category" });
    }
  });

  // delete api
  router.delete("/api/penguin/delete-review-list/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await reviewCollection.deleteOne(filter);
    res.status(200).send({
      message: "Successful",
      deletedCount: result?.deletedCount,
    });
  });

  return router;
};

module.exports = reviewRoute;
