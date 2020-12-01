import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
    /**
     * 获得左侧返回按钮
     * @param {*} callBack 
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
                style={{padding: 8, paddingLeft: 2}}
                onPress={callBack}>
                    <Ionicons
                        name={'ios-arrow-back'}
                        size={26}
                        style={{color:'white'}}
                    >
                    </Ionicons>
        </TouchableOpacity>
    }
    static getShareButton(callBack) {
        return <TouchableOpacity
                underlayColor={'transparent'}
                onPress={callBack}>
                    <Ionicons
                        name={'md-share'}
                        size={20}
                        style={{opacity: 0.9, marginRight: 10, color: 'white'}}
                    />
                </TouchableOpacity> 
    }
    /**
     * 
     * @param {*} callback 点击item的回调
     * @param {*} text 显示的文本
     * @param {*} color 颜色
     * @param {*} Icons 来自于react-native-vector-icons
     * @param {*} icon 左侧图标
     * @param {*} expandableIco 右侧图标
     */
    static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
        return  (
            <TouchableOpacity
                onPress={callback}
                style={styles.settingItemContainer}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {Icons && icon ? 
                        <Icons
                            name={icon}
                            size={16}
                            style={{marginRight: 10, color: color}}
                        />: <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco? expandableIco: 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        color: color || 'black'
                    }} />
            </TouchableOpacity>
        )
    }

     /**
     * 获取右侧文字按钮
     * @param title
     * @param callBack
     * @returns {XML}
     */
    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
        </TouchableOpacity>
    }

    static getMenuItem(callback, menu, color, expandableIco) {
        return this.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }
}


const styles = StyleSheet.create({
    settingItemContainer: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})