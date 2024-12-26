const express = require("express");
const router = express.Router();
const connectToDatabase = require("../db/connection");

router.get("/api/client/get-all-categories", async (req, res) => {
  let db;

  try {
    db = await connectToDatabase();

    // Aggregation pipeline
    const categories = await db.collection("parent-category").aggregate([      // Accesses the parent-category collection in the database.
      {
        $lookup: {                                                             // Joins the sub-category collection with parent-category.
          from: "sub-category",
          localField: "par_cat_id",                                            // Matches par_cat_id from parent-category with par_cat_id in sub-category.
          foreignField: "par_cat_id",
          as: "sub_categories",                                                // Adds a new field sub_categories, which contains matching documents from sub-category.
        },
      },
      {
        $unwind: { path: "$sub_categories", 
          preserveNullAndEmptyArrays: true }, // Deconstructs the sub_categories array into individual objects. If sub_categories is empty, preserveNullAndEmptyArrays: true keeps the parent document in the result.
      },
      {
        $lookup: {
          from: "sub-sub-category",                                            // Joins the sub-sub-category collection with the flattened sub_categories.
          localField: "sub_categories.sub_cat_id",                             // Matches sub_cat_id from sub_categories with sub_cat_id in sub-sub-category.
          foreignField: "sub_cat_id",
          as: "sub_categories.sub_sub_categories",                             // Adds a nested field sub_sub_categories inside sub_categories.
        },
      },
      {
        $group: {
          _id: "$par_cat_id",                                                  // Groups documents by par_cat_id.
          par_cat_name: { $first: "$par_cat_name" },                           // Uses $first to keep a single instance of par_cat_name for the group.
          sub_categories: {                                                    // Collects sub_categories as an array, containing each sub-category and its nested sub_sub_categories.
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
          _id: 0,                                                             // Excludes the _id field.
          par_cat_id: "$_id",                                                 // Renames _id to par_cat_id.
          par_cat_name: 1,                                                    // Includes par_cat_name and sub_categories.
          sub_categories: {                                         
            $filter: {                                                        // Filters out sub_categories where sub_cat_id is null.
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
