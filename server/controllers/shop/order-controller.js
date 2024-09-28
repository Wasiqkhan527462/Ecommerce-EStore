const Order = require("../../models/Order");
const Cart = require("../../models/Cart");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus = "pending",
      paymentMethod,
      paymentStatus = "pending", // Default payment status
      totalAmount,
      orderDate = new Date(),
      orderUpdateDate = new Date(),
      cartId,
    } = req.body;

    // Validate required fields
    if (!userId || !cartItems || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Create the order
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    });

    await newlyCreatedOrder.save();

    // Optionally clear the cart if necessary
    await Cart.findByIdAndUpdate(cartId, { items: [] }); // Clear the cart after order creation

    res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser, // Ensure this line is present
  getOrderDetails,
};
