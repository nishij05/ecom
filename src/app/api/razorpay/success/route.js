import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "../../../../../lib/db";
import Order from "../../../../../models/order";
import Cart from "../../../../../models/carts";
import { verifyUser } from "../../../../../auth/verifyUser";

export async function POST(request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Step 1: Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Step 2: Proceed with order placement
    await dbConnect();

    const cartItems = await Cart.find({ userEmail: user.email });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      userEmail: user.email,
      items: cartItems,
      total: totalAmount,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: "Paid",
      createdAt: new Date(),
    });

    // Clear the user's cart after placing order
    await Cart.deleteMany({ userEmail: user.email });

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (err) {
    console.error("Razorpay Success Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
