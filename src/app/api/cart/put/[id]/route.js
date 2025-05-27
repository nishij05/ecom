import { NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/db";
import Cart from "../../../../../../models/carts";
import { verifyUser } from "../../../../../../auth/verifyUser";

export async function PUT(request, { params }) {
  await dbConnect();

  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quantity } = await request.json();

    const item = await Cart.findOneAndUpdate(
      { _id: params.id, userEmail: user.email },
      { quantity },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { msg: "Item not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { msg: "Error updating quantity", error: err.message },
      { status: 500 }
    );
  }
}
