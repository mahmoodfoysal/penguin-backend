const express = require("express");
const router = express.Router();
const connectToDatabase = require("../db/connection");

router.get("/api/client/get-all-categories", async (req, res) => {
  let db;

  try {
    db = await connectToDatabase();

    // Aggregation pipeline
    const categories = await db.collection("parent-category").aggregate([
      {
        $lookup: {
          from: "sub-category",
          localField: "par_cat_id",
          foreignField: "par_cat_id",
          as: "sub_categories",
        },
      },
      {
        $unwind: { path: "$sub_categories", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "sub-sub-category",
          localField: "sub_categories.sub_cat_id",
          foreignField: "sub_cat_id",
          as: "sub_categories.sub_sub_categories",
        },
      },
      {
        $group: {
          _id: "$par_cat_id",
          par_cat_name: { $first: "$par_cat_name" },
          sub_categories: {
            $push: {
              sub_cat_id: "$sub_categories.sub_cat_id",
              sub_cat_name: "$sub_categories.sub_cat_name",
              sub_sub_categories: "$sub_categories.sub_sub_categories",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          par_cat_id: "$_id",
          par_cat_name: 1,
          sub_categories: {
            $filter: {
              input: "$sub_categories",
              as: "sub",
              cond: { $ne: ["$$sub.sub_cat_id", null] },
            },
          },
        },
      },
    ]).toArray();

    res.status(200).json({list_data: categories, message: "Successful"});
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
