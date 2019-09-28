import React, {Component} from 'react';
import {View, StyleSheet, Animated, PanResponder} from 'react-native';
import {getSwipeDirection, isTap, swipeDirections} from './detectSwipe';
import AnimateOpacity from './AnimateOpacity';

const styles = StyleSheet.create({
  bubble: {
    padding: 30,
    borderRadius: 50,
    backgroundColor: '#333',
  },
  arrowContainer: {
    position: 'relative',
  },
  arrow: {
    borderTopColor: 'blue',
    borderTopWidth: 3,
    position: 'absolute',
    padding: 2,
  },
  upArrow: {
    bottom: 25,
    left: 29,
  },
  leftArrow: {
    top: 30,
    right: 88,
  },
  rightArrow: {
    left: 88,
    top: 30,
  },
  downArrow: {
    top: 90,
    left: 29,
  },
});

class ControlBubble extends Component {
  state = {
    bubblePosition: new Animated.ValueXY(),
    bubbleScale: new Animated.Value(1),
    arrowOpacity: new Animated.Value(0),
    arrowOpacityToValue: 1,
    scaleToValue: 1.2,
  };

  onBubbleRelease = (e, gestureState) => {
    const direction = getSwipeDirection(gestureState);
    // console.warn(direction);

    const {
      bubblePosition,
      scaleToValue,
      bubbleScale,
      arrowOpacity,
      arrowOpacityToValue,
    } = this.state;

    if (direction === swipeDirections.TAP) {
      Animated.spring(bubbleScale, {
        toValue: scaleToValue,
        friction: 3,
      }).start();
      Animated.timing(arrowOpacity, {
        duration: 200,
        toValue: arrowOpacityToValue,
      }).start();
      let nextScaleValue = 1;
      if (scaleToValue === 1) {
        nextScaleValue = 1.2;
      }
      this.setState({scaleToValue: nextScaleValue});
      let nextOpacityValue = 0;
      if (arrowOpacityToValue === 0) {
        nextOpacityValue = 1;
      }
      this.setState({arrowOpacityToValue: nextOpacityValue});
    } else {
      Animated.spring(bubblePosition, {
        toValue: 0,
      }).start();
    }

    bubblePosition.flattenOffset();
  };

  movementInit = (e, gestureState) => {
    this.state.bubblePosition.setOffset({
      x: this.state.bubblePosition.x._value,
      y: this.state.bubblePosition.y._value,
    });
    this.state.bubblePosition.setValue({x: 0, y: 0});
  };

  onBubbleMove = (e, gestureState) => {
    return Animated.event([
      null,
      {
        dx: this.state.bubblePosition.x,
        dy: this.state.bubblePosition.y,
      },
    ]);
  };

  handleShouldSetResponder = (e, gestureState) => {
    if (isTap(gestureState)) {
      return false;
    }
    if (e.nativeEvent.touches.length === 1) {
      return false;
    }
    return true;
  };

  movementController = PanResponder.create({
    onStartShouldSetPanResponder: this.handleShouldSetResponder,
    onMoveShouldSetPanResponder: this.handleShouldSetResponder,
    onStartShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: this.movementInit,
    onPanResponderMove: this.onBubbleMove(),
    onPanResponderRelease: this.onBubbleRelease,
  });

  render() {
    const {bubblePosition, bubbleScale, arrowOpacity} = this.state;

    const translateX = bubblePosition.x.interpolate({
      inputRange: [-20, 20],
      outputRange: [-20, 20],
      extrapolate: 'clamp',
    });
    const translateY = bubblePosition.y.interpolate({
      inputRange: [-20, 20],
      outputRange: [-20, 20],
      extrapolate: 'clamp',
    });

    const opacity = arrowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    let transformStyle = {
      transform: [{translateX}, {translateY}, {scale: bubbleScale}],
    };

    return (
      <View style={styles.arrowContainer}>
        <Animated.View style={[{opacity}]}>
          <View style={[styles.arrow, styles.upArrow]} />
          <View style={[styles.arrow, styles.leftArrow]} />
          <View style={[styles.arrow, styles.rightArrow]} />
          <View style={[styles.arrow, styles.downArrow]} />
        </Animated.View>
        <Animated.View
          {...this.movementController.panHandlers}
          style={[styles.bubble, transformStyle]}></Animated.View>
      </View>
    );
  }
}

export default ControlBubble;
