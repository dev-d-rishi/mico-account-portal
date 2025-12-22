

import { NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { code, totalAmount } = body;

    if (!code || !totalAmount) {
      return NextResponse.json(
        { valid: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch coupon
    const q = query(
      collection(db, "coupons"),
      where("code", "==", code),
      where("active", "==", true)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const couponDoc = snapshot.docs[0];
    const coupon = couponDoc.data();

    // 2️⃣ Check expiry
    if (coupon.expiry) {
      const expiryDate = new Date(coupon.expiry);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { valid: false, message: "Coupon expired" },
          { status: 400 }
        );
      }
    }

    // 3️⃣ Check minimum order value
    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum order amount is ₹${coupon.minAmount}`,
        },
        { status: 400 }
      );
    }

    // 4️⃣ Calculate discount
    let discountAmount = 0;

    if (coupon.type === "percentage") {
      const percentDiscount =
        (totalAmount * coupon.value) / 100;

      discountAmount = coupon.maxDiscount
        ? Math.min(percentDiscount, coupon.maxDiscount)
        : percentDiscount;
    } else if (coupon.type === "flat") {
      discountAmount = coupon.value;
    }

    discountAmount = Math.floor(discountAmount);

    const finalAmount = totalAmount - discountAmount;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount || null,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}