import { useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { colors, fonts } from '../theme';
import { messageById } from '../data/messages';
import { StoryCard, type StoryCardRef } from '../components/StoryCard';
import { Button } from '../components/ui';

export default function Share() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const message = id ? messageById(id) : undefined;
  const cardRef = useRef<StoryCardRef>(null);
  const { width, height } = useWindowDimensions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!message) return <Redirect href="/(tabs)" />;

  // Fit the 9:16 card into the space above the buttons.
  const cardWidth = Math.min(width - 48, ((height - 260) * 9) / 16);

  async function share() {
    setBusy(true);
    setError(null);
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, width: 1080, height: 1920 });
      if (!(await Sharing.isAvailableAsync())) throw new Error('unavailable');
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Hikayende paylaş' });
    } catch {
      setError('Paylaşım açılamadı. Lütfen tekrar dene.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.cardWrap}>
        <StoryCard ref={cardRef} message={message} width={cardWidth} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <Button label={busy ? 'Hazırlanıyor…' : 'Hikayende paylaş'} onPress={share} disabled={busy} />
        <Button label="Kapat" variant="outline" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  cardWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 16 },
  error: { fontFamily: fonts.body, color: colors.rose, textAlign: 'center', paddingHorizontal: 24 },
  actions: { padding: 24, gap: 12 },
});
