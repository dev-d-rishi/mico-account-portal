import { NextResponse } from "next/server";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import AWS from "aws-sdk";
import { db } from "@/lib/firebaseClient";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();

// Upload image buffer to S3 and return URL
async function uploadToS3(file: File, serviceId: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `services/${serviceId}.png`,
    Body: buffer,
    ACL: "public-read",
    ContentType: file.type,
  };

  const upload = await s3.upload(params).promise();
  return upload.Location; // Public S3 URL
}

// GET — Fetch all services, with avgRating and totalRatings
export async function GET() {
  try {
    const servicesSnap = await getDocs(collection(db, "services"));

    const services = await Promise.all(
      servicesSnap.docs.map(async serviceDoc => {
        const serviceData = serviceDoc.data();
        const serviceId = serviceDoc.id;

        // Fetch ratings for this service
        const ratingsQuery = query(
          collection(db, "ratings"),
          where("serviceId", "==", serviceId)
        );

        const ratingsSnap = await getDocs(ratingsQuery);

        let avgRating = 0;
        const totalRatings = ratingsSnap.size;

        if (!ratingsSnap.empty) {
          const sum = ratingsSnap.docs.reduce((acc, r) => {
            return acc + (r.data().rating || 0);
          }, 0);

          avgRating = Number((sum / totalRatings).toFixed(1));
        }

        return {
          id: serviceId,
          ...serviceData,
          allowed_addons: Array.isArray(serviceData.allowed_addons)
            ? serviceData.allowed_addons
            : [],
          avgRating,
          totalRatings,
        };
      })
    );

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services with ratings:", error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}

// POST — Create or Update service
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const id = form.get("id") as string;
    const service_name = form.get("service_name") as string;
    const description = form.get("description") as string;

    const pricingJSON = form.get("car_pricing") as string;
    const servicesJSON = form.get("services") as string;

    const allowedAddonsJSON = form.get("allowed_addons") as string | null;
    const allowed_addons = allowedAddonsJSON
      ? JSON.parse(allowedAddonsJSON)
      : [];

    const car_pricing = JSON.parse(pricingJSON);
    const services = JSON.parse(servicesJSON);

    const file = form.get("image") as File | null;

    let image_url = form.get("image_url") as string; // existing image URL

    // Upload new image if provided
    if (file) {
      image_url = await uploadToS3(file, id);
    }

    await setDoc(doc(db, "services", id), {
      id,
      service_name,
      description,
      car_pricing,
      services,
      image_url,
      allowed_addons,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service save error:", error);
    return NextResponse.json({ error: "Failed to save service" }, { status: 500 });
  }
}

// DELETE — Remove service
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await deleteDoc(doc(db, "services", id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
