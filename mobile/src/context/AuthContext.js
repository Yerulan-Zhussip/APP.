import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const defaultUser = {
  username: "admin",
  password: "admin",
  role: "admin",
  firstName: "Админ",
  lastName: "Главный",
  position: "Администратор",
  birthDate: "1985-01-01",
  cabinet: "101",
  photo: null,
  permissions: {
    viewTanks: "all",
    canEditPrices: true,
    canEditTanks: true,
    canAddNews: true,
    canViewMarketPrices: true,
    canEditMarketPrices: true
  },
  lastSeen: Date.now()
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [users, setUsers] = useState([defaultUser]);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      const updated = { ...found, lastSeen: Date.now() };
      setCurrentUser(updated);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.username === updatedUser.username ? updatedUser : u));
    if (currentUser?.username === updatedUser.username) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (username) => {
    setUsers(prev => prev.filter(u => u.username !== username));
    if (currentUser?.username === username) {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
