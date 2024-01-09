import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Home from './src/views/Home';

function App(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='white'
      />
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5'
  },
});

export default App;
