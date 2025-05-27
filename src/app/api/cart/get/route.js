import { NextResponse } from "next/server";
import Cart from "../../../../../models/carts";
import dbConnect from "../../../../../lib/db";
import { verifyUser } from "../../../../../auth/verifyUser";

export async function GET(request) {
  await dbConnect();

  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await Cart.find({ userEmail: user.email });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching cart items:", error });
  }
}
