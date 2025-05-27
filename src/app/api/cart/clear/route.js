// app/api/cart/clear/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Cart from "../../../../../models/carts";
import { verifyUser } from "../../../../../auth/verifyUser";

export async function DELETE(request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyUser(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  await dbConnect();
  await Cart.deleteMany({ userId: user._id });

  return NextResponse.json({ message: "Cart cleared successfully" });
}
