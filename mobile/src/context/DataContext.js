import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

const initialPrices = {
  diesel: [
    { location: "Атырау (нефтебаза)", price: "285 ₸/л" },
    { location: "Актобе (нефтебаза)", price: "290 ₸/л" },
    { location: "Шымкент (нефтебаза)", price: "303 ₸/л" }
  ],
  aviationAndPetrol: [
    { name: "Авиатопливо (Jet A-1)", price: "по запросу" },
    { name: "Бензин АИ-92", price: "225 ₸/л" },
    { name: "Бензин АИ-95", price: "235 ₸/л" }
  ],
  updatedAt: "18 мая 2026 года"
};

const initialMarketPrices = {
  fuels: ["Бензин", "Керосин", "Дизель", "Jet A-1"],
  sources: ["Сингапур", "Аргус", "Оптовая", "Розница"],
  prices: {
    "Бензин": { "Сингапур": "820 $", "Аргус": "810 $", "Оптовая": "240 000 ₸", "Розница": "225 ₸" },
    "Керосин": { "Сингапур": "890 $", "Аргус": "880 $", "Оптовая": "310 000 ₸", "Розница": "315 ₸" },
    "Дизель": { "Сингапур": "850 $", "Аргус": "845 $", "Оптовая": "285 000 ₸", "Розница": "295 ₸" },
    "Jet A-1": { "Сингапур": "910 $", "Аргус": "900 $", "Оптовая": "330 000 ₸", "Розница": "по запросу" }
  }
};

const initialNews = [
  { id: 1, title: "Модернизация нефтебазы JIG", content: "Поэтапная модернизация в соответствии с международными стандартами JIG 2 (issue 13, 2021). Установлено современное фильтровальное и наливное оборудование для обеспечения высокой чистоты топлива.", date: "2025-04-20", trending: 92 },
  { id: 2, title: "Практика студентов КазНУ", content: "Студенты 4-го курса КазНУ им. Аль-Фараби успешно прошли производственную практику на нашей нефтебазе, ознакомившись с передовыми технологиями контроля качества.", date: "2026-04-30", trending: 88 },
  { id: 3, title: "Меморандум с SCAT Airlines", content: "Соглашение о развитии инфраструктуры хранения авиатоплива Jet A-1 и расширении сети прямых поставок для воздушных судов.", date: "2024-04-30", trending: 75 },
  { id: 4, title: "Запуск Smart АЗС ION Energy", content: "Инновационный проект 'умных' АЗС на модульной основе с цифровыми сервисами самообслуживания и интеграцией в мобильную платформу.", date: "2025-03-15", trending: 94 }
];

const generateTanks = () => {
  const cities = [
    { name: "Astana", count: 5 },
    { name: "Almaty", count: 13 },
    { name: "Dostyk", count: 5 }
  ];
  const tanks = [];
  let id = 1;
  cities.forEach(city => {
    for (let i = 1; i <= city.count; i++) {
      const capacity = i % 2 === 0 ? 50000 : 75000;
      const current = Math.floor(capacity * (0.3 + (i * 0.05) % 0.65));
      tanks.push({
        id: id++,
        name: `Резервуар №${i}`,
        city: city.name,
        content: i % 3 === 0 ? "Авиатопливо Jet A-1" : i % 2 === 0 ? "Бензин АИ-95" : "Дизельное топливо",
        value: current,
        maxCapacity: capacity,
        lastUpdated: new Date().toISOString()
      });
    }
  });
  return tanks;
};

export const DataProvider = ({ children }) => {
  const [prices, setPrices] = useState(initialPrices);
  const [marketPrices, setMarketPrices] = useState(initialMarketPrices);
  const [news, setNews] = useState(initialNews);
  const [tanks, setTanks] = useState(generateTanks());
  const [changeLogs, setChangeLogs] = useState([
    { id: 1, user: "admin", action: "Инициализация системы Mercury Energy", time: new Date().toLocaleString() }
  ]);

  const logAction = (user, action) => {
    setChangeLogs(prev => [
      { id: Date.now(), user, action, time: new Date().toLocaleString() },
      ...prev
    ]);
  };

  const updatePrices = (newPrices, userName) => {
    setPrices(newPrices);
    logAction(userName || "Система", "Обновлены внутренние цены на топливо");
  };

  const updateMarketPrices = (newMarketPrices, userName) => {
    setMarketPrices(newMarketPrices);
    logAction(userName || "Система", "Обновлены рыночные котировки");
  };

  const addNews = (newsItem, userName) => {
    const item = {
      id: Date.now(),
      ...newsItem,
      date: new Date().toISOString().split('T')[0],
      trending: 80
    };
    setNews(prev => [item, ...prev]);
    logAction(userName || "Система", `Добавлена новость: ${newsItem.title}`);
  };

  const updateTank = (updatedTank, userName) => {
    setTanks(prev => prev.map(t => t.id === updatedTank.id ? updatedTank : t));
    logAction(userName || "Система", `Изменен уровень в ${updatedTank.name} (${updatedTank.city})`);
  };

  const addTank = (newTank, userName) => {
    const tank = {
      id: Date.now(),
      ...newTank,
      lastUpdated: new Date().toISOString()
    };
    setTanks(prev => [...prev, tank]);
    logAction(userName || "Система", `Добавлен ${newTank.name} в г. ${newTank.city}`);
  };

  return (
    <DataContext.Provider value={{
      prices,
      marketPrices,
      news,
      tanks,
      changeLogs,
      updatePrices,
      updateMarketPrices,
      addNews,
      updateTank,
      addTank,
      logAction
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
