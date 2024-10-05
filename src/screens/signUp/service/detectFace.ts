import {Dimensions, Platform} from 'react-native';
import {Face, RNCamera} from 'react-native-camera';
import sizes from '../../../res/sizes';
import {GESTURE_STEPS_TYPE} from '../SignUp';
const {width, height} = Dimensions.get('window');

const isFaceFront = (faceData: Face) => {
  const isRollAngleValid =
    !!faceData.rollAngle && faceData.rollAngle > -10 && faceData.rollAngle < 10;
  if (!isRollAngleValid) {
    return false;
  }
  const isYawAngle =
    !!faceData.yawAngle && faceData.yawAngle > -7 && faceData.yawAngle < 7;
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

const isFaceLeft = (faceData: Face) => {
  if (Platform.OS === 'ios') {
    return !!faceData.yawAngle && faceData.yawAngle < -25;
  } else {
    return !!faceData.yawAngle && faceData.yawAngle > 25;
  }
};

const isFaceRight = (faceData: Face) => {
  if (Platform.OS === 'ios') {
    return !!faceData.yawAngle && faceData.yawAngle > 25;
  } else {
    return !!faceData.yawAngle && faceData.yawAngle < -25;
  }
};

const isFaceUp = (faceData: Face) => {
  if (
    !!faceData?.noseBasePosition?.y &&
    !!faceData?.rightEarPosition?.y &&
    !!faceData?.leftEarPosition?.y
  ) {
    const earPositionYAverage =
      (faceData.rightEarPosition.y + faceData.leftEarPosition.y) / 2;
    if (Platform.OS === 'ios') {
      return faceData.noseBasePosition.y < earPositionYAverage - 10;
    } else {
      return faceData.noseBasePosition.y < earPositionYAverage - 20;
    }
  }
  return false;
};

const isFaceDown = (faceData: Face) => {
  if (
    !!faceData?.noseBasePosition?.y &&
    !!faceData?.rightEarPosition?.y &&
    !!faceData?.leftEarPosition?.y
  ) {
    const earPositionYAverage =
      (faceData.rightEarPosition.y + faceData.leftEarPosition.y) / 2;
    return faceData.noseBasePosition.y > earPositionYAverage + 25;
  }
  return false;
};

export const checkGestureValid = (
  faceData: Face,
  gesture: GESTURE_STEPS_TYPE,
) => {
  try {
    switch (gesture) {
      case 'FRONT':
        return isFaceFront(faceData);
      case 'LEFT':
        return isFaceLeft(faceData);
      case 'RIGHT':
        return isFaceRight(faceData);
      case 'UP':
        return isFaceUp(faceData);
      case 'DOWN':
        return isFaceDown(faceData);
    }
  } catch (error) {
    return false;
  }
};

export const checkFaceValidSigUp = (faceData: Face) => {
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
        faceData?.bounds.origin.y > sizes._70 &&
        faceData?.bounds.origin.y + faceData?.bounds.size.height < sizes._460;
      const faceCenterCircle =
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 >
          width / 2 - sizes._70 &&
        faceData?.bounds.origin.x + faceData?.bounds.size.width / 2 <
          width / 2 + sizes._70;
      return faceIsCirle && faceCenterCircle;
    }
  } catch (error) {
    return false;
  }
};
