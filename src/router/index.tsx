import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ScreenName} from './ScreenName';
import Home from '../screens/home/Home';
import SignUp from '../screens/signUp/SignUp';
import Result from '../screens/result/Result';
import SignIn from '../screens/signIn/SignIn';
import Attendance from '../screens/attendance/Attendance';
import {RootStackParamList} from '../types';
import SplashScreen from '../screens/Splash';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import {useAuth} from '../context/AuthContext';
import PreSignUp from '../screens/preSignUp/PreSignUp';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigatior = () => {
  const {isLoggedIn} = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={ScreenName.SPLASH}>
      {isLoggedIn === null ? (
        <Stack.Screen name={ScreenName.SPLASH} component={SplashScreen} />
      ) : isLoggedIn ? (
        <>
          <Stack.Screen name={ScreenName.HOME_SCREEN} component={Home} />
          <Stack.Screen name={ScreenName.PRE_SIGN_UP} component={PreSignUp} />
          <Stack.Screen name={ScreenName.SIGN_UP} component={SignUp} />
          <Stack.Screen name={ScreenName.SIGN_IN} component={SignIn} />
          <Stack.Screen name={ScreenName.RESULT} component={Result} />
          <Stack.Screen name={ScreenName.ATTENDANCE} component={Attendance} />
        </>
      ) : (
        <Stack.Screen name={ScreenName.LOGIN} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigatior;
