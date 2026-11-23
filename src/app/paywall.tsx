import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';
import { Button } from '../components/ui';
import { useApp } from '../lib/AppState';
import { scheduleTrialReminder } from '../lib/notifications';
import { PLANS, loadPlans, purchase, purchasesEnabled, restore, type Plan, type PlanId } from '../lib/purchases';

const PERKS = ['Günde 5 kişisel mesaj', '15 konunun hepsi', 'Sınırsız favori ve yeni mesajlar', 'Reklam yok, hiçbir zaman'];

export default function Paywall() {
  const { profile, setPremium } = useApp();
  const [plan, setPlan] = useState<PlanId>('yearly');
  const [busy, setBusy] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const [error, setError] = useState<string | null>(null);
  const selected = plans.find((p) => p.id === plan)!;

  useEffect(() => {
    loadPlans().then(setPlans);
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      if (await purchase(plan)) {
        setPremium(true);
        if (purchasesEnabled && selected.trialDays) scheduleTrialReminder(selected.trialDays).catch(() => {});
        close();
      }
    } catch {
      setError('Satın alma tamamlanamadı. Lütfen tekrar dene.');
    } finally {
      setBusy(false);
    }
  }

  async function onRestore() {
    setError(null);
    try {
      if (await restore()) {
        setPremium(true);
        close();
      } else {
        setError('Geri yüklenecek bir satın alma bulunamadı.');
      }
    } catch {
      setError('Geri yükleme başarısız oldu. Lütfen tekrar dene.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel="Kapat" onPress={close} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>
          {profile?.name ? `${profile.name}, niyetlerin` : 'Niyetlerin'} sana özel mesajlarla güçlensin
        </Text>
        <Text style={styles.sub}>Reklam yok. İstediğin zaman iptal et.</Text>
        <View style={styles.perks}>
          {PERKS.map((p) => (
            <Text key={p} style={styles.perk}>
              <Text style={{ color: colors.goldDark }}>✓ </Text>
              {p}
            </Text>
          ))}
        </View>
        <View style={{ gap: 14 }}>
          {plans.map((p) => {
            const on = p.id === plan;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setPlan(p.id)}
                style={[styles.plan, on ? styles.planOn : styles.planOff]}
              >
                {p.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{p.badge}</Text>
                  </View>
                )}
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.planTitle}>{p.title}</Text>
                  {p.note && <Text style={styles.planNote}>{p.note}</Text>}
                </View>
                <Text style={styles.planPrice}>{p.price}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          label={busy ? 'Bekle…' : selected.trialDays ? `${selected.trialDays} gün ücretsiz başla` : 'Devam et'}
          onPress={buy}
          disabled={busy}
        />
        <Text style={styles.legal}>
          {selected.trialDays ? 'Deneme bitmeden 1 gün önce sana hatırlatırız. ' : ''}
          Abonelik, iptal edilmediği sürece otomatik yenilenir.
        </Text>
        <View style={styles.links}>
          <Pressable accessibilityRole="button" onPress={onRestore} style={styles.restore}>
            <Text style={styles.restoreText}>Geri yükle</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL('https://auram.today/kosullar')} style={styles.restore}>
            <Text style={styles.restoreText}>Kullanım Koşulları</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL('https://auram.today/gizlilik')} style={styles.restore}>
            <Text style={styles.restoreText}>Gizlilik</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 18 },
  close: { width: 44, height: 44, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 20, color: colors.muted },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: -8 },
  perks: { gap: 10 },
  perk: { fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  plan: {
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  planOn: { borderWidth: 2, borderColor: colors.rose },
  planOff: { borderWidth: 1, borderColor: colors.border },
  badge: { position: 'absolute', top: -11, left: 16, backgroundColor: colors.rose, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.white },
  planTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  planNote: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  planPrice: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
  footer: { paddingHorizontal: 24, paddingBottom: 12, gap: 8 },
  error: { fontFamily: fonts.medium, fontSize: 13, color: colors.rose, textAlign: 'center' },
  legal: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  restore: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  restoreText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, textDecorationLine: 'underline' },
});
