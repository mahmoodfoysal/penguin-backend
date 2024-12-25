const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const subCategoryRoute = (subCategoryCollection) => {
    // get api 
        router.get('/', async(req, res) => {
            const getSubCategory = subCategoryCollection.find();
            const result = await getSubCategory.toArray();
            res.send({
              list_data: result,
              message: 'Successful'
            });
          });
    
        //   post api 
        
        router.post("/", async (req, res) => {
            const { _id, par_cat_id, sub_cat_id, sub_cat_name, userInfo } = req.body;
      
            const data = {
              par_cat_id: typeof par_cat_id === "number" ? par_cat_id : null,
              sub_cat_id: typeof sub_cat_id === "number" ? sub_cat_id : null,
              sub_cat_name: typeof sub_cat_name === "string" ? sub_cat_name : null,
              userInfo: typeof userInfo === "string" ? userInfo : null
            };
            if (data.par_cat_id === null || data.sub_cat_id === null || !data.sub_cat_name || !data.userInfo ) {
              return res
                .status(404)
                .send({ error: "Invalid or missing required fields" });
            }
            try {
              if (_id) {
                const catId = new ObjectId(_id);
                const result = await subCategoryCollection.updateOne(
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
                const result = await subCategoryCollection.insertOne(data);
                res
                  .status(201)
                  .send({ message: "Successful", id: result.insertedId });
              }
            } catch (error) {
              res.status(500).send({ error: "Failed to create or update category" });
            }
          });
    
          return router;
};

module.exports = subCategoryRoute;