import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("https://control.msg91.com/api/v5/token", {
      headers: { authkey: process.env.MSG91_AUTH_KEY! },
    });
    return Response.json({ token: response.data.token });
  } catch (err) {
    console.error("Token error:", err);
    return Response.json({ error: "Failed to generate token" }, { status: 500 });
  }
}