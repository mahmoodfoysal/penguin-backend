const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const userRoute = (userCollection) => {
  router.get("/api/penguin/get-user-list/:email", async (req, res) => {
    try {
      const email = req.params.email;

      if (!email) {
        return res.status(400).send({
          status: 400,
          message: "Email parameter is required",
        });
      }

      const query = { email: email };
      const result = await userCollection.find(query).toArray();

      res.status(200).send({
        status: 200,
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).send({
        status: 500,
        error: " Data could not be fetched",
      });
    }
  });

  //   post api
  router.post("/api/penguin/insert-update-user-list", async (req, res) => {
    const { _id, full_name, email, address, phone_no, user_info } = req.body;

    const data = {
      full_name: typeof full_name === "string" ? full_name : null,
      email: typeof email === "string" ? email : null,
      address: typeof address === "string" ? address : null,
      user_info: typeof user_info === "string" ? user_info : null,
      phone_no: typeof phone_no === "number" ? phone_no : null,
    };
    if (!data.full_name || !data.email) {
      return res
        .status(404)
        .send({ error: "Invalid or missing required fields" });
    }
    try {
      if (_id) {
        const userId = new ObjectId(_id);
        data.modifiedAt = new Date();
        const result = await userCollection.updateOne(
          {
            _id: userId,
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
        const result = await userCollection.insertOne(data);
        res
          .status(201)
          .send({ status: 201, message: "Successful", id: result.insertedId });
      }
    } catch (error) {
      res.status(500).send({ error: "Failed to create or update" });
    }
  });

  return router;
};

module.exports = userRoute;
