const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

function bannerRoutes(bannerCollection) {
  // get api

  router.get("/", async (req, res) => {
    try {
      const getBanner = bannerCollection.find();
      const result = await getBanner.toArray();

      res.status(200).send({
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      console.error("Error fetching banner data:", error);
      res.status(500).send({ error: "Failed to fetch banner data" });
    }
  });

  // POST API
  router.post("/", async (req, res) => {
    const { _id, prod_id, prod_img, title1, title2, title_details } = req.body;
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
        res.status(201).send({ message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update Banner" });
    }
  });

  return router;
}

module.exports = bannerRoutes;
