import React from 'react';
import 'react-native-devsettings';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigatior from './src/router';
import NavigationService from './src/router/NavigationService';
import {AuthProvider} from './src/context/AuthContext';
import {LoadingProvider} from './src/context/Loading';
import {QueryClient, QueryClientProvider} from 'react-query';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <NavigationContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}>
            <RootNavigatior />
            <Toast />
          </NavigationContainer>
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
