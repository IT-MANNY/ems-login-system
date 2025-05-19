
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'user' | 'manager' | 'admin';

interface Employee {
  username: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  role: UserRole;
  managerUsername: string | null;
  startDate: string;
  active: boolean;
}

interface UserContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_USERS: Record<string, { password: string, userData: Employee }> = {
  'user1': {
    password: 'password1',
    userData: {
      username: 'user1',
      employeeId: 'EMP001',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      email: 'somchai@example.com',
      department: 'การตลาด',
      position: 'เจ้าหน้าที่การตลาด',
      role: 'user',
      managerUsername: 'manager1',
      startDate: '2023-01-15',
      active: true
    }
  },
  'manager1': {
    password: 'password2',
    userData: {
      username: 'manager1',
      employeeId: 'EMP002',
      firstName: 'สมศรี',
      lastName: 'รักงาน',
      email: 'somsri@example.com',
      department: 'การตลาด',
      position: 'ผู้จัดการการตลาด',
      role: 'manager',
      managerUsername: null,
      startDate: '2020-05-10',
      active: true
    }
  },
  'admin1': {
    password: 'password3',
    userData: {
      username: 'admin1',
      employeeId: 'EMP003',
      firstName: 'สุดา',
      lastName: 'บริหารดี',
      email: 'suda@example.com',
      department: 'บุคคล',
      position: 'ผู้ดูแลระบบ',
      role: 'admin',
      managerUsername: null,
      startDate: '2019-03-20',
      active: true
    }
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if there's a saved user in localStorage
  const savedUser = localStorage.getItem('ems_user');
  const [currentUser, setCurrentUser] = useState<Employee | null>(
    savedUser ? JSON.parse(savedUser) : null
  );

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS[username];
    if (user && user.password === password && user.userData.active) {
      setCurrentUser(user.userData);
      
      // Save to localStorage
      localStorage.setItem('ems_user', JSON.stringify(user.userData));
      
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${user.userData.firstName} ${user.userData.lastName}`,
      });
      
      return true;
    }
    
    toast({
      title: "เข้าสู่ระบบล้มเหลว",
      description: "Username หรือ Password ไม่ถูกต้อง",
      variant: "destructive"
    });
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ems_user');
    toast({
      title: "ออกจากระบบแล้ว",
      description: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
    });
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role || 
           (currentUser.role === 'admin' && (role === 'manager' || role === 'user')) ||
           (currentUser.role === 'manager' && role === 'user');
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would call an API to update the password
    // For demo purposes, we'll just validate the current password
    if (!currentUser) return false;
    
    const user = MOCK_USERS[currentUser.username];
    if (user && user.password === currentPassword) {
      // In demo, we don't actually update the password
      toast({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        description: "รหัสผ่านของคุณได้รับการอัปเดตแล้ว",
      });
      return true;
    }
    
    toast({
      title: "เปลี่ยนรหัสผ่านล้มเหลว",
      description: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
      variant: "destructive"
    });
    
    return false;
  };

  const value = {
    currentUser,
    isAuthenticated: currentUser !== null,
    login,
    logout,
    hasRole,
    updatePassword
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
