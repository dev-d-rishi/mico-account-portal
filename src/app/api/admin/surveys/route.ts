import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const surveyCol = collection(db, "serviceActivity");
    const snapshot = await getDocs(surveyCol);

    const surveys = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        interest: data.interest || "",
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        userName: data.user?.name || "Unknown",
        phone: data.user?.phone || "-",
        serviceViewed: data.serviceViewed?.name || "-",
        addOns:
          data.selectedAddOns?.map(
            (add: { name: string; price?: number; timing?: string }) =>
              `${add.name.trim()} ${
                add.price ? `(${add.price}₹)` : ""
              } ${add.timing ? `- ${add.timing} min` : ""}`
          ) || [],
      };
    });

    // Sort by most recent
    surveys.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    return NextResponse.json(surveys);
  } catch (err) {
    console.error("Error fetching surveys:", err);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}