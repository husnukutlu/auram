# Auram

Daily manifestation and affirmation app for women, in Turkish. Built with Expo (SDK 58), Expo Router and TypeScript.

## What's in the MVP

- **Onboarding quiz** (8 questions): name, up to 3 goals, mood, life stage, relationship, tone, experience, notification time.
- **Today screen**: one personalized message a day (70% goals, 20% mood and life stage, 10% 777 or gratitude), streak, favorites.
- **15 topics, 150 messages** in `src/data/messages.ts`. Free: 777, Aldım kabul ettim, Öz değer, Şükran. The rest are Premium.
- **Daily notifications**: a rolling week of personalized local notifications, refreshed on every app open (`src/lib/notifications.ts`).
- **Instagram story card**: 1080×1920 PNG via `react-native-view-shot` + `expo-sharing`.
- **Paywall**: ₺79,99 monthly, ₺499,99 yearly (7-day trial), ₺2.499,99 lifetime.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone. Local notifications work in Expo Go.

## Before release

1. **Purchases**: `src/lib/purchases.ts` simulates buying with a local flag. Replace it with RevenueCat (`react-native-purchases`) and create the products `auram_premium_monthly`, `auram_premium_yearly`, `auram_premium_lifetime` in App Store Connect and Google Play Console. This needs a development build (`npx eas-cli@latest build --profile development`).
2. **Identifiers**: `app.json` uses `app.auram.ios` and `app.auram` as placeholders. Change them to your own.
3. **Icon and splash**: replace the default images in `assets/`.
4. **Story backgrounds**: add the topic image library (planned) to `StoryCard`.

## Project layout

```
src/app/            routes (Expo Router)
  onboarding.tsx    quiz
  (tabs)/           Bugün, Konular, Favoriler, Ayarlar
  topic/[id].tsx    messages in a topic
  share.tsx         story card + share
  paywall.tsx       premium plans
src/data/           topics, messages, quiz options
src/lib/            storage, message picker, notifications, purchases, app state
src/components/     buttons, chips, story card, message row
```
