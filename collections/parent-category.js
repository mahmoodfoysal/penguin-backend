const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const parentCategoryRoute = (parentCatCollection) => {
    // get api 
    router.get('/api/admin/get-parent-category', async(req, res) => {
        const getParentCat = parentCatCollection.find();
        const result = await getParentCat.toArray();
        res.send({
          list_data: result,
          message: 'Successful'
        });
      });

    //   post api 
    
    router.post("/api/admin/insert-update-parent-category", async (req, res) => {
        const { _id, par_cat_id, par_cat_name, status } = req.body;
  
        const data = {
          par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
          par_cat_name: typeof par_cat_name === "string" ? par_cat_name : null,
          status: typeof status === "number" ? status : null,
        };
        if (data.par_cat_id === null || !data.par_cat_name || data.status === null ) {
          return res
            .status(404)
            .send({ error: "Invalid or missing required fields" });
        }
        try {
          if (_id) {
            const catId = new ObjectId(_id);
            const result = await parentCatCollection.updateOne(
              {
                _id: catId,
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
            const result = await parentCatCollection.insertOne(data);
            res
              .status(201)
              .send({ message: "Successful", id: result.insertedId });
          }
        } catch (error) {
          res.status(500).send({ error: "Failed to create or update category" });
        }
      });

      router.patch('/api/admin/update-parent-category-status/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id : new ObjectId(id) };
          const {status} = req.body;
          const updateDoc = {
            $set: {status}
          }
          const result = await parentCatCollection.updateOne(filter, updateDoc);
          res.status(201).send({
            message: status === 1 ? 'Category active successful' : 'Category inactive successful'
          });
        }
        catch(error) {
          res.status(500).send({ message: "An error occurred while updating the status." });
        }
      });
      
      return router;
};

module.exports = parentCategoryRoute;