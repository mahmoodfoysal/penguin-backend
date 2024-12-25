const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const dashboardMenuRoute = (menuCollection) => {
    router.get('/api/admin/get-dashboard-menu', async(req, res) => {
        try {
          const getDashboardMenu = menuCollection.find();
          const result = await getDashboardMenu.toArray();
          res.send({
            list_data: result,
            message: "Successful"
          })
        }
        catch (error) {
          res.status(404).send({error: 'Menu can not found'});
        }
      });

      return router;
};

module.exports = dashboardMenuRoute;