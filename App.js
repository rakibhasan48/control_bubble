/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import ControlBubble from './src/ControlBubble/ControlBubble';

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <ControlBubble />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default App;
