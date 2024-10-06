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
import {useIsFocused} from '@react-navigation/native';
import NavigationService from '../../router/NavigationService';
import {ScreenName} from '../../router/ScreenName';
import {checkFaceValidSigUp, checkGestureValid} from './service/detectFace';
import {showToast} from '../../services/showToast';
const {width, height} = Dimensions.get('window');

export type GESTURE_STEPS_TYPE = 'FRONT' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';

export type ImageDetectFace = {
  gesture: GESTURE_STEPS_TYPE;
  uri: string;
};

type SignUpParamType = {
  username: string;
  tenant: string;
};

export default function SignUp({route}: any) {
  const [cameraError, setCameraError] = useState<boolean>(false);
  const cameraRef: any = useRef();
  const [faceInfo, setFaceInfo] = useState<Face | undefined>();

  const dataImageDetectFace = useMemo<ImageDetectFace[]>(() => [], []);

  const isPending = useRef<boolean>(false);
  const isFace = useRef<boolean>(false);
  const isValid = useRef<boolean>(false);
  const isEnd = useRef<boolean>(false);

  const currentGestureStep = useRef<GESTURE_STEPS_TYPE>('FRONT');

  const [progress, setProgress] = useState<number>(0);
  const isFocus = useIsFocused();

  const param: SignUpParamType = useMemo(() => {
    const params = route?.params;
    if (!params) {
      showToast('error', 'Đầu vào không hợp lệ, vui lòng làm lại các bước.');
      return {};
    }
    return params;
  }, [route]);

  useEffect(() => {
    if (isFocus) {
      //reset data
      currentGestureStep.current = 'FRONT';
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
      username: param.username,
      tenant: param.tenant,
    });
  }, [dataImageDetectFace, param.tenant, param.username]);

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
        let centerPoint = {
          x: faceData.noseBasePosition?.x,
          y: faceData.noseBasePosition?.y,
        };

        switch (currentGestureStep.current) {
          case 'LEFT':
            if (Platform.OS === 'ios') {
              centerPoint = {
                x: faceData?.rightCheekPosition?.x,
                y: faceData?.rightCheekPosition?.y,
              };
            } else {
              centerPoint = {
                x: faceData?.leftCheekPosition?.x,
                y: faceData?.leftCheekPosition?.y,
              };
            }
            break;
          case 'RIGHT':
            if (Platform.OS === 'ios') {
              centerPoint = {
                x: faceData?.leftCheekPosition?.x,
                y: faceData?.leftCheekPosition?.y,
              };
            } else {
              centerPoint = {
                x: faceData?.rightCheekPosition?.x,
                y: faceData?.rightCheekPosition?.y,
              };
            }
            break;
          case 'UP':
            centerPoint = {
              x: faceData.noseBasePosition?.x,
              y:
                !!faceData.leftCheekPosition?.y &&
                !!faceData.rightCheekPosition?.y
                  ? (faceData.leftCheekPosition?.y +
                      faceData.rightCheekPosition?.y) /
                    2
                  : faceData.noseBasePosition?.y,
            };
            break;
          case 'DOWN':
            centerPoint = {
              x: faceData.noseBasePosition?.x,
              y:
                !!faceData.rightEarPosition?.y && !!faceData.leftEarPosition?.y
                  ? (faceData.rightEarPosition?.y +
                      faceData.leftEarPosition?.y) /
                    2
                  : faceData.noseBasePosition?.y,
            };
            break;
        }
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
          dataImageDetectFace.push({
            gesture: currentGestureStep.current,
            uri: imageCrop.uri,
          });
          switch (currentGestureStep.current) {
            case 'FRONT':
              currentGestureStep.current = 'LEFT';
              setProgress(20);
              break;
            case 'LEFT':
              currentGestureStep.current = 'RIGHT';
              setProgress(40);
              break;
            case 'RIGHT':
              currentGestureStep.current = 'UP';
              setProgress(60);
              break;
            case 'UP':
              currentGestureStep.current = 'DOWN';
              setProgress(80);
              break;
            case 'DOWN':
              isEnd.current = true;
              setProgress(100);
              setFaceInfo(undefined);
              handleSubmit();
              break;
          }
        }
      } catch (error) {
        console.log('Error taking picture:', error);
        showToast('error', 'Trích xuất hình ảnh thất bại, vui lòng thử lại.');
      }
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
      const faceValid = checkFaceValidSigUp(faces);
      isValid.current = faceValid;
      if (faceValid) {
        const isFrontGestureValid = checkGestureValid(
          faces,
          currentGestureStep.current,
        );
        if (isFrontGestureValid) {
          handleTakePictureStep(faces);
        }
      }
    }, 350),
    [currentGestureStep.current],
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

  useEffect(() => {
    return () => {
      handleFacesDetected.cancel();
    };
  }, [handleFacesDetected]);

  return (
    <SafeAreaView style={styles.container}>
      {cameraError ? (
        <Text style={styles.errorText}>Cannot access the camera.</Text>
      ) : (
        <RNCamera
          style={styles.camera}
          ref={cameraRef}
          type={RNCamera.Constants.Type.front}
          onFacesDetected={onFacesDetected}
          onCameraReady={() => setCameraError(false)}
          onMountError={() => setCameraError(true)}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
          faceDetectionLandmarks={
            RNCamera.Constants.FaceDetection.Landmarks.all
          }
          autoFocus="on"
          captureAudio={false}>
          <MaskFace
            radianCircle={sizes._160}
            backgroudColor="#000000"
            circleViewY={sizes._250}
            progress={progress}
            progressColor="#34C759"
            gesture={currentGestureStep.current}
            isEnd={isEnd.current}
            isValid={isValid.current}
          />
          <FaceDetected
            isFace={isFace.current}
            isValid={isValid.current}
            top={faceInfo?.bounds?.origin?.y || 0}
            left={faceInfo?.bounds?.origin?.x || 0}
            width={faceInfo?.bounds?.size?.width || 0}
            height={faceInfo?.bounds?.size?.height || 0}
          />
        </RNCamera>
      )}
      <View style={styles.faceBlock} />
      <View style={styles.uiInformation}>
        {currentGestureStep.current === 'FRONT' && (
          <Text style={styles.txtNotify}>
            Vui lòng đưa khuôn mặt vào khung hình
          </Text>
        )}
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

  faceBorder: {
    position: 'absolute',
  },
  borderItem: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: '#03D328',
  },
  faceBlock: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
