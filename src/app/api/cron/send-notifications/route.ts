import { NextResponse } from "next/server";
import {
  collectionGroup,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import admin from "firebase-admin";

/**
 * CRON: Send scheduled notifications
 * Runs every 5 minutes
 */
export async function GET() {
  try {
    const nowISO = new Date().toISOString();

    // 🔍 Fetch due notifications (MODULAR WAY)
    const notificationsQuery = query(
      collectionGroup(db, "notifications"),
      where("sent", "==", false),
      where("scheduledAt", "<=", nowISO)
    );

    const snapshot = await getDocs(notificationsQuery);

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No notifications due",
      });
    }

    let sentCount = 0;

    for (const notifDoc of snapshot.docs) {
      const notification = notifDoc.data();

      // users/{userId}/notifications/{notificationId}
      const userId = notifDoc.ref.parent.parent?.id;
      if (!userId) continue;

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) continue;

      const userData = userSnap.data();
      const tokens =
        userData?.fcmTokens?.map((t: any) => t.token) ?? [];

      if (tokens.length === 0) {
        await updateDoc(notifDoc.ref, {
          sent: true,
          sentAt: new Date().toISOString(),
          skipped: "NO_TOKENS",
        });
        continue;
      }

      // 🔔 SEND PUSH (ADMIN SDK REQUIRED)
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title: notification.title,
          body: notification.message,
        },
        data: {
          type: notification.type ?? "",
          bookingId: notification.bookingId ?? "",
        },
      });

      // ✅ Mark as sent
      await updateDoc(notifDoc.ref, {
        sent: true,
        sentAt: new Date().toISOString(),
      });

      sentCount++;
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
    });
  } catch (error) {
    console.error("CRON_SEND_NOTIFICATION_ERROR", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}