import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Calculate total amount
    let totalAmount = 0;
    products.forEach((product) => {
      if (!product.price || !product.quantity) {
        throw new Error("Invalid product data: price or quantity missing.");
      }
      totalAmount += product.price * product.quantity;
    });

    // Check for and apply coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        discountAmount = (totalAmount * coupon.discountPercentage) / 100;
        totalAmount -= discountAmount;
      }
    }

    // Optionally create a new coupon if the order meets certain criteria
    if (totalAmount >= 200) { // Example threshold
      await createNewCoupon(req.user._id);
    }

    // Response
    res.status(200).json({
      success: true,
      totalAmount,
      discountApplied: discountAmount > 0 ? discountAmount : null,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({
      message: "Error processing checkout",
      error: error.message,
    });
  }
};


export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId, userId, products, totalAmount, couponCode } = req.body;
    const user = req.user;
    // Validate input
    if (!userId || !products || !totalAmount) {
      return res.status(400).json({
        error: "Invalid input: userId, products, and totalAmount are required.",
      });
    }

    // Deactivate coupon if provided
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, userId, isActive: true },
        { isActive: false }
      );
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount, // Assuming totalAmount is already in the correct format
      // Optional: Retain sessionId for tracking purposes
    });

    await newOrder.save();
    user.cartItems = [];
    await user.save();
    // Respond with success
    res.status(200).json({
      success: true,
      message: "Order created successfully, and coupon deactivated if used.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({
      message: "Error processing checkout",
      error: error.message,
    });
  }
};


async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}
