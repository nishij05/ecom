import { NextResponse } from "next/server";
import { verifyUser } from "../../../../../auth/verifyUser";
import dbConnect from "../../../../../lib/db";
import Order from "../../../../../models/order";

// export async function POST(request) {
//   try {
//     const user = await verifyUser(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { items, total } = await request.json();
//     if (!items || items.length === 0 || !total) {
//       return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
//     }

//     await dbConnect();

//     const newOrder = await Order.create({
//       userEmail: user.email,
//       items,
//       total,
//       status: "Processing",
//     });

//     // OPTIONAL: Clear user's cart after successful order
//     const Cart = (await import("../../../../models/carts")).default;
//     await Cart.deleteMany({ userEmail: user.email });

//     return NextResponse.json({ msg: "Order placed successfully", order: newOrder }, { status: 201 });
//   } catch (err) {
//     console.error("Order placement error:", err);
//     return NextResponse.json(
//       { error: "Failed to place order", details: err.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({ userEmail: user.email }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
