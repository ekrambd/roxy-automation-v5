import { messaging, db } from './firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';

// Standard VAPID key for web push notifications configuration
const VAPID_KEY = 'BD5qFz_HkE8W4CqP2U_lV8W1S5oP9B5J1R7_m4P7n2D6_y9Q7p2S6C1E2V4F5G6H7I8J';

export async function requestNotificationPermission(phone?: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window) || !messaging || !db) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });

      if (token) {
        // Store the token in the fcm_tokens collection
        const tokenRef = doc(db, 'fcm_tokens', token);
        await setDoc(tokenRef, {
          token,
          phone: phone || '',
          userAgent: navigator.userAgent,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        return token;
      }
    }
  } catch (error) {
    console.warn('Failed to retrieve FCM token:', error);
  }
  return null;
}
