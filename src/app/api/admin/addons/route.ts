import { NextResponse } from 'next/server';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

/**
 * GET — Fetch all addons
 */
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'addons'));
    const list = snapshot.docs.map(docu => ({
      id: docu.id,
      ...docu.data(),
    }));

    return NextResponse.json({ addons: list });
  } catch (error) {
    console.error('Error fetching addons:', error);
    return NextResponse.json(
      { error: 'Failed to load addons' },
      { status: 500 },
    );
  }
}

/**
 * POST — Create or Update addon
 * (same endpoint for create & update, like services)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      description,
      time,
      price,
    } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Addon id and name are required' },
        { status: 400 },
      );
    }

    await setDoc(doc(db, 'addons', id), {
      id,
      name,
      description,
      time,
      price,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Addon save error:', error);
    return NextResponse.json(
      { error: 'Failed to save addon' },
      { status: 500 },
    );
  }
}

/**
 * DELETE — Remove addon
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Addon id is required' },
        { status: 400 },
      );
    }

    await deleteDoc(doc(db, 'addons', id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete addon error:', error);
    return NextResponse.json(
      { error: 'Failed to delete addon' },
      { status: 500 },
    );
  }
}