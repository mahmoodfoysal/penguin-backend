const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const adminRoute = (adminCollection) => {

    // get admin check
    router.get("/admin/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await adminCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === "Admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin, message: "Successful" });
      });

      // get admin list 
      router.get('/api/admin/get-admin-list', async(req, res) => {
        const getAdmin = adminCollection.find();
        const result = await getAdmin.toArray();
        res.send({
          list_data: result,
          message: 'Successful'
        });
      })


    // post api 
    router.post("/api/admin/insert-update-admin", async (req, res) => {
        const { _id, email, role, role_id, user_info } = req.body;
  
        const data = {
          email: typeof email === "string" ? email : null,
          role: typeof role === "string" ? role : null,
          role_id: typeof role_id === "number" ? role_id : null,
          user_info: typeof user_info === "string" ? user_info : null,
        };
        if (!email || !role || !role_id || !user_info) {
          return res
            .status(404)
            .send({ error: "Invalid or missing required fields" });
        }
        try {
          if (_id) {
            const adminId = new ObjectId(_id);
            const result = await adminCollection.updateOne(
              {
                _id: adminId,
              },
              {
                $set: data,
              }
            );
            if (result.modifiedCount === 0) {
              return res.status(400).send({ message: "No data modified" });
            }
            res
              .status(201)
              .send({ message: "Update Successful", id: _id });
          } else {
            const result = await adminCollection.insertOne(data);
            res
              .status(201)
              .send({ message: "Successful", id: result.insertedId });
          }
        } catch (error) {
          res.status(500).send({ error: "Failed to create or update admin" });
        }
      });

      // delete admin list
      router.delete('/api/admin/delete-admin-list/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await adminCollection.deleteOne(filter);
        res.status(201).send({
          message: "Admin delete successful",
          deletedCount: result?.deletedCount
        })
      });

      return router;
};

module.exports = adminRoute;