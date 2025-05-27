import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  userEmail: { type: String, required: true },
});


const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
