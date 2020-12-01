// import React, { Component } from 'react'
// import { View,  TouchableHighlight, StyleSheet, Alert} from 'react-native'
// import { connect } from 'react-redux'
// import actions from '../action/index'
// import NavigationBar from '../common/NavigationBar'
// import NavigationUtil from '../navigator/NavigationUtil'
// import LanguageDao, {FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
// import BackPressComponent from '../common/BackPressComponent'
// import CheckBox from 'react-native-check-box'
// import ViewUtil from '../util/ViewUtil'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import ArrayUtil from "../util/ArrayUtil"
// import SortableListView from 'react-native-sortable-listview'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


// const TitleColor = '#678';

// class SortKeyPage extends Component {
//     constructor(props) {
//         super(props);
//         this.params = this.props.navigation.state.params;
//         this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
//         this.languageDao = new LanguageDao(this.params.flag)
//         this.state= {
//             checkedArray: SortKeyPage._keys(this.props)
//         }
//     }
//     onBackPress(e) {
//         this.onBack();
//         return true;
//     }
//     static getDerivedStateFromProps(nextProps, prevState) {
//         const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
//         if (prevState.keys !== checkedArray) {
//             return {
//                 keys: checkedArray,
//             }
//         }
//         return null;
//     }

//     onBack() {
//         if (this.changeValues.length > 0) {
//             Alert.alert('提示', '要保存修改吗？',
//                 [
//                     {
//                         text: '否', onPress: () => {
//                             NavigationUtil.goBack(this.props.navigation)
//                         }
//                     }, 
//                     {
//                         text: '是', onPress: () => {
//                             this.onSave();
//                         }
//                 }
//                 ])
//         } else {
//             NavigationUtil.goBack(this.props.navigation)
//         }
//     }

//     componentDidMount () {
//         this.backPress.componentDidMount();
//         //如果props中标签为空则从本地存储中获取标签
//         if (SortKeyPage._keys(this.props).length === 0) {
//             let {onLoadLanguage} = this.props;
//             onLoadLanguage(this.params.flag);
//         }
//     }

//     componentWillUnmount() {
//         this.backPress.componentWillUnmount();
//     }

//      /**
//      * 获取标签
//      * @param props
//      * @param original 移除标签时使用，是否从props获取原始对的标签
//      * @param state 移除标签时使用
//      * @returns {*}
//      * @private
//      */
//     static _keys(props, state) {
//         if(state && state.checkedArray && state.checkedArray.length) {
//             return state.checkedArray
//         }
//         const flag = SortKeyPage._flag(props);
//         let dataArray = props.language[flag] || []
//         let keys = [];
//         for(let i = 0, j = dataArray.length; i < j; i++) {
//             let data = dataArray[i];
//             if(data.checked)
//                 keys.push(data)
//         }
//         return keys;
//     }

//     static _flag(props) {
//         const {flag} = props.navigation.state.params;
//         let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
//     }

//     // 切换选中的图标 和 非选中的图标
//     _checkedImage(checked) {
//         // const {theme} = this.params;
//         return <Ionicons
//             name={checked ? 'ios-checkbox' : 'md-square-outline'}
//             size={20}
//             style={{
//                 color: 'black',
//             }}/>
//     }

//      // 选中复选框时
//      onClick(data, index) {
//         //  选中数据取反
//         data.checked = !data.checked; 
//         ArrayUtil.updateArray(this.changeValues, data);
//         this.state.keys[index] = data;//更新state以便显示选中状态
//         this.setState({
//             keys: this.state.keys
//         })
//     }

//     renderCheckBox(data, index) {
//         return <CheckBox
//             style={{flex: 1, padding: 10}}
//             onClick={() => this.onClick(data, index)}
//             isChecked={data.checked}
//             leftText={data.name}  // 标签
//             checkedImage={this._checkedImage(true)} // 选中状态下的image
//             unCheckedImage={this._checkedImage(false)} //非选中状态下的image
//         />
//     }

//     onSave(hasChecked) {
//         if (!hasChecked) {
//             if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
//                 NavigationUtil.goBack(this.props.navigation);
//                 return;
//             }
//         }
//         // toDo 保存排序后的数据
//         // 获取排序后数据
//         // 保存
//         //更新本地数据
//         this.languageDao.save(keys || this.state.keys);
//         const {onLoadLanguage} = this.props;
//         //更新store
//         onLoadLanguage(this.params.flag);
//         NavigationUtil.goBack(this.props.navigation);
//     }


//     renderView() {
//         let dataArray = this.state.keys;
//         if (!dataArray || dataArray.length === 0) return;
//         let len = dataArray.length;
//         let views = [];
//         for (let i = 0, l = len; i < l; i += 2) {
//             views.push(
//                  // 每一行都有两个checkbox， i 和 i+1， 
//                 <View key={i}>
//                     {/* 行排列 */}
//                     <View style={styles.item}>
//                         {this.renderCheckBox(dataArray[i], i)}
//                         {/* 数组不越界时，渲染第二个 */}
//                         {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
//                     </View>
//                     {/* 分割线 */}
//                     <View style={styles.line}/>
//                 </View>
//             )
//         }
//         return views;
//     }

//     render() {
//         let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
//         let navigationBar = <NavigationBar
//             title={title}
//             style={{backgroundColor: TitleColor}}
//             leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
//             rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
//         />
//        return (<View
//             style={styles.container}
//             // topColor={theme.themeColor}
//         >
//             {navigationBar}
//             <SortableListView
//                 data={this.state.checkedArray}
//                 order={Object.keys(this.state.checkedArray)}
//                 onRowMoved={e => {
//                     this.state.checkedArray.splice(e.to, 0, order.splice(e.from, 1)[0])
//                     this.forceUpdate()
//                 }}
//                 render={row => <SortCell data={row}/>}
//             >

//             </SortableListView>
//         </View>)
//     }
// }

// class SortCell extends Component {
//     render() {
//         const {theme} = this.props;
//         return <TouchableHighlight
//             underlayColor={'#eee'}
//             style={this.props.data.checked ? styles.item : styles.hidden}
//             {...this.props.sortHandlers}>
//             <View style={{marginLeft: 10, flexDirection: 'row'}}>
//                 <MaterialCommunityIcons
//                     name={'sort'}
//                     size={16}
//                     style={{marginRight: 10, color: theme.themeColor}}/>
//                 <Text>{this.props.data.name}</Text>
//             </View>
//         </TouchableHighlight>
//     }
// }

// const mapPopularStateToProps= state => ({
//     // 从language reducer中获得的数据
//     language: state.language
// });
// const mapPopularDispatchToProps = dispatch => ({
//     onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
// });

// // 将PopularTab和state树进行关联
// export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//         marginTop: 30
//     },
//     line: {
//         flex: 1,
//         height: 0.3,
//         backgroundColor: 'darkgray',
//     },
//     hidden: {
//         height: 0
//     },
//     item: {
//         backgroundColor: "#F8F8F8",
//         borderBottomWidth: 1,
//         borderColor: '#eee',
//         height: 50,
//         justifyContent: 'center'
//     },
// })
import React, {Component} from 'react';
import {Alert, TouchableHighlight, StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrayUtil from "../util/ArrayUtil"
import SortableList from 'react-native-sortable-list'
// import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
// import GlobalStyles from "../res/styles/GlobalStyles";

const THEME_COLOR = '#678';


class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props),
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState);
        if (prevState.checkedArray !== checkedArray) {
            return {
                checkedArray: checkedArray,
            };
        }
        return null;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 获取标签
     * @param props
     * @param state
     * @returns {*}
     * @private
     */
    static _keys(props, state) {
        //如果state中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray;
        }
        //否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data);
        }
        return keys;
    }

    static _flag(props) {
        const {flag} = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onSave(hasChecked) {
        if (!hasChecked) {
            //如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation);
                return;
            }
        }
        //保存排序后的数据
        //获取排序后的数据
        //更新本地数据
        this.languageDao.save(this.getSortResult());

        //重新加载排序后的标签，以便其他页面能够及时更新
        const {onLoadLanguage} = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }

    /**
     * 获取排序后的标签结果
     * @returns {Array}
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        //获取排序之前的排列顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
            let item = originalCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }


    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    }, {
                    text: '是', onPress: () => {
                        this.onSave(true);
                    }
                }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    render() {
        // const {theme} = this.params;
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            // style={theme.styles.navBar}
            rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
        />;
        return <View
            // style={GlobalStyles.root_container}
            // topColor={theme.themeColor}
        >
            {navigationBar}
            <SortableList
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell data={row} {...this.params}/>}
            />
        </View>
    }
}

class SortCell extends Component {
    render() {
        // const {theme} = this.props;
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{marginRight: 10}}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}

const mapPopularStateToProps = state => ({
    language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
});
