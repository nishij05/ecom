// auth/verifyUser.js
import jwt from "jsonwebtoken";

export async function verifyUser(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or malformed", authHeader);
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.email) {
      console.log("Invalid token payload");
      return null;
    }

    return decoded; // should contain `email`
  } catch (err) {
    console.error("verifyUser Error:", err.message);
    return null;
  }
}
