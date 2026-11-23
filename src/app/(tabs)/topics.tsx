import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts } from '../../theme';
import { TOPICS } from '../../data/topics';
import { useApp } from '../../lib/AppState';

export default function Topics() {
  const { premium } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Konular</Text>
        {TOPICS.map((t) => {
          const locked = !t.free && !premium;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              onPress={() => (locked ? router.push('/paywall') : router.push({ pathname: '/topic/[id]', params: { id: t.id } }))}
              style={styles.row}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.rowTitle}>{t.title}</Text>
                <Text style={styles.rowSub}>{t.description}</Text>
              </View>
              {locked && <Text style={styles.badge}>Premium</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  rowSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  badge: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.rose,
    borderWidth: 1,
    borderColor: colors.rose,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
});
