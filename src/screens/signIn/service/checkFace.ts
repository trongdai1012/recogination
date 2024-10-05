import {Face} from 'react-native-camera';
import sizes from '../../../res/sizes';
import {Dimensions, Platform} from 'react-native';
const {width} = Dimensions.get('window');

export const checkFaceValidSigin = (faceData: Face) => {
  try {
    if (Platform.OS === 'ios') {
      const faceIsCirle =
        faceData?.bounds.origin.y > sizes._90 &&
        faceData?.bounds.origin.y + faceData?.bounds.size.height < sizes._410;
      const faceCenterCircle =
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 >
          width / 2 - sizes._70 &&
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 <
          width / 2 + sizes._70;
      return faceIsCirle && faceCenterCircle;
    } else {
      const faceIsCirle =
        faceData?.bounds.origin.y > sizes._90 &&
        faceData?.bounds.origin.y + faceData?.bounds.size.height < sizes._410;
      const faceCenterCircle =
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 >
          width / 2 - sizes._40 &&
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 <
          width / 2 + sizes._40;
      return faceIsCirle && faceCenterCircle;
    }
  } catch (error) {
    return false;
  }
};

export const checkFaceFrontValidSigin = (faceData: Face) => {
  const isRollAngleValid =
    !!faceData.rollAngle && faceData.rollAngle > -10 && faceData.rollAngle < 10;
  if (!isRollAngleValid) {
    return false;
  }
  const isYawAngle =
    !!faceData.yawAngle && faceData.yawAngle > -10 && faceData.yawAngle < 10;
  if (!isYawAngle) {
    return false;
  }
  let isGestureUp = false;
  if (
    !!faceData?.noseBasePosition?.y &&
    !!faceData?.rightEarPosition?.y &&
    !!faceData?.leftEarPosition?.y
  ) {
    const earPositionYAverage =
      (faceData.rightEarPosition.y + faceData.leftEarPosition.y) / 2;
    isGestureUp = faceData.noseBasePosition.y < earPositionYAverage;
  }
  if (isGestureUp) {
    return false;
  }
  let isGestureDown = false;
  if (
    !!faceData?.noseBasePosition?.y &&
    !!faceData?.rightEarPosition?.y &&
    !!faceData?.leftEarPosition?.y
  ) {
    const earPositionYAverage =
      (faceData.rightEarPosition.y + faceData.leftEarPosition.y) / 2;
    isGestureDown = faceData.noseBasePosition.y > earPositionYAverage + 25;
  }
  if (isGestureDown) {
    return false;
  }
  return true;
};
