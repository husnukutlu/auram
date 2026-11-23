import { MESSAGES, type Message } from '../data/messages';
import { topicById, type TopicId } from '../data/topics';
import type { Profile } from '../data/quiz';

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Small deterministic hash so the same day + slot always gives the same message. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Topics pulled in by mood and life stage, on top of the chosen goals. */
export function contextTopics(p: Profile): TopicId[] {
  const t: TopicId[] = [];
  if (p.mood === 'kaygili' || p.mood === 'yorgun') t.push('huzur');
  if (p.mood === 'kirgin') t.push('cesaret', 'ozdeger');
  if (p.mood === 'kararli') t.push('kariyer');
  if (p.mood === 'umutlu') t.push('yeni');
  if (p.lifeStage === 'anne' || p.lifeStage === 'anneAdayi') t.push('annelik');
  if (p.lifeStage === 'calisan' || p.lifeStage === 'ogrenci') t.push('kariyer');
  if (p.lifeStage === 'yeniSayfa') t.push('yeni');
  if (p.relationship === 'ayrilik') t.push('ask', 'cesaret');
  if (p.tone === 'spirituel') t.push('melek', 'disil');
  return t;
}

/** Topics a user may receive: everything for premium, free topics only otherwise. */
export function allowedTopics(premium: boolean): Set<TopicId> {
  return new Set(MESSAGES.map((m) => m.topic).filter((id) => premium || topicById(id).free));
}

/**
 * Picks the message for a given day and slot (0 = morning message).
 * Mix: 70% chosen goals, 20% mood and life stage, 10% 777 / gratitude.
 * Free users get only free topics; if a goal is premium, they get the free mix.
 */
export function pickMessage(p: Profile, date: Date, premium: boolean, slot = 0): Message {
  const allowed = allowedTopics(premium);
  const seed = hash(`${dayKey(date)}#${slot}#${p.name}`);
  const roll = seed % 100;
  const fresh: TopicId[] = ['melek', 'sukran', 'aldim'];

  let pool: TopicId[];
  if (roll < 70) pool = p.goals;
  else if (roll < 90) pool = contextTopics(p);
  else pool = fresh;

  pool = pool.filter((t) => allowed.has(t));
  if (pool.length === 0) pool = [...fresh, 'ozdeger'].filter((t) => allowed.has(t as TopicId)) as TopicId[];

  const candidates = MESSAGES.filter((m) => pool.includes(m.topic));
  // Beginners see the 777 explanations before the 369 writing exercises.
  const ordered =
    p.experience === 'yeni' ? candidates.filter((m) => m.topic !== 'yontem369') : candidates;
  const list = ordered.length > 0 ? ordered : candidates;
  return list[Math.floor(seed / 100) % list.length];
}

export const greeting = (d: Date) => {
  const h = d.getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
};
