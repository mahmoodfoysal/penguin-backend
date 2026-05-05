const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const orderRoute = (ordersCollection) => {
  // ================= GET =================
  router.get("/api/penguin/get-order-list", async (req, res) => {
    try {
      const result = await ordersCollection.find().toArray();
      res.status(200).send({
        status: 200,
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      res.status(500).send({ error: "Order data can not fetch" });
    }
  });

  // customer order history

  router.get("/api/penguin/get-order-list/:email", async (req, res) => {
    try {
      const email = req.params.email;

      if (!email) {
        return res.status(400).send({
          status: 400,
          message: "Email parameter is required",
        });
      }

      const query = { email: email };
      const result = await ordersCollection.find(query).toArray();

      res.status(200).send({
        status: 200,
        list_data: result,
        message: "Successful",
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).send({
        status: 500,
        error: "Order data could not be fetched",
      });
    }
  });

  // ================= INSERT / UPDATE =================
  router.post("/api/admin/insert-update-order-list", async (req, res) => {
    try {
      const {
        _id,
        full_name,
        email,
        phone_no,
        city,
        country_name,
        country_id,
        zip,
        address,
        card_no,
        card_exp_date,
        card_cvc,
        sub_total,
        vat_total,
        shipping,
        total_amount,
        order_status,
        order_date,
        payment_method,
        bkash_no,
        bkash_trns_no,
        cash_on_delivery,
        order_list,
        order_id,
      } = req.body;

      // ================= ORDER LIST VALIDATION =================
      if (!Array.isArray(order_list)) {
        return res.status(400).send({
          error: "order_list must be an array",
        });
      }

      // validate each item (optional but good practice)
      const validatedOrderList = order_list.map((item) => ({
        _id: typeof item._id === "string" ? item._id : null,
        prod_name: typeof item.prod_name === "string" ? item.prod_name : null,
        price: typeof item.price === "number" ? item.price : 0,
        prod_image:
          typeof item.prod_image === "string" ? item.prod_image : null,
        prod_id: typeof item.prod_id === "number" ? item.prod_id : null,
        stock: typeof item.stock === "number" ? item.stock : 0,
        currency_name:
          typeof item.currency_name === "string" ? item.currency_name : null,
        currency_id:
          typeof item.currency_id === "number" ? item.currency_id : null,
        discount_price:
          typeof item.discount_price === "number" ? item.discount_price : 0,
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
      }));

      // ================= MAIN DATA =================

      const generateOrderId = () => {
        const prefix = "PGL-";
        // Generates a random 10-digit number
        const randomNumber = Math.floor(
          1000000000 + Math.random() * 9000000000,
        );
        return `${prefix}${randomNumber}`;
      };

      const data = {
        full_name: typeof full_name === "string" ? full_name : null,
        email: typeof email === "string" ? email : null,
        phone_no: typeof phone_no === "number" ? phone_no : null,
        city: typeof city === "string" ? city : null,
        country_name: typeof country_name === "string" ? country_name : null,

        country_id: typeof country_id === "number" ? country_id : null,
        zip: typeof zip === "number" ? zip : null,
        address: typeof address === "string" ? address : null,

        card_no: typeof card_no === "number" ? card_no : null,
        card_exp_date: typeof card_exp_date === "string" ? card_exp_date : null,
        card_cvc: typeof card_cvc === "number" ? card_cvc : null,

        sub_total: typeof sub_total === "number" ? sub_total : 0,
        vat_total: typeof vat_total === "number" ? vat_total : 0,
        shipping: typeof shipping === "number" ? shipping : 0,
        total_amount: typeof total_amount === "number" ? total_amount : 0,

        order_status:
          typeof order_status === "string" ? order_status : "pending",
        order_date:
          typeof order_date === "string"
            ? order_date
            : new Date().toISOString(),

        payment_method:
          typeof payment_method === "number" ? payment_method : null,

        bkash_no: typeof bkash_no === "number" ? bkash_no : null,
        bkash_trns_no: typeof bkash_trns_no === "string" ? bkash_trns_no : null,

        cash_on_delivery:
          typeof cash_on_delivery === "string" ? cash_on_delivery : null,

        order_list: validatedOrderList,
      };

      // ================= REQUIRED FIELD CHECK =================
      if (
        !data.full_name ||
        !data.email ||
        !data.city ||
        !data.country_name ||
        !data.address ||
        !data.order_status ||
        data.phone_no === null ||
        data.country_id === null ||
        data.zip === null ||
        data.payment_method === null
      ) {
        return res.status(400).send({
          error: "Invalid or missing required fields",
        });
      }

      // ================= UPDATE =================
      if (_id) {
        data.modifiedAt = new Date();
        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: data },
        );

        if (result.modifiedCount === 0) {
          return res.status(404).send({
            error: "No data modified",
          });
        }

        return res.status(200).send({
          status: 200,
          message: "Update Successful",
          id: _id,
        });
      }

      // ================= INSERT =================
      data.createdAt = new Date();
      if (!data.order_id) {
        data.order_id = generateOrderId();
      }
      const result = await ordersCollection.insertOne(data);

      res.status(201).send({
        status: 201,
        message: "Order Created Successfully",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).send({
        error: "Failed to insert/update",
      });
    }
  });

  // ================= DELETE =================
  router.delete("/api/admin/delete-order-list/:id", async (req, res) => {
    try {
      const result = await ordersCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.status(200).send({
        status: 200,
        message: "Order delete successful",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).send({ error: "Delete failed" });
    }
  });

  // ================= UPDATE STATUS =================
  router.patch("/api/admin/update-order-status/:id", async (req, res) => {
    try {
      const { order_status, user_info } = req.body;

      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            order_status: order_status,
            user_info: user_info,
            modifiedAt: new Date(),
          },
        },
      );

      res.status(200).send({
        status: 200,
        message: "Order status updated",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).send({ error: "Status update failed" });
    }
  });

  return router;
};

module.exports = orderRoute;
