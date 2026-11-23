import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';
import type { Message } from '../data/messages';
import { FREE_FAVORITES_LIMIT, useApp } from '../lib/AppState';

export function MessageRow({ message }: { message: Message }) {
  const { favorites, toggleFavorite, premium } = useApp();
  const fav = favorites.includes(message.id);

  const onFav = () => {
    if (!fav && !premium && favorites.length >= FREE_FAVORITES_LIMIT) return router.push('/paywall');
    toggleFavorite(message.id);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.text}>{message.text}</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onFav} style={styles.action}>
          <Text style={[styles.actionText, fav && { color: colors.rose }]}>{fav ? 'Favoride' : 'Favori'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/share', params: { id: message.id } })}
          style={styles.action}
        >
          <Text style={styles.actionText}>Paylaş</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 8 },
  text: { fontFamily: fonts.displayRegular, fontSize: 19, lineHeight: 26, color: colors.ink },
  actions: { flexDirection: 'row', gap: 4, marginLeft: -10 },
  action: { minHeight: 44, paddingHorizontal: 10, justifyContent: 'center' },
  actionText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.muted },
});
