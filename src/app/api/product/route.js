import { NextResponse } from "next/server";
import dataModel from "../../../../models/dataModel";
import axios from "axios";
import dbConnect from "../../../../lib/db";

export async function GET(request) {
  await dbConnect();

  try {
    // fetch data from API
    const response = await axios.get("https://fakestoreapi.com/products");
    const apiData = response.data;
    console.log("data fetched", apiData);

    // loop through products and save them to database
    for (const product of apiData) {
      const existingProduct = await dataModel.findOne({ id: product.id });
      if (!existingProduct) {
        const newProduct = new dataModel({
          id: product.id,
          category: product.category,
          description: product.description,
          title: product.title,
          image: product.image,
          price: product.price,
          rating: product.rating.rate,
          count: product.rating.count,
        });

        await newProduct.save(); // save product to database
        console.log("products are saved");
      } else {
        console.log(`Product with id ${product.id} already exists, skipping.`);
      }
    }
    return NextResponse.send("Data saved to database").status(200);
  } catch (error) {
    console.log("Error fetching or saving API data", error);
    return NextResponse.status(500).send("Error saving products");
  }
}
