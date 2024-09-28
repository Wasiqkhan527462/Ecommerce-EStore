const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

// Route to create a new order
router.post("/create", createOrder);

// Route to get all orders for a specific user
router.get("/list/:userId", getAllOrdersByUser);

// Route to get details of a specific order by ID
router.get("/details/:id", getOrderDetails);

module.exports = router;
