import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import NavigationService from '../../router/NavigationService';
import IconBack from '../../assets/svg/icon_back.svg';
import {ImageDetectFace} from '../signUp/SignUp';
import {submitRegistrationFace} from '../../api/submitRegistrationFace';
import {generateUUID} from '../../utils';

type ParamType = {
  dataImage: ImageDetectFace[];
  username: string;
  tenant: string;
};

export default function Result({route}: any) {
  console.log('==route==', route);

  const param: ParamType = useMemo(() => {
    const params = route?.params;
    if (!params || !params.dataImage) {
      Alert.alert('Thất bại', 'No face images found!');
      return {dataImage: []};
    }
    return params;
  }, [route]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      console.log('==randomId zz==');
      const randomId = generateUUID();
      console.log('==param==', param);
      for (let i = 0; i < param.dataImage.length; i++) {
        const file = {
          uri: param.dataImage[i].uri,
          name: `image_${randomId}_${i}.jpg`,
          type: 'image/jpeg',
        };
        formData.append('file', file);
        console.log(`Adding file ${i}:`, file);
      }
      formData.append('username', param.username);
      formData.append('tenant', param.tenant);

      console.log('==formData==', formData);
      const response = await submitRegistrationFace(formData);
      if (response.status === 200) {
        Alert.alert('Thành công', 'Face images submitted successfully!');
      } else {
        throw new Error('Failed to submit images');
      }
    } catch (error) {
      Alert.alert('Thất bại', 'Unable to submit face images.');
      console.error('Error submitting images:', error);
    }
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
        {/* <View style={{width: 24, height: 24}} /> */}
      </View>
      <ScrollView style={styles.listContainer}>
        {param.dataImage.map((item, index) => (
          <RenderItem
            key={`${item.gesture}_${index}`}
            gesture={item.gesture}
            uri={item.uri}
          />
        ))}
        {/* <View style={{height: 50}} /> */}
      </ScrollView>
      <TouchableOpacity style={styles.buttonSaveToLib} onPress={handleSubmit}>
        <Text style={styles.txtButtonSaveToLib}>Submit Face</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Di chuyển RenderItem ra ngoài component chính
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
