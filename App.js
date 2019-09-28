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
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 100,
  },
});

export default App;
