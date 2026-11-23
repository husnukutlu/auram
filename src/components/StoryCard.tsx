import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import type { Message } from '../data/messages';

/** Splits "777 — text" into a big number and the message body. */
function splitAngel(text: string): { number: string | null; body: string } {
  const m = text.match(/^(\d{3,4})\s+—\s+(.*)$/);
  return m ? { number: m[1], body: m[2] } : { number: null, body: text };
}

/**
 * 9:16 Instagram story card. Rendered at a fixed logical size and captured
 * at 1080x1920 by react-native-view-shot.
 */
export type StoryCardRef = ComponentRef<typeof View>;

export function StoryCard({ message, width, ref }: { message: Message; width: number; ref?: Ref<StoryCardRef> }) {
  const { number, body } = splitAngel(message.text);
  const s = width / 390;
  const showReceive = message.topic === 'aldim' || message.topic === 'melek';
  return (
    <View ref={ref} collapsable={false} style={[styles.card, { width, height: width * (16 / 9), padding: 36 * s }]}>
      <Text style={[styles.number, { fontSize: 96 * s }]}>{number ?? '✦'}</Text>
      <View style={{ alignItems: 'center', gap: 24 * s }}>
        <View style={[styles.rule, { width: 48 * s }]} />
        <Text style={[styles.body, { fontSize: 32 * s, lineHeight: 42 * s }]}>{body}</Text>
        <View style={[styles.rule, { width: 48 * s }]} />
        {showReceive && (
          <Text style={[styles.hint, { fontSize: 15 * s, lineHeight: 22 * s }]}>
            Bu mesaj sana geldiyse, senin içindir.{'\n'}Yoruma "aldım kabul ettim" yaz.
          </Text>
        )}
      </View>
      <View style={{ alignItems: 'center', gap: 4 * s }}>
        <Text style={[styles.brand, { fontSize: 22 * s }]}>AURAM</Text>
        <Text style={[styles.handle, { fontSize: 12 * s }]}>@auram.app</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'space-between' },
  number: { fontFamily: fonts.display, color: colors.gold, letterSpacing: 3 },
  rule: { height: 1, backgroundColor: colors.gold },
  body: { fontFamily: fonts.displayRegular, color: colors.white, textAlign: 'center' },
  hint: { fontFamily: fonts.body, color: colors.roseSoft, textAlign: 'center' },
  brand: { fontFamily: fonts.display, color: colors.white, letterSpacing: 3 },
  handle: { fontFamily: fonts.body, color: colors.roseSoft },
});
