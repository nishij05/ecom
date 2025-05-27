import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function GET(request) {
  await dbConnect();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    // console.log("TOKEN FROM HEADER:", token);

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");
    if (!user)
      return NextResponse.json({ msg: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Error fetching user" }, { status: 500 });
  }
}

export async function PUT(request) {
  await dbConnect();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded._id;  // Fix here

    const { name, email, password, phone, gender } = await request.json();
    const updatedFields = { name, email, phone, gender };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password");

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Error updating user" }, { status: 500 });
  }
}
