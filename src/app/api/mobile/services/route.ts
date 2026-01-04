import { db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all services
    const servicesSnap = await getDocs(collection(db, "services"));

    // First pass: attach ratings data
    const servicesWithRatings = await Promise.all(
      servicesSnap.docs.map(async (docu) => {
        const serviceData = docu.data();
        const serviceId = docu.id;

        // Fetch ratings for this service
        const ratingsQuery = query(
          collection(db, "ratings"),
          where("serviceId", "==", serviceId)
        );
        const ratingsSnap = await getDocs(ratingsQuery);

        const totalRatings = ratingsSnap.size;
        let avgRating = 0;

        if (!ratingsSnap.empty) {
          const sum = ratingsSnap.docs.reduce(
            (acc, r) => acc + (r.data().rating || 0),
            0
          );
          avgRating = Number((sum / totalRatings).toFixed(1));
        }

        return {
          id: serviceId,
          ...serviceData,
          avgRating,
          totalRatings,
          mostPopular: false, // set later
        };
      })
    );

    // Second pass: find most popular service (max totalRatings)
    let maxRatings = 0;
    let mostPopularServiceId: string | null = null;

    servicesWithRatings.forEach((s) => {
      if (s.totalRatings > maxRatings) {
        maxRatings = s.totalRatings;
        mostPopularServiceId = s.id;
      }
    });

    const finalServices = servicesWithRatings.map((s) => ({
      ...s,
      mostPopular: s.id === mostPopularServiceId && maxRatings > 0,
    }));

    return NextResponse.json({ services: finalServices });
  } catch (error) {
    console.error("Error fetching mobile services with ratings:", error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}