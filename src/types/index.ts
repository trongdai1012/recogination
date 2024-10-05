import {ImageDetectFace} from '../screens/signUp/SignUp';

export type RootStackParamList = {
  Splash: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  PreSignUp: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Login: undefined;
  Result: {dataImage: ImageDetectFace[]};
  Attendance: undefined;
};
