import React, {Component} from 'react';
import {Text, View, StyleSheet, Animated, PanResponder} from 'react-native';
import {getSwipeDirection, isTap} from './detectSwipe';

const styles = StyleSheet.create({
  bubble: {
    padding: 30,
    borderRadius: 50,
    backgroundColor: '#333',
  },
});

class ControlBubble extends Component {
  state = {
    bubblePosition: new Animated.ValueXY(),
  };

  onBubbleRelease = (e, gestureState) => {
    const direction = getSwipeDirection(gestureState);

    console.warn(direction);
    this.state.bubblePosition.flattenOffset();
    Animated.spring(this.state.bubblePosition, {
      toValue: 0,
    }).start();
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
    const {bubblePosition} = this.state;

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

    let transformStyle = {transform: [{translateX}, {translateY}]};

    return (
      <Animated.View
        {...this.movementController.panHandlers}
        style={[styles.bubble, transformStyle]}></Animated.View>
    );
  }
}

export default ControlBubble;
