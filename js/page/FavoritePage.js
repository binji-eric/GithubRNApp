import React, { Component } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator} from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import NavigationUtil from '../navigator/NavigationUtil'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import { FLAG_STORAGE } from '../expand/dao/DataStorage'
import FavoriteDao from  '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TitleColor = '#678';

export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.tabNames=['最热', '趋势']
    }

    render() {
        let statusBar = {
            backgroundColor: TitleColor,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor: TitleColor}}
        />
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            {
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
                    navigationOptions: {
                        title: '最热'
                    }
                },
                'Trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
                    navigationOptions: {
                        title: '趋势'
                    }
                }
            },
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: false,
                    style: {
                        backgroundColor: '#a67'
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ));
        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator/>
            </View>
        );
    }
}

const pageSize = 10;
class FavoriteTab extends Component {
    constructor(props) {
        super(props)
        const { flag } =  this.props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag)
    }

    componentDidMount () {
        this.loadData(true);
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = (data) => {
            if(data.to == 2) {
                this.loadData(false)
            }
        } )
    }

    componentWillUnmount () {
        EventBus.getInstance().removeListener(this.listener)
    }

    getFetchUrl (key) {
        const url = URL + key + QUERY_STR;
        console.log(url);
        return url;
    }

    _store() {
        const {favorite} = this.props
        let store = favorite[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: []
            } 
        }
        return store
    }

    loadData (isShowLoading) {
        const {onLoadFavoriteData} = this.props  
        onLoadFavoriteData(this.storeName, isShowLoading)
    }

    onFavorite (item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)
        if(this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
        }

    }

    renderItem(data) {
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular? PopularItem : TrendingItem
        return <Item
            projectModel = {item}
            onSelect= {(callback) => {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: this.storeName,
                    callback
                }, 'DetailPage')   
            }}
            onFavorite={(item, isFavorite)=>{
                this.onFavorite(item, isFavorite)
            }}
        />
    }

    render () {
        let store = this._store()
        return  (  
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={ store.projectModels}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.fullName? item.item.fullName: item.item.id}
                    // 为列表提供下拉刷新的属性
                    refreshControl = {
                        <RefreshControl
                            title={'Loading...'}
                            titleColor={TitleColor}
                            colors={[TitleColor]}
                            refreshing={store.isLoading}
                            // 触发下拉刷新
                            onRefresh={() => this.loadData(true)}
                            tintColor={TitleColor}
                        >    
                        </RefreshControl>
                    }
                ></FlatList>
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </SafeAreaView>
           
        )
    }
}

const mapStateToProps= state => ({
    favorite: state.favorite
});
const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadFavoriteData(storeName, url, pageSize, favoriteDao)),
});

// 将PopularTab和state树进行关联
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: 30
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginVertical: 9
    },
    indicatorContainer: {
        alignItems:'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
})
