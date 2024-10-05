import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useAuth} from '../../context/AuthContext';

export default function SplashScreen() {
  const {checkToken} = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkToken();
    }, 3000);

    return () => clearTimeout(timer);
  }, [checkToken]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>M2M Solution</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  logo: {
    width: 250,
    height: 56,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginTop: 20,
  },
});
