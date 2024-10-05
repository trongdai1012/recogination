import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, ReactNode, FC} from 'react';
import {submitLogin} from '../api/submitLogin';

interface AuthContextProps {
  tenant: string;
  isLoggedIn: boolean | null;
  changeTenant: (val: string) => void;
  checkToken: () => void;
  login: (tenant: string, userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<{children: ReactNode}> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [tenant, setTenant] = useState<string>('');

  const changeTenant = (val: string) => {
    setTenant(val);
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const tenantStore = await AsyncStorage.getItem('tenantStore');
    if (!token || !tenantStore) {
      return setIsLoggedIn(false);
    }
    setTenant(tenantStore);
    setIsLoggedIn(true);
  };

  const login = async (
    tenantVal: string,
    userName: string,
    password: string,
  ) => {
    const data = await submitLogin(tenantVal, userName, password);
    setIsLoggedIn(true);
    setTenant(tenantVal);
    console.log('==data ==', data);

    await AsyncStorage.setItem('userToken', data.access_token);
    await AsyncStorage.setItem('tenantStore', tenantVal);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setTenant('');

    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('tenantStore');
  };

  return (
    <AuthContext.Provider
      value={{isLoggedIn, tenant, login, logout, checkToken, changeTenant}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
