

import { NextResponse } from 'next/server';
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

/**
 * GET /api/mobile/addons?serviceId=SERVICE_ID
 *
 * Flow:
 * 1. Fetch service
 * 2. Read service.allowed_addons (addon IDs)
 * 3. Fetch all addons
 * 4. Return only addons allowed for this service
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'serviceId is required' },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch service
    const serviceSnap = await getDoc(doc(db, 'services', serviceId));

    if (!serviceSnap.exists()) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const serviceData = serviceSnap.data();
    const allowedAddons: string[] = Array.isArray(serviceData.allowed_addons)
      ? serviceData.allowed_addons
      : [];

    if (allowedAddons.length === 0) {
      return NextResponse.json({ addons: [] });
    }

    // 2️⃣ Fetch all addons
    const addonSnapshot = await getDocs(collection(db, 'addons'));

    // 3️⃣ Filter allowed addons
    const addons = addonSnapshot.docs
      .map(docu => ({ id: docu.id, ...docu.data() }))
      .filter(addon => allowedAddons.includes(addon.id));

    return NextResponse.json({ addons });
  } catch (error) {
    console.log('Mobile addons fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load addons' },
      { status: 500 }
    );
  }
}