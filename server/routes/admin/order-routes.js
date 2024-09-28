const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

// Route to get all orders
router.get("/get", getAllOrdersOfAllUsers);

// Route to get details of a specific order by ID
router.get("/details/:id", getOrderDetailsForAdmin);

// Route to update the order status
router.put("/update/:id", updateOrderStatus);

// Route to update the payment status
router.put("/payment-status/:id", updatePaymentStatus);

module.exports = router;
