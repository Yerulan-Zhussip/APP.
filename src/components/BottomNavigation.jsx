import React from 'react';
import { Home, Menu, ShoppingBag, User } from 'lucide-react';

export default function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    {
      id: 'home',
      label: 'Главное',
      icon: Home,
    },
    {
      id: 'catalog',
      label: 'Каталог',
      icon: Menu,
    },
    {
      id: 'cart',
      label: 'Корзина',
      icon: ShoppingBag,
    },
    {
      id: 'account',
      label: 'Аккаунт',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 px-4 bg-transparent">
      <nav className="w-full max-w-md bg-amber-400 rounded-2xl shadow-lg shadow-amber-300/40 px-3 py-2 flex items-center justify-around border border-amber-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-500/30 text-gray-900 font-semibold scale-105'
                  : 'text-amber-950/80 hover:text-black hover:bg-amber-300/40'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-xs mt-1 font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
