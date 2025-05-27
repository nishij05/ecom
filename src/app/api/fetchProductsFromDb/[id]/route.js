import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import dataModel from "../../../../../models/dataModel";

export async function GET(request, { params }) {
  const productId = params.id;

  await dbConnect();

  try {
    const product = await dataModel.findOne({ id: Number(productId) }); // Use Number() if id is a number

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
