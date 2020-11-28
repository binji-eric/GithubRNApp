import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MORE_MENU } from '../common/MORE_MENU';
import GlobalStyles from '../share/styles/globalStyles'
import ViewUtil from '../util/ViewUtil';
const TitleColor = '#678';

export default class MyPage extends Component {
    getLeftButton() {
        return <TouchableOpacity
                style={{padding: 8, paddingLeft:12}}
                onPress={()=>{

                }}
            >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            ></Ionicons>
        </TouchableOpacity>
    }
    getRightButton() {
        return <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={()=>{
                        }}
                    >
                    <View style={{padding: 5, marginRight: 8}}>
                        <Feather
                            name={'search'}
                            size={24}
                            style={{color: 'white'}}
                        >
                        </Feather>
                    </View>
                </TouchableOpacity>
            </View>
    }
    onclick(menu) {
        let RouteName, params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage';
                params.title = '教程';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
                break;
            case MORE_MENU.About:
                RouteName = 'AboutPage';
                break;
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }

    getItem(menu) {
        return ViewUtil.getMenuItem(()=> this.onclick(menu), menu, TitleColor)
    }

    render() {
        let statusBar = {
            backgroundColor: TitleColor,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'我的'}
            statusBar={statusBar}
            style={{backgroundColor: TitleColor}}
            rightButton={this.getRightButton()}
            leftButton={this.getLeftButton()}
        />
        return (
            <View style={GlobalStyles.rootContainer}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        onPress={() => this.onclick(MORE_MENU.About)}
                        style={styles.item}
                    >
                        <View style={styles.about_left}>
                            <Ionicons
                                name={MORE_MENU.About.icon}
                                size={40}
                                style={{
                                marginRight: 10,
                                color: TitleColor
                            }}/>
                            <Text>GitHub Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                alignSelf: 'center',
                                color: TitleColor
                            }} />
                    </TouchableOpacity>
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Tutorial)}
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {/*自定义语言*/}
                    {this.getItem(MORE_MENU.Custom_Language)}
                    {/*语言排序*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Language)}

                    {/*最热管理*/}
                    <Text style={styles.groupTitle}>最热管理</Text>
                    {/*自定义标签*/}
                    {this.getItem(MORE_MENU.Custom_Key)}
                    {/*标签排序*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Key)}
                    {/*标签移除*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Remove_Key)}

                    {/*设置*/}
                    <Text style={styles.groupTitle}>设置</Text>
                    {/*自定义主题*/}
                    {this.getItem(MORE_MENU.Custom_Theme)}
                    {/*关于作者*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.About_Author)}
                    <View style={GlobalStyles.line}/>
                    {/*反馈*/}
                    {this.getItem(MORE_MENU.Feedback)}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.CodePush)}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    item: {
        backgroundColor: 'white',
        height: 60,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'grey'
    }
})
