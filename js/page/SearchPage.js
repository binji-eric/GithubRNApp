import React, { Component } from 'react'
import { View, 
        TextInput, 
        FlatList, 
        StyleSheet,
        Text, 
        RefreshControl, 
        ActivityIndicator, 
        Platform, 
        TouchableOpacity,
        DeviceInfo} from 'react-native'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import NavigationUtil from '../navigator/NavigationUtil'
import Toast from 'react-native-easy-toast'
import { FLAG_STORAGE } from '../expand/dao/DataStorage'
import FavoriteDao from  '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import BackPressComponent from '../common/BackPressComponent'
import LanguageDao from '../expand/dao/LanguageDao'
import {FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import GlobalStyles from '../share/styles/globalStyles'
import ViewUtil from '../util/ViewUtil'
import Utils from '../util/Utils'
// 首先确定是收藏模块的哪部分， popular 还是 trending
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;

class SearchPage extends Component {
    constructor(props) {
        super(props);
        // Search page是二级页面
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        // 判断是否有收藏key
        this.isKeyChange = false;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    loadData (loadMore) {
        const {onSearch, onLoadMoreSearch, search, keys} = this.props;
        if(loadMore) {
            onLoadMoreSearch(search.pageIndex, pageSize, search.items, this.favoriteDao, callBack => {
                this.refs.toast.show('没有更多了')
            })
        // 第一次加载
        }  else {
            onSearch(this.inputKey, pageSize, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
                this.refs.toast.show(message);
            });
        }
    }
    // 点击左上方返回键时
    onBackPress() {
        const {onSearchCancel, onLoadLanguage} = this.props;
        onSearchCancel();//退出时取消搜索
        this.refs.input.blur(); // 退出搜索键盘
        NavigationUtil.goBack(this.props.navigation);
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key);//重新加载标签
        }
        return true;
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.params;
        return <PopularItem
            projectModel = {item}
            theme= {theme}
            onSelect= {(callback) => {
                NavigationUtil.goPage({
                    theme,
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
        const {hideLoadingMore} = this.props.search;
        return hideLoadingMore ? null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多！！</Text>
            </View>
    }

    onRightButtonClick() {
        const {onSearchCancel, search} = this.props;
        if (search.showText === '搜索') {
            this.loadData();
        } else {
            // 显示“取消”时点击，this.searchToken是在search创建的时间戳
            onSearchCancel(this.searchToken);
        }
    }

    /**
     * 添加标签
     */
    saveKey() {
        const {keys} = this.props;
        let key = this.inputKey;
        if (Utils.checkKeyIsExist(keys, key)) {
            this.toast.show(key + '已经存在');
        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true
            };
            keys.unshift(key);//将key添加到数组的开头
            this.languageDao.save(keys);
            this.toast.show(key.name + '保存成功');
            this.isKeyChange = true;
        }
    }

    renderNavBar() {
        const {theme} = this.params;
        const {inputKey, showText} = this.props.search;
        const placeholder = inputKey || "请输入";
        let leftBackButton = ViewUtil.getLeftBackButton(() => this.onBackPress());

        let inputView = <TextInput 
            ref="input" 
            placeholder={placeholder} 
            onChangeText={(text) => {this.inputKey = text}}
            style={styles.textInput}
            ></TextInput>

        let rightButton = <TouchableOpacity
                onPress={() => {
                    this.refs.input.blur();
                    this.onRightButtonClick();
                }}
            >
            <View style={{marginRight: 10}}>
                <Text style={styles.title}>{showText}</Text>
            </View>
        </TouchableOpacity>

        return <View style={{
                backgroundColor: theme.themeColor,
                flexDirection: 'row',
                alignItems: 'center',
                height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
            }}>
                {leftBackButton}
                {inputView}
                {rightButton}
            </View>
    }


    render() {
        const {isLoading, projectModels, showBottomButton, hideLoadingMore} = this.props.search;
        const {theme} = this.params;
        let statusBar = null;
        if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {
            statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]}/>
        }
        // 没有刷新时，显示列表，一刷新，显示空
        let listView = !isLoading ? <FlatList
            data={projectModels}
            renderItem={data => this.renderItem(data)}
            keyExtractor={item => "" + item.item.id}
            contentInset={
                {
                    bottom: 45
                }
            }
            refreshControl={
                <RefreshControl
                    title={'Loading'}
                    titleColor={theme.themeColor}
                    colors={[theme.themeColor]}
                    refreshing={isLoading}
                    onRefresh={() => this.loadData()}
                    tintColor={theme.themeColor}
                />
            }
            ListFooterComponent={() => this.genIndicator()}
            onEndReached={() => {
                console.log('---onEndReached----');
                setTimeout(() => {
                    if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                        this.loadData(true);
                        this.canLoadMore = false;
                    }
                }, 100);
            }}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                console.log('---onMomentumScrollBegin-----')
            }}
        /> : null;
        // 下方显示的收藏按钮
        let bottomButton = showBottomButton? 
            <TouchableOpacity
                style={[styles.bottomButton, {backgroundColor: this.params.theme.themeColor}]}
                onPress={()=>{
                    // 保留关键词
                    this.saveKey();
                }}>
                <View style={{justifyContent: 'center'}}>
                    <Text style={styles.title}>收藏该关键词</Text>
                </View>
            </TouchableOpacity> : null;

        let indicatorView = isLoading ?
            <ActivityIndicator
                style={styles.centering}
                size='large'
                animating={isLoading}
            /> : null;

        let resultView = <View style={{flex: 1}}>
            {indicatorView}
            {listView}
        </View>;
        
        return (
            <View style={styles.container}>
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                {bottomButton}
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}

const mapPopularStateToProps= state => ({
    // 从language reducer中获得的数据
    search: state.search,
    keys: state.language.keys
});
const mapPopularDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

// 将PopularTab和state树进行关联
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SearchPage)


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
    },
    statusBar: {
        height: 20
    },
    // 绝对布局的按钮
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0),
        right: 10,
        borderRadius: 3
    },
    title: {
        fontSize: 18,
        color: "white",
        fontWeight: '500'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 26 : 36,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "white",
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 5,
        opacity: 0.7,
        color: 'white'
    },
})
