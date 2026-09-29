import React, { useState } from 'react';
import CompanyLogo from './components/CompanyLogo';
import BottomNavigation from './components/BottomNavigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 mb-20">
        {activeTab === 'home' && <CompanyLogo />}

        {activeTab === 'catalog' && (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Каталог</h2>
            <p className="text-gray-500">Здесь будет отображаться каталог товаров</p>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Корзина</h2>
            <p className="text-gray-500">Ваша корзина пока пуста</p>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Аккаунт</h2>
            <p className="text-gray-500">Профиль пользователя и настройки</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
