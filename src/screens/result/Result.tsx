import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import NavigationService from '../../router/NavigationService';
import IconBack from '../../assets/svg/icon_back.svg';
import {ImageDetectFace} from '../signUp/SignUp';
import {submitRegistrationFace} from '../../api/submitRegistrationFace';
import {generateUUID} from '../../utils';
import {useLoading} from '../../context/Loading';
import {ScreenName} from '../../router/ScreenName';
import {showToast} from '../../services/showToast';

type ParamType = {
  dataImage: ImageDetectFace[];
  username: string;
  tenant: string;
};

export default function Result({route}: any) {
  const {setLoading} = useLoading();
  const param: ParamType = useMemo(() => {
    const params = route?.params;
    if (!params || !params.dataImage) {
      showToast('error', 'Không tìm thấy hình ảnh.');
      return {dataImage: []};
    }
    return params;
  }, [route]);

  const handleSubmit = async () => {
    const formData = new FormData();
    const randomId = generateUUID();
    for (let i = 0; i < param.dataImage.length; i++) {
      const file = {
        uri: param.dataImage[i].uri,
        name: `image_${randomId}_${i}.jpg`,
        type: 'image/jpeg',
      };
      formData.append('file', file);
    }
    formData.append('username', param.username);
    formData.append('tenant', param.tenant);
    setLoading(true);
    submitRegistrationFace(formData)
      .then(res => {
        if (res?.result?.username) {
          NavigationService.navigate(ScreenName.HOME_SCREEN);
          showToast(
            'success',
            `Đăng ký thành công: ${res.result.username}-${res.result.fullName}.`,
          );
        } else {
          showToast('error', 'Đăng ký thất bại, vui lòng thử lại');
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        showToast('error', 'Đăng ký thất bại, vui lòng thử lại');
        console.log('Error submitting images:', JSON.stringify(err));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.goBack();
          }}>
          <IconBack />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Kết quả</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {param.dataImage.map((item, index) => (
          <RenderItem
            key={`${item.gesture}_${index}`}
            gesture={item.gesture}
            uri={item.uri}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.buttonSaveToLib} onPress={handleSubmit}>
        <Text style={styles.txtButtonSaveToLib}>Đăng ký khuôn mặt</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

type RenderItemProps = {
  gesture: string;
  uri: string;
};

const RenderItem: React.FC<RenderItemProps> = ({gesture, uri}) => {
  if (!uri) {
    return null;
  }
  return (
    <View style={styles.itemContent}>
      <View style={styles.gesture}>
        <Text style={styles.txtGesture}>{gesture}</Text>
      </View>
      <Image
        source={{
          uri: uri,
        }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  txtHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listContainer: {flex: 1},
  itemContent: {
    flexDirection: 'row',
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 15,
    resizeMode: 'contain',
  },
  gesture: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtGesture: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonSaveToLib: {
    backgroundColor: '#0088CC',
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtButtonSaveToLib: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
