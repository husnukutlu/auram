import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { colors, fonts } from '../../theme';
import { TOPICS, type TopicId } from '../../data/topics';
import { MESSAGES } from '../../data/messages';
import { useApp } from '../../lib/AppState';
import { MessageRow } from '../../components/MessageRow';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { premium } = useApp();
  const topic = TOPICS.find((t) => t.id === (id as TopicId));
  if (!topic) return <Redirect href="/(tabs)/topics" />;
  if (!topic.free && !premium) return <Redirect href="/paywall" />;

  const items = MESSAGES.filter((m) => m.topic === topic.id);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹ Konular</Text>
        </Pressable>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.sub}>{topic.description}</Text>
        {items.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 12 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  backText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.rose },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginBottom: 8 },
});
