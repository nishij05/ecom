import User from "../../../../models/user";
import bcrypt from "bcrypt";
import { validateRegisterInput } from "../../../../validation/register";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  console.log("Recieved body:", body);

  const { errors, isValid } = validateRegisterInput(body);

  // console.log("Received data:", req.body); // Debug incoming request

 if (!isValid) {
  console.log("Validation errors:", errors); 
  return NextResponse.json(errors, { status: 400 });
}

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      console.log("User already exists:", existingUser); // Debug user existence
      errors.email = "Email already exists";
      return NextResponse.json(errors, { status: 400 });
    }

    // Create a new user
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    console.log("Creating user:", newUser); // Debug user creation

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Save user to the database
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser); // Debug successful save

    // create JWT
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name, email: savedUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      msg: "User registered successfully",
      token: `Bearer ${token}`,
    });
  } catch (err) {
    console.error("Error during registration:", err); // Debug server error
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
