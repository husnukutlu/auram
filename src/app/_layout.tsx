import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Fraunces_400Regular, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AppStateProvider, useApp } from '../lib/AppState';
import { scheduleWeek } from '../lib/notifications';
import { colors } from '../theme';

/** Refreshes the rolling week of notifications every time the app starts. */
function NotificationRefresher() {
  const { profile, premium } = useApp();
  useEffect(() => {
    if (profile) scheduleWeek(profile, premium).catch(() => {});
  }, [profile, premium]);
  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  if (!loaded && !error) return null;

  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <NotificationRefresher />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.blush } }}>
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="share" options={{ presentation: 'modal' }} />
      </Stack>
    </AppStateProvider>
  );
}
