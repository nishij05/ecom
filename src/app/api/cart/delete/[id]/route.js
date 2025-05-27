import { NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/db";
import Cart from "../../../../../../models/carts";
import { verifyUser } from "../../../../../../auth/verifyUser";

export async function DELETE(request, { params }) {
  await dbConnect();

  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: params.id,
      userEmail: user.email,
    });

    if (!cartItem) {
      return NextResponse.json(
        { msg: "Item not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ msg: "Item removed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { msg: "Error removing item", error: err.message },
      { status: 500 }
    );
  }
}
