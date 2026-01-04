

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * POST /api/mobile/rate-review
 * Firestore: ratings collection
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, userId, serviceId, rating, review, likes } = body;

    // --- Validation ---
    if (!bookingId || !userId || !serviceId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    // --- Prevent duplicate review per booking ---
    const ratingRef = collection(db, 'ratings');
    const q = query(ratingRef, where('bookingId', '==', bookingId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      return NextResponse.json(
        { message: 'Feedback already submitted for this booking' },
        { status: 409 },
      );
    }

    // --- Create rating document ---
    await addDoc(ratingRef, {
      bookingId,
      userId,
      serviceId,
      rating,
      review: review || '',
      likes: Array.isArray(likes) ? likes : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Rating submitted successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('RATE_REVIEW_FIRESTORE_ERROR', error);
    return NextResponse.json(
      { message: 'Failed to submit rating', error: String(error) },
      { status: 500 },
    );
  }
}