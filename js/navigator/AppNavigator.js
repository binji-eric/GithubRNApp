import { createAppContainer, createSwitchNavigator} from 'react-navigation'
import { createStackNavigator} from 'react-navigation-stack'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import FetchDemoPage from '../page/FetchDemoPage'
import DataStorageDemoPage from '../page/DataStorageDemoPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'

// 两部分导航，initNavigator和 mainNavigator
const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            headerShown: false // 隐藏头部
        }
    }
});

const mainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            title: 'HomePage',
            headerShown: false
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            title: 'DetailPage',
            headerShown: false
        }
    },
    FetchDemoPage: {
        screen: FetchDemoPage,
        navigationOptions: {
            title: 'FetchDemo',
            headerShown: true
        }
    },
    DataStorageDemoPage: {
        screen: DataStorageDemoPage,
        navigationOptions: {
            title: 'DataStorage',
            headerShown: true
        }
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            headerShown: false
        }
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            headerShown: false
        }
    }
});

export default createAppContainer(createSwitchNavigator({
    Init: InitNavigator,
    Main: mainNavigator
}, {
    navigationOptions: {
        headerShown: false
    }
}));


