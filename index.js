/**
 * @format
 */

import {AppRegistry, Platform, UIManager} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// enable layout animation
if (Platform.OS === "android") {
  UIManager?.setLayoutAnimationEnabledExperimental(true)
}

AppRegistry.registerComponent(appName, () => App);
