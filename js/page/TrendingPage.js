import React, { Component } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import NavigationUtil from '../navigator/NavigationUtil'
import { FLAG_STORAGE } from '../expand/dao/DataStorage'
import FavoriteDao from  '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';
const TitleColor = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames=['Html', 'C', 'C#', 'PHP', 'JavaScript'];
        this.state= {
            timeSpan: TimeSpans[0]
        }
    }
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`]={
                screen: props => <TrendingTabPage {...props} tabLabel={item} timeSpan={this.state.timeSpan}/>,
                navigationOptions: {
                    title: item,
                },
            };
        });
        return tabs;
    }
    _genTitleView() {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={()=> this.dislog.show() } 
                >
                <View style={{flexDirection: 'row', justifyContent:'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(tab) {
        this.dislog.dismiss();
        this.setState({
            timeSpan: tab
        })
        console.log('emit', tab)
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }

    _genTrendingDialog() {
        return <TrendingDialog
                ref={dialog=>this.dislog = dialog}
                onSelect={tab=>this.onSelectTimeSpan(tab)}
        >
        </TrendingDialog>
    }
    _tabNav() {
        if(!this.tabNav){
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
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
                    }
                }
            ));
        } 
        return this.tabNav;
    }

    render() {
        let statusBar = {
            backgroundColor: TitleColor,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            // title={'趋势'}
            titleView={this._genTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: TitleColor}}
        />
        const TabNavigator = this._tabNav();
        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator/>
                {this._genTrendingDialog()}
            </View>
        );
    }
}

const pageSize = 10;
class TrendingTab extends Component {
    constructor(props) {
        super(props)
        const { tabLabel, timeSpan} =  this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
        this.isFavoriteChanged = false
    }

    componentDidMount () {
        this.loadData();
        this.timeSpanListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            console.log('receive', timeSpan)
            this.timeSpan = timeSpan
            this.loadData()
        });

        EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangedListener = () => {
            this.isFavoriteChanged = true
        })

        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectedListener = data => {
            if(data.to === 1 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })

    }
    componentWillUnmount () {
        if(this.timeSpanListener) {
            this.timeSpanListener.remove()
        }
        EventBus.getInstance().removeListener(this.favoriteChangedListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectedListener)
    }

    getFetchUrl (key) {
        const url = URL + key + '?' + this.timeSpan.searchText;
        console.log(url);
        return url;
    }

    _store() {
        const {trending} = this.props
        let store = trending[this.storeName]
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
        const {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
        const url = this.getFetchUrl(this.storeName);
        const store = this._store();
        if(loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if(refreshFavorite) {
            console.log('in the trending page, need to load onFlushTrendingFavorite')
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onLoadTrendingData(this.storeName, url, pageSize, favoriteDao);
        }
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            projectModel = {item}
            onSelect= {(callback) => {   
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                }, 'DetailPage')   
            }}
            onFavorite={(item, isFavorite)=>{
                FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)
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
        return  (  
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={ store.projectModels}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.fullName}
                    // 为列表提供下拉刷新的属性
                    refreshControl = {
                        <RefreshControl
                            title={'Loading...'}
                            titleColor={TitleColor}
                            colors={[TitleColor]}
                            refreshing={store.isLoading}
                            // 触发下拉刷新
                            onRefresh={() => this.loadData()}
                            tintColor={TitleColor}
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
    trending: state.trending
});
const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadTrendingData(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao,callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao,callback)),
    onFlushTrendingFavorite:  (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

// 将TrendingTab和state树进行关联
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

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
