import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts } from '../../theme';
import { Chip } from '../../components/ui';
import { useApp } from '../../lib/AppState';
import { ensurePermission, scheduleWeek } from '../../lib/notifications';
import { PER_DAY_OPTIONS, TIME_OPTIONS } from '../../data/quiz';
import { topicById } from '../../data/topics';

export default function Settings() {
  const { profile, premium, setProfile, reset } = useApp();
  if (!profile) return null;

  const update = async (patch: Partial<typeof profile>) => {
    const next = { ...profile, ...patch };
    setProfile(next);
    if (await ensurePermission()) await scheduleWeek(next, premium);
  };

  const confirmReset = () =>
    Alert.alert('Baştan başla', 'Profilin ve favorilerin silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          reset();
          router.replace('/onboarding');
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ayarlar</Text>

        <View style={styles.box}>
          <Text style={styles.label}>Üyelik</Text>
          <Text style={styles.value}>{premium ? 'Premium' : 'Ücretsiz'}</Text>
          {!premium && (
            <Pressable accessibilityRole="button" onPress={() => router.push('/paywall')} style={styles.link}>
              <Text style={styles.linkText}>Premium'a geç</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Hedeflerin</Text>
          <Text style={styles.value}>{profile.goals.map((g) => topicById(g).title).join(', ')}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Sabah mesajı saati</Text>
          <View style={styles.grid}>
            {TIME_OPTIONS.map((h) => (
              <Chip
                key={h}
                label={`${String(h).padStart(2, '0')}:00`}
                selected={profile.notifyHour === h}
                onPress={() => update({ notifyHour: h, notifyMinute: 0 })}
                style={styles.third}
              />
            ))}
          </View>
          <Text style={[styles.label, { marginTop: 8 }]}>Günde kaç mesaj?</Text>
          <View style={styles.grid}>
            {PER_DAY_OPTIONS.map((n) => (
              <Chip
                key={n}
                label={n === 1 ? '1' : premium ? `${n}` : `${n} · Premium`}
                selected={(premium ? profile.perDay : 1) === n}
                onPress={() => (premium || n === 1 ? update({ perDay: n }) : router.push('/paywall'))}
                style={styles.third}
              />
            ))}
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => router.push('/onboarding')} style={styles.link}>
          <Text style={styles.linkText}>Testi yeniden yap</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={confirmReset} style={styles.link}>
          <Text style={[styles.linkText, { color: colors.muted }]}>Baştan başla</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, marginBottom: 4 },
  box: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.muted },
  value: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  third: { width: '30%', flexGrow: 1, minHeight: 48 },
  link: { minHeight: 44, justifyContent: 'center' },
  linkText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.rose },
});
