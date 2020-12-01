import React, { Component } from 'react'
import { View, ScrollView,  StyleSheet, Alert} from 'react-native'
import { connect } from 'react-redux'
import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil'
import LanguageDao, {FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import BackPressComponent from '../common/BackPressComponent'
import CheckBox from 'react-native-check-box'
import ViewUtil from '../util/ViewUtil'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ArrayUtil from "../util/ArrayUtil";

const TitleColor = '#678';

class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag)
        this.state= {
            keys: []
        }
    }
    onBackPress(e) {
        this.onBack();
        return true;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState),
            }
        }
        return null;
    }

    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    }, 
                    {
                        text: '是', onPress: () => {
                            this.onSave();
                        }
                }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    componentDidMount () {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        })
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

     /**
     * 获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始对的标签
     * @param state 移除标签时使用
     * @returns {*}
     * @private
     */
    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
        // 移除标签，并且不是原始数据
        if (isRemoveKey && !original) {
            //如果state中的keys为空则从props中取
            return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
                return {//注意：不直接修改props，copy一份
                    ...val,
                    // 默认所有的标签移除都为false 
                    checked: false
                };
            });
        // 如果不是标签移除时，自定义语言与自定义标签
        } else {
            return props.language[key];
        }
    }

    // 切换选中的图标 和 非选中的图标
    _checkedImage(checked) {
        // const {theme} = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: 'black',
            }}/>
    }

     // 选中复选框时
     onClick(data, index) {
        //  选中数据取反
        data.checked = !data.checked; 
        ArrayUtil.updateArray(this.changeValues, data);
        this.state.keys[index] = data;//更新state以便显示选中状态
        this.setState({
            keys: this.state.keys
        })
    }

    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}  // 标签
            checkedImage={this._checkedImage(true)} // 选中状态下的image
            unCheckedImage={this._checkedImage(false)} //非选中状态下的image
        />
    }

    onSave() {
        if (this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props.navigation);
            return;
        }
        let keys;
        if (this.isRemoveKey) {//移除标签的特殊处理
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], "name");
            }
        }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys);
        const {onLoadLanguage} = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }


    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
                 // 每一行都有两个checkbox， i 和 i+1， 
                <View key={i}>
                    {/* 行排列 */}
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {/* 数组不越界时，渲染第二个 */}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
                    </View>
                    {/* 分割线 */}
                    <View style={styles.line}/>
                </View>
            )
        }
        return views;
    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let navigationBar = <NavigationBar
            title={title}
            style={{backgroundColor: TitleColor}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />
       return (<View
            style={styles.container}
            // topColor={theme.themeColor}
        >
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>)
    }
}

const mapPopularStateToProps= state => ({
    // 从language reducer中获得的数据
    language: state.language
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

// 将PopularTab和state树进行关联
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: 30
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    }
})
