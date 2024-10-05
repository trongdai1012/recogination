import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useLoading} from '../../context/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [tenant, setTenant] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const {login} = useAuth();
  const {setLoading} = useLoading();

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('savedUsername');
      const tenantStore = await AsyncStorage.getItem('tenantStore');
      if (savedUsername && tenantStore) {
        setTenant(tenantStore);
        setUsername(savedUsername);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Failed to load username:', error);
    }
  };

  const saveUsername = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('savedUsername', username);
        await AsyncStorage.setItem('tenantStore', tenant);
      } else {
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('tenantStore');
      }
    } catch (error) {
      console.error('Failed to save username:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(tenant, username, password);
      saveUsername();
      setLoading(false);
    } catch (err) {
      Alert.alert('Đăng nhập thất bại', 'Thông tin đã nhập không chính xác');
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Tenant"
          value={tenant}
          onChangeText={setTenant}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <Image
                source={require('../../assets/icons/visible.png')}
                style={styles.eyeIcon}
              />
            ) : (
              <Image
                source={require('../../assets/icons/hide.png')}
                style={styles.eyeIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.checkboxContainer}>
            <View
              style={[
                styles.checkbox,
                rememberMe ? styles.checkboxChecked : null,
              ]}
            />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </TouchableOpacity>
        </View>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
  },
  logo: {
    width: 160,
    height: 35,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 5,
    top: 2,
    padding: 5,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  rememberMeContainer: {
    width: '100%', // Đảm bảo container chiếm hết chiều ngang
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  loginButton: {
    width: '100%', // Chiếm hết chiều ngang màn hình
    backgroundColor: '#007AFF',
    padding: 15, // Tăng kích thước của nút
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
