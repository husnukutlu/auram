import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Profile } from '../data/quiz';
import { pickMessage } from './picker';

const CHANNEL_ID = 'daily';
const TRIAL_REMINDER_ID = 'trial-reminder';
/** iOS keeps at most 64 pending local notifications, so we schedule a rolling week. */
const DAYS_AHEAD = 7;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Extra hours used when the user asks for 3 or 5 messages a day. */
const EXTRA_SLOTS: Record<1 | 3 | 5, number[]> = {
  1: [],
  3: [13, 20],
  5: [11, 14, 17, 20],
};

export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    // Android 13+ only shows the prompt once a channel exists.
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Günlük mesajlar',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/**
 * Replaces all scheduled notifications with the next week of personalized messages.
 * Call after onboarding, after a settings change, and on every app open.
 */
export async function scheduleWeek(profile: Profile, premium: boolean): Promise<void> {
  // Replace the daily messages but keep the trial reminder.
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier !== TRIAL_REMINDER_ID)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
  const perDay = premium ? profile.perDay : 1;
  const now = new Date();

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const hours: [number, number][] = [
      [profile.notifyHour, profile.notifyMinute],
      ...EXTRA_SLOTS[perDay].map((h): [number, number] => [h, 0]),
    ];
    for (let slot = 0; slot < hours.length; slot++) {
      const [h, m] = hours[slot];
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, h, m, 0);
      if (at <= now) continue;
      const msg = pickMessage(profile, at, premium, slot);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: slot === 0 ? `${profile.name}, bugünün mesajı ✨` : 'Auram',
          body: msg.text,
          data: { messageId: msg.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: CHANNEL_ID,
        },
      });
    }
  }
}

/**
 * Reminds the user one day before a free trial ends, as promised on the paywall.
 * Safe to call more than once: it replaces any earlier reminder.
 */
export async function scheduleTrialReminder(trialDays: number): Promise<void> {
  if (!(await ensurePermission())) return;
  const at = new Date(Date.now() + (trialDays - 1) * 24 * 60 * 60 * 1000);
  await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: TRIAL_REMINDER_ID,
    content: {
      title: 'Ücretsiz denemen yarın bitiyor',
      body: 'Devam etmek istemezsen aboneliğini bugün mağaza ayarlarından iptal edebilirsin.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL_ID },
  });
}
