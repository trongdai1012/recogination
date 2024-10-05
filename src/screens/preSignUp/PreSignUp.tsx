import React, {useMemo, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import NavigationService from '../../router/NavigationService';
import {ScreenName} from '../../router/ScreenName';
import {useAuth} from '../../context/AuthContext';
import {useLoading} from '../../context/Loading';
import {getUserDetailByUserName} from '../../api/getUserDetailByUserName';
// import AutocompleteInput from 'react-native-autocomplete-input';
// import {useQuery} from 'react-query';
// import {getListEmployee} from '../../api/getListEmployee';

export default function PreSignUp() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState({username: false});
  const {tenant} = useAuth();
  const {setLoading} = useLoading();

  const canNext = useMemo(() => username && fullName, [username, fullName]);
  // const [query, setQuery] = useState<string>('');

  // const {data, refetch} = useQuery('all-employee', () => getListEmployee(), {
  //   enabled: false,
  // });

  // console.log('==data 33==', data);

  // useEffect(() => {
  //   refetch();
  // }, [refetch]);

  const handleContinue = () => {
    if (!tenant) {
      Alert.alert(
        'Lỗi',
        'Không lấy được thông tin tenant, Vui lòng đăng nhập lại',
      );
      return;
    }
    if (username === '') {
      setError({
        username: username === '',
      });
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    console.log('Username:', username);
    console.log('Tenant:', tenant);
    NavigationService.navigate(ScreenName.SIGN_UP, {
      tenant: tenant,
      username: username,
    });
  };

  const resetInput = () => {
    setFullName('');
    setEmail('');
  };

  const onChangeEndUserName = async () => {
    if (!username) {
      return resetInput();
    }
    setLoading(true);
    try {
      const data = await getUserDetailByUserName(username);
      setLoading(false);
      setFullName(data.result.fullName ?? '');
      setEmail(data.result.email ?? '');
    } catch (err) {
      setLoading(false);
    }
  };
  console.log('==canNext==', canNext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký khuôn mặt</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            {/* <AutocompleteInput
              data={
                data?.filter((item: any) =>
                  item.username.toLowerCase().includes(query.toLowerCase()),
                ) ?? []
              }
              defaultValue={query}
              onChangeText={setQuery}
              onSelectionChange={onChangeEndUserName}
              style={[styles.input, error.username && styles.inputError]}
              flatListProps={{
                keyExtractor: item => item.username,
                renderItem: ({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setQuery(item.username);
                      setUsername(item.username);
                    }}>
                    <Text>{item.fullName}</Text>
                  </TouchableOpacity>
                ),
              }}
            /> */}
            <TextInput
              style={[styles.input, error.username && styles.inputError]}
              placeholder="Enter your username"
              value={username}
              onChangeText={val => {
                setFullName('');
                setEmail('');
                setUsername(val);
              }}
              onEndEditing={onChangeEndUserName}
            />
            {error.username && (
              <Text style={styles.errorText}>
                Vui lòng nhập tài khoản nhân viên
              </Text>
            )}
            {/* <TextInput
              style={[styles.input, error.username && styles.inputError]}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              onEndEditing={onChangeEndUserName}
            />
             */}

            <Text style={styles.label}>Tenant</Text>
            <TextInput
              style={[styles.input, styles.backgroundDisable]}
              value={tenant}
              editable={false}
            />
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, styles.backgroundDisable]}
              value={fullName}
              editable={false}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.backgroundDisable]}
              value={email}
              editable={false}
            />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={!canNext}
            onPress={handleContinue}
            style={[styles.nextBtn, !canNext && styles.backgroundDisable]}>
            <Text style={[styles.nextBtnText, !canNext && styles.inputDisable]}>
              Tiếp tục đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 18,
    height: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  form: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  backgroundDisable: {
    backgroundColor: '#e0e0E0',
  },
  inputDisable: {
    color: '#a0a0a0',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nextBtn: {
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  nextBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
});
