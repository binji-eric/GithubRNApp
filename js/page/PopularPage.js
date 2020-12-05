import React, { Component } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, TouchableOpacity} from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import NavigationUtil from '../navigator/NavigationUtil'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import { FLAG_STORAGE } from '../expand/dao/DataStorage'
import FavoriteDao from  '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'
import {FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import Ionicons from 'react-native-vector-icons/Ionicons'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TitleColor = '#678';

class PopularPage extends Component {
    constructor(props) {
        super(props);
        const {onLoadLanguage} = this.props;
        console.log(FLAG_LANGUAGE.flag_key, '->>')
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
        // this.tabNames=['Java', 'Android', 'iOS', 'React', 'React Native', 'PHP']
    }
    _genTabs() {
        const tabs = {}
        const {keys, theme} = this.props
        keys.forEach((item, index) => {
            if(item.checked) {
                tabs[`tab${index}`]={
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
                    navigationOptions: {
                        title: item.name,
                    },
                };
            }
        })
        return tabs;
    }

    renderRightButton() {
        const {theme} = this.props;
        return <TouchableOpacity
            onPress={() => {
                NavigationUtil.goPage({theme}, 'SearchPage')
            }}
        >
            <View style={{padding: 5, marginRight: 8}}>
                <Ionicons
                    name={'ios-search'}
                    size={24}
                    style={{
                        marginRight: 8,
                        alignSelf: 'center',
                        color: 'white',
                    }}/>
            </View>
        </TouchableOpacity>
    }

    render() {
        const {keys, theme} = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />
        const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), //生成顶部导航
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: '#a67'
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                },
                lazy: true
            }
        )) : null;
        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator/>}
            </View>
        );
    }
}

const mapPopularStateToProps= state => ({
    // 从language reducer中获得的数据
    keys: state.language.keys,
    theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

// 将PopularTab和state树进行关联
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)


const pageSize = 10;
class PopularTab extends Component {
    constructor(props) {
        super(props)
        const { tabLabel } =  this.props
        this.storeName = tabLabel
        this.isFavoriteChanged = false
    }

    componentDidMount () {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangedListener = () => {
            this.isFavoriteChanged = true
        })

        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectedListener = data => {
            if(data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount () {
        EventBus.getInstance().removeListener(this.favoriteChangedListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectedListener)
    }

    getFetchUrl (key) {
        const url = URL + key + QUERY_STR;
        console.log(url);
        return url;
    }

    _store() {
        const {popular} = this.props
        let store = popular[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true
            } 
        }
        return store
    }

    loadData (loadMore, refreshFavorite) {
        
        const {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} = this.props;
        console.log('loadData', onFlushPopularFavorite)
        const url = this.getFetchUrl(this.storeName);
        const store = this._store();
        if(loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if(refreshFavorite) {
            console.log('in the popular page, need to load onFLushPopularFavorite')
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onLoadPopularData(this.storeName, url, pageSize, favoriteDao);
        }
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.props;
        return <PopularItem
            projectModel = {item}
            theme= {theme}
            onSelect= {(callback) => {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_popular,
                    callback
                }, 'DetailPage')   
            }}
            onFavorite={(item, isFavorite)=>{
                FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)
            }}
        />
    }

    genIndicator () {
        return this._store().hideLoadingMore ? null:
            <View
                style={styles.indicatorContainer}
            >
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多！！</Text>
            </View>
    }

    render () {
        let store = this._store()
        const {theme} = this.props
        return  (  
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={ store.projectModels}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    // 为列表提供下拉刷新的属性
                    refreshControl = {
                        <RefreshControl
                            title={'Loading...'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            // 触发下拉刷新
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        >    
                        </RefreshControl>
                    }
                    ListFooterComponent={()=>this.genIndicator()}
                    onEndReached={()=>{
                        console.log('----onEndReached----')
                        // 为了确保在执行以下函数前，onMomentumScrollBegin已经执行了
                        setTimeout(() => {
                            if(this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore = false
                            }
                        }, 100)
                    }}
                    // 当用户刚触发滚动时调用，解决首页时onEndReached被调用的问题
                    onMomentumScrollBegin={()=>{
                        this.canLoadMore = true
                        console.log('---onMomentumScrollBegin---')
                    }}
                    onEndReachedThreshold={0.4}
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
    popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

// 将PopularTab和state树进行关联
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

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
