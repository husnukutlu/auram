import { Redirect } from 'expo-router';
import { useApp } from '../lib/AppState';

export default function Index() {
  const { profile } = useApp();
  return <Redirect href={profile ? '/(tabs)' : '/onboarding'} />;
}
