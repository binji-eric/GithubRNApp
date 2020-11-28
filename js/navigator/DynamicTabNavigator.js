import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

const TABS = {
    // 在这里配置页面路由
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({tintColor}) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                ></MaterialIcons>
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                ></Ionicons>
            ) 
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor, focused}
            ) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
        
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}
                ) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                ></Entypo>
                )
        }  
    }
}

class DynamicTabNavigator extends React.Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    _tabNavigator () {
        if(this.Tabs) {
            return this.Tabs;
        }
        const { PopularPage, TrendingPage, FavoritePage, MyPage} = TABS
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage}
        PopularPage.navigationOptions.tabBarLabel = '最热1'
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            tabs, {
                tabBarComponent: props => {
                    return <TabBarComponent {...props} theme={this.props.theme}/>
                },
                tabBarOptions: {
                    // activeTintColor: 'red',
                    // inactiveTintColor: 'blue',
                    showIcon: true
                }
            }
        ))
    }

    render () {
        const Tab = this._tabNavigator ();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => {
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
                    from: prevState.index,
                    to: newState.index
                })
            }}
        />
    }
}

class TabBarComponent extends React.Component {
    render () {
        return <BottomTabBar 
            {...this.props}
            activeTintColor={this.props.theme}
        />;
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme
});

export default connect(mapStateToProps)(DynamicTabNavigator);