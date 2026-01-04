import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }

    const notificationsRef = collection(
      db,
      'users',
      userId,
      'notifications'
    );

    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error('[GET_NOTIFICATIONS_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}