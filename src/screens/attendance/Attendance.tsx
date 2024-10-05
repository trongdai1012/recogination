import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {Face, RNCamera} from 'react-native-camera';
import FaceDetected from '../../component/FaceDetected';
import MaskFace from '../../component/MaskFace';
import ImageEditor from '@react-native-community/image-editor';
import sizes from '../../res/sizes';
import _ from 'lodash';
import {
  checkFaceFrontValidSigin,
  checkFaceValidSigin,
} from '../signIn/service/checkFace';
import {generateUUID} from '../../utils';
import {submitRecoginationFace} from '../../api/submitRecoginationFace';
import {useAuth} from '../../context/AuthContext';
const {width, height} = Dimensions.get('window');

type ImageInfo = {
  uri: string;
};

export default function Attendance() {
  const cameraRef: any = useRef();
  const [faceInfo, setFaceInfo] = useState<Face | undefined>();

  const imageDetectFace = useRef<ImageInfo[]>([]);
  const isPending = useRef<boolean>(false);
  const isFace = useRef<boolean>(false);
  const isValid = useRef<boolean>(false);
  const isEnd = useRef<boolean>(false);
  const {tenant} = useAuth();

  const handleSubmit = useCallback(
    async (uri: string) => {
      const formData = new FormData();

      const randomId = generateUUID();
      const file = {
        uri: uri,
        name: `image_${randomId}.jpg`,
        type: 'image/jpeg',
      };
      formData.append('file', file);
      formData.append('tenant', tenant);

      console.log('==formData.getAll()==', formData.getAll());

      const response = await submitRecoginationFace(formData);
      if (response.status === 200) {
        Alert.alert('Thành công', 'Face images submitted successfully!');
      } else {
        throw new Error('Failed to submit images');
      }
    },
    [tenant],
  );

  const handleTakePicture = useCallback(
    async (faceData: Face) => {
      try {
        const options = {
          width: 1080,
          height: 1440,
          quality: 0.4,
          orientation: 'portrait',
          fixOrientation: true,
          mirrorImage: true,
          base64: true,
        };
        const data = await cameraRef?.current?.takePictureAsync(options);
        const initValue = 1080 / width;
        const centerPoint = {
          x: faceData.noseBasePosition?.x,
          y: faceData.noseBasePosition?.y,
        };
        const radian =
          Platform.OS === 'ios'
            ? (faceData.bounds.size.height / 2) * 1.5
            : sizes._160;
        let offsetX = 0;
        if (!!centerPoint.x && centerPoint.x + radian > width) {
          offsetX = width - radian * 2;
        } else if (!!centerPoint.x && centerPoint.x - radian > 0) {
          offsetX = centerPoint.x - radian;
        }
        let offsetY = centerPoint.y ? centerPoint.y - radian * 1.1 : 0;
        if (data.uri) {
          const imageCrop = await ImageEditor.cropImage(data.uri, {
            offset: {
              x: Math.round(offsetX * initValue),
              y: Math.round(offsetY * initValue),
            },
            size: {
              width: radian * 2 * initValue,
              height: radian * 2 * initValue,
            },
            displaySize: {
              width: 480,
              height: 480,
            },
          });

          await handleSubmit(imageCrop.uri);
          console.log('==pass==', imageCrop.uri);

          imageDetectFace.current.unshift({
            uri: imageCrop.uri,
          });
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Chấm công thất bại.');
        console.error('Error submitting images:', error);
      }
      isPending.current = false;
    },
    [handleSubmit],
  );

  const handleTakePictureStep = useCallback(
    (faces: Face) => {
      if (!isPending.current && !isEnd.current) {
        isPending.current = true;
        handleTakePicture(faces);
      }
    },
    [handleTakePicture],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFacesDetected = useCallback(
    _.throttle((faces: Face) => {
      const faceValid = checkFaceValidSigin(faces);
      isValid.current = faceValid;
      if (faceValid) {
        const isFrontGestureValid = checkFaceFrontValidSigin(faces);
        if (isFrontGestureValid) {
          handleTakePictureStep(faces);
        }
      }
    }, 350),
    [],
  );

  const onFacesDetected = useCallback(
    (response: {faces: Face[]}) => {
      if (response.faces[0]) {
        setFaceInfo(response.faces[0]);
        isFace.current = true;
        handleFacesDetected(response.faces[0]);
      } else {
        isFace.current = false;
        isValid.current = false;
        setFaceInfo(undefined);
      }
    },
    [handleFacesDetected],
  );

  const _renderItem = ({item}: {item: ImageInfo; index: number}) => {
    return (
      <Image
        source={{
          uri: item.uri,
        }}
        style={styles.image}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        style={styles.camera}
        ref={cameraRef}
        type={RNCamera.Constants.Type.front}
        onFacesDetected={onFacesDetected}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        autoFocus="on"
        captureAudio={false}>
        <MaskFace
          radianCircle={sizes._160}
          backgroudColor="#000000"
          circleViewY={sizes._250}
          progress={0}
          progressColor="#34C759"
          gesture={'FRONT'}
          isEnd={isEnd.current}
          isValid={isValid.current}
        />
        <FaceDetected
          isFace={isFace.current}
          isValid={isValid.current}
          top={faceInfo?.bounds.origin.y}
          left={faceInfo?.bounds.origin.x}
          width={faceInfo?.bounds.size.width}
          height={faceInfo?.bounds.size.height}
        />
      </RNCamera>
      <View style={styles.uiInformation}>
        <Text style={styles.txtNotify}>
          Vui lòng đưa khuôn mặt vào khung hình
        </Text>
      </View>
      <View style={styles.listStaff}>
        <FlatList
          keyExtractor={(item, index) => `${item.uri}_${index}`}
          data={imageDetectFace.current}
          horizontal
          renderItem={_renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  camera: {
    width: width,
    height: (width / 3.5) * 4,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 15,
  },
  uiInformation: {
    position: 'absolute',
    width: width,
    height: height,
  },
  txtNotify: {
    marginTop: Platform.OS === 'ios' ? sizes._485 : sizes._450,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  listStaff: {
    flex: 1,
  },
});
