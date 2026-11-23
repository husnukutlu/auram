import type { TopicId } from './topics';

export type Mood = 'umutlu' | 'yorgun' | 'kaygili' | 'kararli' | 'kirgin';
export type LifeStage = 'ogrenci' | 'calisan' | 'anne' | 'anneAdayi' | 'yeniSayfa';
export type Relationship = 'bekar' | 'iliski' | 'evli' | 'ayrilik' | 'gizli';
export type Tone = 'nazik' | 'guclu' | 'spirituel' | 'kisa';
export type Experience = 'yeni' | 'biraz' | 'hergun';

export type Profile = {
  name: string;
  goals: TopicId[];
  mood: Mood;
  lifeStage: LifeStage;
  relationship: Relationship;
  tone: Tone;
  experience: Experience;
  notifyHour: number;
  notifyMinute: number;
  perDay: 1 | 3 | 5;
};

type Option<T> = { value: T; label: string };

export const GOAL_OPTIONS: Option<TopicId>[] = [
  { value: 'ask', label: 'Aşk' },
  { value: 'bolluk', label: 'Bolluk & para' },
  { value: 'kariyer', label: 'Kariyer' },
  { value: 'ozsevgi', label: 'Öz sevgi' },
  { value: 'saglik', label: 'Sağlık' },
  { value: 'huzur', label: 'Huzur' },
  { value: 'annelik', label: 'Annelik' },
  { value: 'yeni', label: 'Yeni başlangıç' },
];

export const MOOD_OPTIONS: Option<Mood>[] = [
  { value: 'umutlu', label: 'Umutlu' },
  { value: 'yorgun', label: 'Yorgun' },
  { value: 'kaygili', label: 'Kaygılı' },
  { value: 'kararli', label: 'Kararlı' },
  { value: 'kirgin', label: 'Kırgın' },
];

export const LIFE_OPTIONS: Option<LifeStage>[] = [
  { value: 'ogrenci', label: 'Öğrenciyim' },
  { value: 'calisan', label: 'Çalışıyorum' },
  { value: 'anne', label: 'Anneyim' },
  { value: 'anneAdayi', label: 'Anne olmak istiyorum' },
  { value: 'yeniSayfa', label: 'Yeni bir sayfa açıyorum' },
];

export const REL_OPTIONS: Option<Relationship>[] = [
  { value: 'bekar', label: 'Bekarım' },
  { value: 'iliski', label: 'İlişkim var' },
  { value: 'evli', label: 'Evliyim' },
  { value: 'ayrilik', label: 'Ayrılık sürecindeyim' },
  { value: 'gizli', label: 'Söylemek istemiyorum' },
];

export const TONE_OPTIONS: Option<Tone>[] = [
  { value: 'nazik', label: 'Nazik ve sakin' },
  { value: 'guclu', label: 'Güçlü ve motive edici' },
  { value: 'spirituel', label: 'Spiritüel (evren, melek sayıları)' },
  { value: 'kisa', label: 'Kısa ve net' },
];

export const EXP_OPTIONS: Option<Experience>[] = [
  { value: 'yeni', label: 'Yeni başlıyorum' },
  { value: 'biraz', label: 'Biraz biliyorum' },
  { value: 'hergun', label: 'Her gün yapıyorum' },
];

export const TIME_OPTIONS = [7, 8, 9, 10, 12, 21];
export const PER_DAY_OPTIONS: (1 | 3 | 5)[] = [1, 3, 5];

export const MAX_GOALS = 3;
