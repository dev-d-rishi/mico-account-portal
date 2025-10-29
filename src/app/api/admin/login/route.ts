import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // bcrypt & jsonwebtoken require node runtime

const ADMIN_EMAIL = "admin@mico.com";
const ADMIN_PLAIN = "Admin@123";
const SALT_ROUNDS = 10;

// Hash the mock admin password at module init (synchronously for simplicity)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PLAIN, SALT_ROUNDS);

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Basic check for email first (avoid leaking which part failed in details)
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Sign JWT
    const payload = { email: ADMIN_EMAIL, role: "admin" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json(
      { success: true, message: "Login successful", token },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Bad request", error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
