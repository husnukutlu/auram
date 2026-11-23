import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { colors, fonts } from '../../theme';
import { FREE_FAVORITES_LIMIT, useApp } from '../../lib/AppState';
import { dayKey, greeting, pickMessage } from '../../lib/picker';
import { touchStreak } from '../../lib/storage';
import { topicById } from '../../data/topics';
import { MESSAGES } from '../../data/messages';

export default function Today() {
  const { profile, premium, favorites, toggleFavorite } = useApp();
  const now = useMemo(() => new Date(), []);
  const [extra, setExtra] = useState(0);

  const streak = useMemo(() => {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return touchStreak(dayKey(now), dayKey(y));
  }, [now]);

  if (!profile) return <Redirect href="/onboarding" />;

  const message = pickMessage(profile, now, premium, extra);
  const topic = topicById(message.topic);
  const fav = favorites.includes(message.id);
  const angel = MESSAGES.find((m) => m.id === 'melek-1')!;

  const onFavorite = () => {
    if (!fav && !premium && favorites.length >= FREE_FAVORITES_LIMIT) {
      router.push('/paywall');
      return;
    }
    toggleFavorite(message.id);
  };

  const onAnother = () => (premium ? setExtra(extra + 1) : router.push('/paywall'));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>{greeting(now)},</Text>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
          <View style={styles.streak}>
            <Text style={styles.streakText}>{streak} gün seri</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bugünün mesajı · {topic.title}</Text>
          <Text style={styles.cardText}>{message.text}</Text>
          <View style={styles.cardActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              onPress={onFavorite}
              style={[styles.ghost, fav && styles.ghostOn]}
            >
              <Text style={[styles.ghostText, fav && { color: colors.rose }]}>{fav ? 'Favoride' : 'Favori'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/share', params: { id: message.id } })}
              style={styles.shareBtn}
            >
              <Text style={styles.shareText}>Hikayende paylaş</Text>
            </Pressable>
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={onAnother} style={styles.another}>
          <Text style={styles.anotherText}>{premium ? 'Bir mesaj daha' : 'Bir mesaj daha · Premium'}</Text>
        </Pressable>

        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/share', params: { id: angel.id } })}
            style={styles.mini}
          >
            <Text style={styles.miniBig}>777</Text>
            <Text style={styles.miniText}>Doğru yoldasın. Devam et.</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/topic/[id]', params: { id: 'yontem369' } })}
            style={styles.mini}
          >
            <Text style={styles.miniTitle}>369 Yöntemi</Text>
            <Text style={styles.miniText}>Sabah 3, öğle 6, akşam 9 kez yaz.</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hello: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  name: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  streak: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  streakText: { fontFamily: fonts.medium, fontSize: 13, color: colors.goldDark },
  card: { minHeight: 420, borderRadius: 28, backgroundColor: colors.rose, padding: 28, justifyContent: 'space-between', gap: 24 },
  cardLabel: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: 1, color: colors.white, textTransform: 'uppercase' },
  cardText: { fontFamily: fonts.displayRegular, fontSize: 30, lineHeight: 39, color: colors.white },
  cardActions: { flexDirection: 'row', gap: 12 },
  ghost: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
  },
  ghostOn: { backgroundColor: colors.white, borderColor: colors.white },
  ghostText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  shareBtn: { flex: 1, height: 52, borderRadius: 26, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  shareText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  another: { height: 48, alignItems: 'center', justifyContent: 'center' },
  anotherText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.rose },
  row: { flexDirection: 'row', gap: 12 },
  mini: { flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16, gap: 6 },
  miniBig: { fontFamily: fonts.display, fontSize: 24, color: colors.goldDark },
  miniTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  miniText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
