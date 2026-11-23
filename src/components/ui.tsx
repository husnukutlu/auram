import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'light' | 'outline';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
};

export function Button({ label, onPress, variant = 'primary', disabled, style, icon }: ButtonProps) {
  const bg = variant === 'primary' ? colors.rose : colors.white;
  const fg = variant === 'primary' ? colors.white : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

type ChipProps = { label: string; selected: boolean; onPress: () => void; style?: StyleProp<ViewStyle> };

export function Chip({ label, selected, onPress, style }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff, style]}
    >
      <Text style={[styles.chipText, { color: selected ? colors.white : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  outline: { borderWidth: 1, borderColor: colors.border },
  buttonText: { fontFamily: fonts.semibold, fontSize: 16 },
  chip: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  chipOn: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipOff: { backgroundColor: colors.white, borderColor: colors.border },
  chipText: { fontFamily: fonts.medium, fontSize: 15, textAlign: 'center' },
});
