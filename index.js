/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './js/App';
import WelcomePage from './js/page/WelcomePage'
import PopularPage from './js/page/PopularPage'
import {name as appName} from './app.json';
import AppNavigators from './js/navigator/AppNavigator'

AppRegistry.registerComponent(appName, () => App);
