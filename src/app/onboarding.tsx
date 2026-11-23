import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { useApp } from '../lib/AppState';
import { ensurePermission, scheduleWeek } from '../lib/notifications';
import type { TopicId } from '../data/topics';
import {
  EXP_OPTIONS,
  GOAL_OPTIONS,
  LIFE_OPTIONS,
  MAX_GOALS,
  MOOD_OPTIONS,
  PER_DAY_OPTIONS,
  REL_OPTIONS,
  TIME_OPTIONS,
  TONE_OPTIONS,
  type Experience,
  type LifeStage,
  type Mood,
  type Profile,
  type Relationship,
  type Tone,
} from '../data/quiz';

const TOTAL = 8;

export default function Onboarding() {
  const { setProfile, premium } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<TopicId[]>([]);
  const [mood, setMood] = useState<Mood | null>(null);
  const [life, setLife] = useState<LifeStage | null>(null);
  const [rel, setRel] = useState<Relationship | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);
  const [exp, setExp] = useState<Experience | null>(null);
  const [hour, setHour] = useState(9);
  const [perDay, setPerDay] = useState<1 | 3 | 5>(1);

  const toggleGoal = (g: TopicId) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : prev.length < MAX_GOALS ? [...prev, g] : prev,
    );

  const canContinue = [
    name.trim().length > 0,
    goals.length > 0,
    mood !== null,
    life !== null,
    rel !== null,
    tone !== null,
    exp !== null,
    true,
  ][step];

  async function finish() {
    const profile: Profile = {
      name: name.trim(),
      goals,
      mood: mood!,
      lifeStage: life!,
      relationship: rel!,
      tone: tone!,
      experience: exp!,
      notifyHour: hour,
      notifyMinute: 0,
      perDay,
    };
    setProfile(profile);
    try {
      if (await ensurePermission()) await scheduleWeek(profile, premium);
    } catch {
      // Notifications are optional; the app still works without them.
    }
    router.replace('/(tabs)');
    router.push({ pathname: '/paywall', params: { from: 'onboarding' } });
  }

  const next = () => (step < TOTAL - 1 ? setStep(step + 1) : finish());

  const single = <T extends string>(options: { value: T; label: string }[], value: T | null, set: (v: T) => void) => (
    <View style={styles.list}>
      {options.map((o) => (
        <Chip key={o.value} label={o.label} selected={value === o.value} onPress={() => set(o.value)} />
      ))}
    </View>
  );

  const screens = [
    {
      title: 'Sana nasıl hitap edelim?',
      sub: 'Mesajlarını sana özel hazırlayacağız.',
      body: (
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Adın"
          placeholderTextColor={colors.muted}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => canContinue && next()}
          accessibilityLabel="Adın"
          style={styles.input}
        />
      ),
    },
    {
      title: 'Hayatına en çok neyi çekmek istiyorsun?',
      sub: `En fazla ${MAX_GOALS} tane seç. Mesajlarını buna göre hazırlayacağız.`,
      body: (
        <View style={styles.grid}>
          {GOAL_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              selected={goals.includes(o.value)}
              onPress={() => toggleGoal(o.value)}
              style={styles.gridItem}
            />
          ))}
        </View>
      ),
    },
    { title: 'Bugünlerde kendini nasıl hissediyorsun?', sub: 'Doğru ya da yanlış cevap yok.', body: single(MOOD_OPTIONS, mood, setMood) },
    { title: 'Hayatının hangi dönemindesin?', sub: 'Mesajlarını dönemine göre seçeceğiz.', body: single(LIFE_OPTIONS, life, setLife) },
    { title: 'İlişki durumun?', sub: 'Aşk mesajlarını buna göre seçeceğiz.', body: single(REL_OPTIONS, rel, setRel) },
    { title: 'Mesajların hangi tonda olsun?', sub: 'İstediğin zaman değiştirebilirsin.', body: single(TONE_OPTIONS, tone, setTone) },
    { title: 'Manifest konusunda ne kadar deneyimlisin?', sub: 'Yeni başlıyorsan sana adım adım anlatacağız.', body: single(EXP_OPTIONS, exp, setExp) },
    {
      title: 'Mesajın ne zaman gelsin?',
      sub: 'Her sabah sana özel bir mesaj göndereceğiz.',
      body: (
        <View style={{ gap: 20 }}>
          <View style={styles.grid}>
            {TIME_OPTIONS.map((h) => (
              <Chip
                key={h}
                label={`${String(h).padStart(2, '0')}:00`}
                selected={hour === h}
                onPress={() => setHour(h)}
                style={styles.gridThird}
              />
            ))}
          </View>
          <Text style={styles.label}>Günde kaç mesaj?</Text>
          <View style={styles.grid}>
            {PER_DAY_OPTIONS.map((n) => (
              <Chip
                key={n}
                label={n === 1 ? '1' : `${n} · Premium`}
                selected={perDay === n}
                onPress={() => setPerDay(n)}
                style={styles.gridThird}
              />
            ))}
          </View>
        </View>
      ),
    },
  ];

  const s = screens[step];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            style={[styles.back, step === 0 && { opacity: 0 }]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${((step + 1) / TOTAL) * 100}%` }]} />
          </View>
          <Text style={styles.count}>
            {step + 1} / {TOTAL}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.sub}>{s.sub}</Text>
          <View style={{ marginTop: 28 }}>{s.body}</View>
        </ScrollView>
        <View style={styles.footer}>
          <Button label={step === TOTAL - 1 ? 'Başlayalım' : 'Devam et'} onPress={next} disabled={!canContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 26, lineHeight: 28, color: colors.ink },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.rose },
  count: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  content: { padding: 24, paddingTop: 28 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 10 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
  },
  list: { gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%', flexGrow: 1 },
  gridThird: { width: '30%', flexGrow: 1 },
  footer: { padding: 24, paddingTop: 8 },
});
