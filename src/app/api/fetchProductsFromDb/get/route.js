import { NextResponse } from "next/server"; 
import dbConnect from "../../../../../lib/db";
import dataModel from "../../../../../models/dataModel";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit"));

    let products;
    const totalProducts = await dataModel.countDocuments();

    if (!isNaN(page) && !isNaN(limit)) {
      const skip = (page - 1) * limit;
      products = await dataModel.find().skip(skip).limit(limit);
    } else {
      products = await dataModel.find(); // fetch all if no pagination
    }

    return NextResponse.json({ products, totalProducts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
