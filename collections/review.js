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

  // get review by id
  router.get("/api/penguin/get-review-list/:prod_id", async (req, res) => {
    try {
      let prod_id = req.params.prod_id;
      prod_id = Number(prod_id);
      if (isNaN(prod_id)) {
        return res.status(400).send({
          message: "Invalid prod_id",
        });
      }
      const query = { prod_id: prod_id };
      const result = await reviewCollection.find(query).toArray();
      res.send({
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching reviews",
        error: error.message,
      });
    }
  });

  //   post api

  router.post("/api/penguin/insert-update-review-list", async (req, res) => {
    const {
      _id,
      full_name,
      email,
      comment,
      image_url,
      rating,
      prod_id,
      par_cat_id,
      sub_cat_id,
    } = req.body;

    const data = {
      full_name: typeof full_name === "string" ? full_name : null,
      email: typeof email === "string" ? email : null,
      comment: typeof comment === "string" ? comment : null,
      image_url: typeof image_url === "string" ? image_url : null,
      rating: typeof par_cat_id === "number" ? rating : null,
      prod_id: typeof par_cat_id === "number" ? prod_id : null,
      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
    };
    if (
      !data.full_name ||
      !data.email ||
      !data.comment ||
      data.rating === null ||
      data.prod_id === null ||
      data.par_cat_id === null ||
      data.sub_cat_id === null
    ) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields", status: 404 });
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
          return res
            .status(400)
            .send({ message: "No data modified", status: 400 });
        }
        res
          .status(201)
          .send({ message: "Update Successful", id: _id, status: 201 });
      } else {
        data.createdAt = new Date();
        const result = await reviewCollection.insertOne(data);
        res
          .status(201)
          .send({ status: 201, message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update" });
    }
  });

  // delete api
  router.delete("/api/penguin/delete-review-list/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await reviewCollection.deleteOne(filter);
    res.status(200).send({
      status: 200,
      message: "Successful",
      deletedCount: result?.deletedCount,
    });
  });

  return router;
};

module.exports = reviewRoute;
