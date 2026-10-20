import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FuelPrices, MarketPrices, NewsItem, Tank, User, AuditLog, CityName } from '../types';
import {
  INITIAL_FUEL_PRICES,
  INITIAL_MARKET_PRICES,
  INITIAL_NEWS,
  generateInitialTanks,
  INITIAL_USERS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  fuelPrices: FuelPrices;
  updateFuelPrices: (newPrices: FuelPrices) => void;
  marketPrices: MarketPrices;
  updateMarketPrices: (newMarket: MarketPrices) => void;
  news: NewsItem[];
  addNews: (newsItem: Omit<NewsItem, 'id' | 'date' | 'trending'>) => void;
  tanks: Tank[];
  updateTankValue: (id: number, value: number) => void;
  logs: AuditLog[];
  addLog: (action: string, details: string) => void;
  selectedCity: CityName | 'All';
  setSelectedCity: (city: CityName | 'All') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default logged in as Admin for full experience
  const [fuelPrices, setFuelPrices] = useState<FuelPrices>(INITIAL_FUEL_PRICES);
  const [marketPrices, setMarketPrices] = useState<MarketPrices>(INITIAL_MARKET_PRICES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [tanks, setTanks] = useState<Tank[]>(generateInitialTanks());
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');

  const addLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Гость',
      action,
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const login = (username: string, pass: string): boolean => {
    const found = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === pass
    );
    if (found) {
      setCurrentUser(found);
      addLog('Вход', `Пользователь ${found.username} вошел в систему`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addLog('Выход', `Пользователь ${currentUser.username} вышел`);
    }
    setCurrentUser(null);
  };

  const updateFuelPrices = (newPrices: FuelPrices) => {
    setFuelPrices(newPrices);
    addLog('Изменение цен', 'Обновлены топливные цены');
  };

  const updateMarketPrices = (newMarket: MarketPrices) => {
    setMarketPrices(newMarket);
    addLog('Рыночные цены', 'Обновлены рыночные котировки');
  };

  const addNews = (newsItem: Omit<NewsItem, 'id' | 'date' | 'trending'>) => {
    const newItem: NewsItem = {
      ...newsItem,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      trending: Math.floor(Math.random() * 20) + 80,
    };
    setNews((prev) => [newItem, ...prev]);
    addLog('Публикация новости', `Добавлена новость: ${newItem.title}`);
  };

  const updateTankValue = (id: number, value: number) => {
    setTanks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, value: Math.min(value, t.max) } : t))
    );
    addLog('Резервуары', `Обновлен уровень резервуара №${id}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        fuelPrices,
        updateFuelPrices,
        marketPrices,
        updateMarketPrices,
        news,
        addNews,
        tanks,
        updateTankValue,
        logs,
        addLog,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
