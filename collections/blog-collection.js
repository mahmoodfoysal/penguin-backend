const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const blogRoute = (blogCollection) => {
  // get api
  router.get("/api/penguin/get-blog-list", async (req, res) => {
    const getBlogList = blogCollection.find();
    const result = await getBlogList.toArray();
    res.send({
      list_data: result,
      message: "Successful",
    });
  });

  // get single blog
  router.get("/api/penguin/get-blog-list/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await blogCollection.findOne(query);

      if (!result) {
        return res.status(404).send({
          message: "Not found",
        });
      }

      res.status(200).send({
        details_data: result,
        message: "Successful",
      });
    } catch (error) {
      res.status(500).send({
        error: "Failed to fetch",
      });
    }
  });

  //   post api
  router.post("/api/penguin/insert-update-blog-list", async (req, res) => {
    const {
      _id,
      title,
      date,
      image,
      short_description,
      long_description,
      category,
      par_cat_id,
      sub_cat_id,
      sub_sub_cat_id,
      prod_id,
    } = req.body;

    const data = {
      title: typeof title === "string" ? title : null,
      date: typeof date === "string" ? date : null,
      image: typeof image === "string" ? image : null,
      short_description:
        typeof short_description === "string" ? short_description : null,
      long_description:
        typeof long_description === "string" ? long_description : null,
      category: typeof long_description === "string" ? long_description : null,

      par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
      sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
      sub_sub_cat_id:
        typeof sub_sub_cat_id === "number" ? sub_sub_cat_id : null,
      prod_id: typeof prod_id === "number" ? prod_id : null,
    };
    if (
      !data.title ||
      !data.date ||
      !data.image ||
      !data.short_description ||
      !data.long_description ||
      !data.category ||
      data.par_cat_id === null ||
      data.sub_cat_id === null ||
      data.sub_sub_cat_id === null ||
      data.prod_id === null
    ) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields" });
    }
    try {
      if (_id) {
        const blogId = new ObjectId(_id);
        data.modifiedAt = new Date();
        const result = await blogCollection.updateOne(
          {
            _id: blogId,
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
        const result = await blogCollection.insertOne(data);
        res
          .status(201)
          .send({ status: 201, message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update" });
    }
  });

  // delete api
  router.delete("/api/penguin/delete-blog-list/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await blogCollection.deleteOne(filter);
    res.status(200).send({
      message: "Successful",
      deletedCount: result?.deletedCount,
    });
  });

  return router;
};

module.exports = blogRoute;
