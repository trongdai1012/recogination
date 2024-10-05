import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import NavigationService from '../../router/NavigationService';
import {ScreenName} from '../../router/ScreenName';
import {useAuth} from '../../context/AuthContext';

export default function Home() {
  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(ScreenName.PRE_SIGN_UP);
        }}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Đăng ký dữ liệu khuôn mặt</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => {
          NavigationService.navigate(ScreenName.SIGN_IN);
        }}>
        <View style={styles.contentbtnSecondary}>
          <Text style={styles.btnSecondaryText}>Checkin/Checkout</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => {
          NavigationService.navigate(ScreenName.ATTENDANCE);
        }}>
        <View style={styles.contentbtnSecondary}>
          <Text style={styles.btnSecondaryText}>Chấm công nhanh</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <View style={styles.contentbtnLogout}>
          <Text style={styles.btnLogoutText}>Đăng xuất</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#e8ecf4',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#000',
    borderColor: '#000',
  },
  btnSecondary: {
    marginTop: 30,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  contentbtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000',
  },
  btnLogout: {
    marginTop: 30,
  },
  contentbtnLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
  },
  btnLogoutText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
