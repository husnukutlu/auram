import { Tabs } from 'expo-router';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.blush, borderTopColor: colors.track },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 13 },
        tabBarIconStyle: { display: 'none' },
        tabBarIcon: () => null,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Bugün' }} />
      <Tabs.Screen name="topics" options={{ title: 'Konular' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoriler' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ayarlar' }} />
    </Tabs>
  );
}
