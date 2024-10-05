import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';

interface FaceDetectedProps {
  style?: StyleProp<ViewStyle>;
  isFace: boolean;
  isValid: boolean;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

const FaceDetected = (props: FaceDetectedProps) => {
  return (
    props.isFace &&
    !!props.top &&
    !!props.left &&
    !!props.width &&
    !!props.height && (
      <View
        style={[
          styles.container,
          {
            zIndex: 0,
            top: props.top,
            left: props.left,
            width: props.width,
            height: props.height,
            borderWidth: 1,
            borderColor: props.isValid ? '#34C759' : '#EB5757',
          },
          props.style,
        ]}
      />
    )
  );
};

export default FaceDetected;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
