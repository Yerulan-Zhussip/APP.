import { FuelPrices, MarketPrices, NewsItem, Tank, User, CityInfo } from '../types';

export const INITIAL_CITIES: CityInfo[] = [
  { name: 'Astana', label: 'Астана', count: 5 },
  { name: 'Almaty', label: 'Алматы', count: 13 },
  { name: 'Dostyk', label: 'Достык', count: 5 },
];

export const INITIAL_FUEL_PRICES: FuelPrices = {
  diesel: [
    { id: 'd1', location: 'Атырау (нефтебаза)', price: '285 ₸/л' },
    { id: 'd2', location: 'Актобе (нефтебаза)', price: '290 ₸/л' },
    { id: 'd3', location: 'Шымкент (нефтебаза)', price: '303 ₸/л' },
  ],
  aviationAndPetrol: [
    { id: 'p1', name: 'Авиатопливо (Jet A-1)', price: 'по запросу' },
    { id: 'p2', name: 'Бензин АИ-92', price: '225 ₸/л' },
    { id: 'p3', name: 'Бензин АИ-95', price: '235 ₸/л' },
  ],
  updatedAt: '18 мая 2026 года',
};

export const INITIAL_MARKET_PRICES: MarketPrices = {
  fuels: ['Бензин', 'Керосин', 'Дизель', 'Jet A-1'],
  sources: ['Сингапур', 'Аргус', 'Оптовая', 'Розница'],
  prices: {
    'Бензин': { 'Сингапур': '310 $', 'Аргус': '295 $', 'Оптовая': '225 ₸', 'Розница': '245 ₸' },
    'Керосин': { 'Сингапур': '450 $', 'Аргус': '430 $', 'Оптовая': '350 ₸', 'Розница': '380 ₸' },
    'Дизель': { 'Сингапур': '380 $', 'Аргус': '365 $', 'Оптовая': '285 ₸', 'Розница': '315 ₸' },
    'Jet A-1': { 'Сингапур': '480 $', 'Аргус': '460 $', 'Оптовая': 'по запросу', 'Розница': 'по запросу' },
  },
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Модернизация нефтебазы JIG',
    content: 'Поэтапная модернизация в соответствии с международными стандартами JIG 2 (issue 13, 2021). Установлено новое насосно-фильтровальное оборудование последнего поколения.',
    date: '2025-04-20',
    trending: 92,
    img: 'https://mercuryenergy.kz/upload/iblock/d7a/news.jpg',
  },
  {
    id: 2,
    title: 'Практика студентов КазНУ',
    content: 'Студенты 4-го курса КазНУ им. Аль-Фараби успешно прошли производственную практику на нефтебазе, изучив современные цифровые системы учёта топлива.',
    date: '2026-04-30',
    trending: 88,
    img: 'https://mercuryenergy.kz/upload/iblock/d7a/KZNU.jpeg',
  },
  {
    id: 3,
    title: 'Меморандум с SCAT Airlines',
    content: 'Подписано стратегическое соглашение о развитии инфраструктуры хранения авиатоплива Jet A-1 и расширении сети прямых заправок воздушных судов.',
    date: '2024-04-30',
    trending: 75,
    img: 'https://mercuryenergy.kz/scat.jpeg',
  },
  {
    id: 4,
    title: 'Запуск Smart АЗС ION Energy',
    content: 'Инновационный проект «умных» АЗС на модульной основе с полностью цифровыми решениями управления и бесконтактной оплатой.',
    date: '2025-03-15',
    trending: 94,
    img: 'https://mercuryenergy.kz/upload/iblock/4b9/AZSION2.png',
  },
];

export const generateInitialTanks = (): Tank[] => {
  const cities = [
    { name: 'Astana' as const, count: 5 },
    { name: 'Almaty' as const, count: 13 },
    { name: 'Dostyk' as const, count: 5 },
  ];
  const tanks: Tank[] = [];
  let id = 1;

  cities.forEach((city) => {
    for (let i = 1; i <= city.count; i++) {
      const fillRatio = 0.3 + (i * 0.13) % 0.65;
      const val = Math.floor(75000 * fillRatio);
      tanks.push({
        id: id++,
        name: `Резервуар №${i}`,
        city: city.name,
        content: 'Дизельное топливо',
        value: val,
        max: 75000,
        color:
          city.name === 'Astana'
            ? 'from-mercury-cyan to-mercury-steel'
            : city.name === 'Almaty'
            ? 'from-emerald-500 to-emerald-400'
            : 'from-purple-500 to-purple-400',
      });
    }
  });
  return tanks;
};

export const INITIAL_USERS: User[] = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
    firstName: 'Админ',
    lastName: 'Главный',
    position: 'Администратор системы',
    birthDate: '1985-01-01',
    cabinet: '101',
    photo: null,
    permissions: {
      viewTanks: 'all',
      canEditPrices: true,
      canEditTanks: true,
      canAddNews: true,
      canViewMarketPrices: true,
      canEditMarketPrices: true,
    },
    lastSeen: Date.now(),
  },
  {
    username: 'manager',
    password: '123',
    role: 'user',
    firstName: 'Максат',
    lastName: 'Аканович',
    position: 'Менеджер по поставкам',
    birthDate: '1990-05-12',
    cabinet: '204',
    photo: null,
    permissions: {
      viewTanks: 'all',
      canEditPrices: false,
      canEditTanks: false,
      canAddNews: true,
      canViewMarketPrices: true,
      canEditMarketPrices: false,
    },
    lastSeen: Date.now() - 3600000,
  },
];

export const COMPANY_INFO = {
  name: 'Mercury Energy',
  subtext: 'From the endless steppes to the eternal sky',
  tagline: 'Smart Mercury Energy Management',
  description:
    'Mercury Energy — ведущий оператор инфраструктуры хранения, логистики и заправки топливом в Казахстане. Мы предоставляем высококлассный сервис и передовые цифровые технологии мониторинга для авиации и коммерческого транспорта.',
  leadership: [
    {
      name: 'Максат Аканович',
      title: 'Генеральный директор',
      bio: 'Более 15 лет опыта в нефтегазовом секторе и управлении крупными инфраструктурными объектами.',
    },
    {
      name: 'Талгат Тажибаев',
      title: 'Технический директор',
      bio: 'Эксперт по модернизации нефтебаз и внедрению международных стандартов JIG.',
    },
    {
      name: 'Вера Шашкова',
      title: 'Директор по развитию',
      bio: 'Руководит цифровой трансформацией и международными партнерскими программами.',
    },
  ],
  contacts: {
    address: 'г. Алматы, пр. Аль-Фараби 77/7, Бизнес-центр "Esentai Tower"',
    phone: '+7 (727) 355-88-00',
    email: 'info@mercuryenergy.kz',
    hours: 'Пн - Пт: 09:00 - 18:00',
  },
};

// Math utilities
export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) res = (res * (n - i + 1)) / i;
  return Math.round(res);
}

export function bernoulliProbability(n: number, k: number, p: number): number {
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}
