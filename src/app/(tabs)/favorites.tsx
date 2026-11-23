import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { FREE_FAVORITES_LIMIT, useApp } from '../../lib/AppState';
import { messageById } from '../../data/messages';
import { MessageRow } from '../../components/MessageRow';

export default function Favorites() {
  const { favorites, premium } = useApp();
  const items = favorites.map(messageById).filter((m) => m !== undefined);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Favoriler</Text>
        {!premium && (
          <Text style={styles.sub}>
            {favorites.length} / {FREE_FAVORITES_LIMIT} favori. Premium ile sınırsız.
          </Text>
        )}
        {items.length === 0 ? (
          <Text style={styles.empty}>Sevdiğin mesajları "Favori" ile buraya ekle.</Text>
        ) : (
          items.map((m) => <MessageRow key={m.id} message={m} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blush },
  content: { padding: 24, gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginBottom: 4 },
  empty: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 24 },
});
