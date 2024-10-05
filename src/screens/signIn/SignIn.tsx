import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  SafeAreaView,
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
} from './service/checkFace';
import {ImageDetectFace} from '../signUp/SignUp';
import {useIsFocused} from '@react-navigation/native';
import NavigationService from '../../router/NavigationService';
import {ScreenName} from '../../router/ScreenName';
const {width, height} = Dimensions.get('window');

export default function SignIn() {
  const cameraRef: any = useRef();
  const [faceInfo, setFaceInfo] = useState<Face | undefined>();

  const dataImageDetectFace = useMemo<ImageDetectFace[]>(() => [], []);

  const isPending = useRef<boolean>(false);
  const isFace = useRef<boolean>(false);
  const isValid = useRef<boolean>(false);
  const isEnd = useRef<boolean>(false);

  const [progress, setProgress] = useState<number>(0);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      //reset data
      isValid.current = false;
      isFace.current = false;
      isPending.current = false;
      dataImageDetectFace.length = 0;
      setFaceInfo(undefined);
      isEnd.current = false;
      setProgress(0);
    }
  }, [dataImageDetectFace, isFocus]);

  const handleSubmit = useCallback(() => {
    NavigationService.navigate(ScreenName.RESULT, {
      dataImage: dataImageDetectFace,
    });
  }, [dataImageDetectFace]);

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
        let offsetY = !!centerPoint.y ? centerPoint.y - radian * 1.1 : 0;
        if (!!data.uri) {
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
          isEnd.current = true;
          dataImageDetectFace.push({
            gesture: 'FRONT',
            uri: imageCrop.uri,
          });
          setProgress(100);
          setFaceInfo(undefined);
          handleSubmit();
        }
      } catch (error) {}
      isPending.current = false;
    },
    [dataImageDetectFace, handleSubmit],
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
          progress={progress}
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
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000',
        }}
      />
      <View style={styles.uiInformation}>
        <Text style={styles.txtNotify}>
          Vui lòng đưa khuôn mặt vào khung hình
        </Text>
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
    height: (width / 3) * 4,
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
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
});
