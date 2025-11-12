import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface Vehicle {
  name: string;
  brand: string;
  active?: boolean;
  type?: string;
}

export async function POST(req: Request) {
  try {
    const { vehicle, phone } = await req.json();

    if (!vehicle || !vehicle.type) {
      return NextResponse.json(
        { message: "Vehicle object with type is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "User not authorized" },
        { status: 401 }
      );
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const userQuerySnapshot = await getDocs(q);

    if (userQuerySnapshot.empty) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();
    const existingVehicles: Vehicle[] = userData.vehicles || [];

    let updatedVehicles: Vehicle[];

    const vehicleIndex = existingVehicles.findIndex(
      (v: Vehicle) => v.name === vehicle.name && v.brand === vehicle.brand
    );

    if (vehicleIndex !== -1) {
      updatedVehicles = existingVehicles.map((v: Vehicle, i: number) => ({
        ...v,
        active: i === vehicleIndex,
      }));
    } else {
      updatedVehicles = existingVehicles.map((v: Vehicle) => ({
        ...v,
        active: false,
      }));
      updatedVehicles.push({ ...vehicle, active: true });
    }

    const userDocRef = doc(db, "users", userDoc.id);
    await updateDoc(userDocRef, {
      vehicles: updatedVehicles,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message:
        vehicleIndex !== -1
          ? "Vehicle activated successfully"
          : "Vehicle added and set as active",
      success: true,
      vehicles: updatedVehicles,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update vehicle info" },
      { status: 500 }
    );
  }
}