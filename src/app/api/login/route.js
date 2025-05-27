import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { validateLoginInput } from "../../../../validation/login";
import User from "../../../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await dbConnect();

  const body = await request.json();
  console.log("Request body:", body);

  const { email, password } = body;
  const { errors, isValid } = validateLoginInput(body);

  if (!isValid) {
    return NextResponse.json(errors, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: "Email not found" }, { status: 400 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { msg: "Password is incorrect" },
        { status: 400 }
      );
    }

    const payload = { _id: user._id, name: user.name, email: user.email };
    console.log("SECRET_KEY in use:", process.env.SECRET_KEY);

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return NextResponse.json({ success: true, token: token });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
