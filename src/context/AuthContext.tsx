import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => { success: boolean; message: string; role?: Role };
  register: (data: { name: string; email: string; phone: string; address?: string; password?: string }) => { success: boolean; message: string };
  logout: () => void;
  switchDemoRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bdp_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bdp_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default logged in as demo user for immediate browsing convenience
    return INITIAL_USERS[1]; // Budi Santoso (user)
  });

  useEffect(() => {
    localStorage.setItem('bdp_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bdp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bdp_current_user');
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check demo credentials
    if (normalizedEmail === 'admin@banten.com') {
      if (pass === 'admin123') {
        const adminUser = users.find(u => u.email.toLowerCase() === 'admin@banten.com') || INITIAL_USERS[0];
        setCurrentUser(adminUser);
        return { success: true, message: 'Selamat datang kembali, Admin Percetakan!', role: adminUser.role };
      } else {
        return { success: false, message: 'Password admin salah (Gunakan: admin123)' };
      }
    }

    if (normalizedEmail === 'user@banten.com') {
      if (pass === 'user123') {
        const demoUser = users.find(u => u.email.toLowerCase() === 'user@banten.com') || INITIAL_USERS[1];
        setCurrentUser(demoUser);
        return { success: true, message: 'Login berhasil! Selamat datang, ' + demoUser.name, role: demoUser.role };
      } else {
        return { success: false, message: 'Password user salah (Gunakan: user123)' };
      }
    }

    // Check custom registered users
    const matched = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (matched) {
      // Allow login for registered dummy accounts with standard or any password for simplicity
      setCurrentUser(matched);
      return { success: true, message: 'Login berhasil! Selamat datang, ' + matched.name, role: matched.role };
    }

    return { success: false, message: 'Akun tidak ditemukan. Silakan registrasi terlebih dahulu atau gunakan akun demo.' };
  };

  const register = (data: { name: string; email: string; phone: string; address?: string; password?: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: data.name.trim(),
      email: normalizedEmail,
      role: 'user',
      phone: data.phone.trim(),
      address: data.address?.trim() || 'Kota Serang, Banten',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Pendaftaran berhasil! Akun Anda telah aktif.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoRole = (targetRole: Role) => {
    if (targetRole === 'admin') {
      const admin = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(admin);
    } else {
      const user = users.find(u => u.email === 'user@banten.com') || INITIAL_USERS[1];
      setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
