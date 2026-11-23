export type TopicId =
  | 'melek'
  | 'aldim'
  | 'yontem369'
  | 'ozdeger'
  | 'ozsevgi'
  | 'ask'
  | 'bolluk'
  | 'kariyer'
  | 'saglik'
  | 'huzur'
  | 'disil'
  | 'annelik'
  | 'sukran'
  | 'yeni'
  | 'cesaret';

export type Topic = {
  id: TopicId;
  title: string;
  description: string;
  free: boolean;
};

export const TOPICS: Topic[] = [
  { id: 'melek', title: '777 & Melek Sayıları', description: '111, 222, 333, 444, 555, 777 ve anlamları', free: true },
  { id: 'aldim', title: 'Aldım, Kabul Ettim', description: 'Paylaşmaya hazır kısa olumlamalar', free: true },
  { id: 'yontem369', title: '369 Yöntemi', description: 'Sabah 3, öğle 6, akşam 9 kez yaz', free: false },
  { id: 'ozdeger', title: 'Öz Değer', description: 'Değerli ve yeterli hissetmek', free: true },
  { id: 'ozsevgi', title: 'Öz Sevgi & Beden', description: 'Bedenle barış, öz bakım', free: false },
  { id: 'ask', title: 'Aşk & İlişki', description: 'Aşkı çekmek, sağlıklı ilişkiler, iyileşmek', free: false },
  { id: 'bolluk', title: 'Bolluk & Bereket', description: 'Para, bolluk, maddi özgürlük', free: false },
  { id: 'kariyer', title: 'Kariyer & Başarı', description: 'İş, kendi işin, görünür olmak', free: false },
  { id: 'saglik', title: 'Sağlık & Enerji', description: 'Sağlık, uyku, canlılık', free: false },
  { id: 'huzur', title: 'İç Huzur', description: 'Kaygı, fazla düşünme, sakinlik', free: false },
  { id: 'disil', title: 'Dişil Enerji', description: 'Yumuşaklık, sezgi, almaya açık olmak', free: false },
  { id: 'annelik', title: 'Annelik', description: 'Anneler, anne adayları, çocuk dileği', free: false },
  { id: 'sukran', title: 'Şükran', description: 'Günlük şükran', free: true },
  { id: 'yeni', title: 'Yeni Başlangıçlar & Yeni Ay', description: 'Yeni ay, yeni yıl, yeniden başlamak', free: false },
  { id: 'cesaret', title: 'Cesaret & Sınırlar', description: 'Hayır demek, kendini savunmak', free: false },
];

export const topicById = (id: TopicId): Topic => TOPICS.find((t) => t.id === id)!;
