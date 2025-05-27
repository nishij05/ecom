import { NextResponse } from "next/server";
import Cart from "../../../../../models/carts";
import dbConnect from "../../../../../lib/db";
import { verifyUser } from "../../../../../auth/verifyUser";

export async function POST(request) {
  await dbConnect();

  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Cart POST body:", body);
    const { id, title, price, image, quantity } = body;

    let item = await Cart.findOne({ productId: id, userEmail: user.email });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new Cart({
        productId: id,
        title,
        price,
        image,
        quantity,
        userEmail: user.email,
      });
      await item.save();
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json(
      { msg: "Error adding to cart", error: error.message },
      { status: 500 }
    );
  }
}