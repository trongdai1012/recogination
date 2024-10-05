import React, {useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {Circle, Defs, Mask, Rect, Svg} from 'react-native-svg';
import GestureSvg from '../assets/svg/gesture.svg';
import SuccessSvg from '../assets/svg/icon_success.svg';
import {GESTURE_STEPS_TYPE} from '../screens/signUp/SignUp';
import sizes from '../res/sizes';
const {width, height} = Dimensions.get('window');

interface MaskFaceProps {
  style?: StyleProp<ViewStyle>;
  radianCircle: number;
  backgroudColor: string;
  circleViewY: number;
  progress: number;
  progressColor: string;
  gesture: GESTURE_STEPS_TYPE;
  isEnd: boolean;
  isValid: boolean;
}

const MaskFace = (props: MaskFaceProps) => {
  const radius = props.radianCircle + 2;
  const strokeWidth = 5;
  const circumference = Math.round(2 * Math.PI * radius);
  const progressOffset = Math.round(
    circumference - (props.progress / 100) * circumference,
  );

  const getGestureSvg = useCallback(() => {
    if (props.isEnd) return null;
    switch (props.gesture) {
      case 'LEFT':
        return (
          <View style={[{position: 'absolute'}, styles.imageLeft]}>
            <GestureSvg width={sizes._90} height={sizes._270} />
          </View>
        );
      case 'RIGHT':
        return (
          <View style={[{position: 'absolute'}, styles.imageRight]}>
            <GestureSvg width={sizes._90} height={sizes._270} />
          </View>
        );
      case 'UP':
        return (
          <View style={[{position: 'absolute'}, styles.imageTop]}>
            <GestureSvg width={sizes._90} height={sizes._270} />
          </View>
        );
      case 'DOWN':
        return (
          <View style={[{position: 'absolute'}, styles.imageDown]}>
            <GestureSvg width={sizes._90} height={sizes._270} />
          </View>
        );
      default:
        return null;
    }
  }, [props.gesture, props.isEnd]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: props.backgroudColor,
          height: props.circleViewY - width / 2,
        }}
      />
      <Svg
        height={width}
        width={width}
        style={{
          overflow: 'hidden',
        }}>
        <Defs>
          {/* Define a Mask to make the circle transparent */}
          <Mask id="mask" x="0" y="0" height={width} width={width}>
            {/* Everything under the mask starts as transparent */}
            <Rect width={width} height={width} fill="white" />
            {/* This circle will be cut out and made transparent */}
            <Circle
              cx={width / 2}
              cy={width / 2}
              r={props.radianCircle}
              fill="black"
            />
          </Mask>
        </Defs>
        {/* Square with the masked circle making it appear transparent */}
        <Rect
          width={width}
          height={width}
          fill={props.backgroudColor}
          mask="url(#mask)"
        />

        <Circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={props.isValid ? '#34C75966' : '#EB575766'} // Background color
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={props.progressColor} // Dynamic color based on progress
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset} // Offset for the progress
          strokeLinecap="round"
          rotation="-90" // Start the progress at the top
          origin={`${width / 2}, ${width / 2}`} // Rotate around the center
        />
      </Svg>
      <View
        style={{
          backgroundColor: props.backgroudColor,
          flex: 1,
        }}
      />
      {getGestureSvg()}
      {props.isEnd && (
        <View
          style={{
            position: 'absolute',
            top: props.circleViewY - 18,
            left: width / 2 - 18,
          }}>
          <SuccessSvg width={36} height={36} />
        </View>
      )}
    </View>
  );
};

export default MaskFace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 9,
  },
  imageLeft: {
    top: sizes._115,
    left: sizes._60,
  },
  imageTop: {
    transform: [{rotate: `90deg`}],
    top: sizes._30,
    left: sizes._90 + (width / 2 - sizes._135),
  },
  imageRight: {
    transform: [{rotate: `180deg`}],
    top: sizes._115,
    left: width / 2 + sizes._40,
  },
  imageDown: {
    transform: [{rotate: `270deg`}],
    left: sizes._90 + (width / 2 - sizes._135),
    top: sizes._200,
  },
});
