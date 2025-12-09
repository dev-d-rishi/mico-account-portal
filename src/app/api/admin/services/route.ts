import { NextResponse } from "next/server";
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
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

// GET — Fetch all services
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "services"));
    const list = snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
    return NextResponse.json({ services: list });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
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
