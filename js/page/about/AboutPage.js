import React, { Component } from 'react'
import { View,  StyleSheet, TouchableOpacity} from 'react-native'
import NavigationUtil from '../../navigator/NavigationUtil';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MORE_MENU } from '../../common/MORE_MENU';
import GlobalStyles from '../../share/styles/globalStyles'
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './aboutCommon'
import config from '../../share/data/config.json'

const TitleColor = '#678';


export default class AboutPage extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about
        })
        this.state = {
            data: config
        }
    }
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
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }

    getItem(menu) {
        return ViewUtil.getMenuItem(()=> this.onclick(menu), menu, TitleColor)
    }

    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
            <View style={GlobalStyles.line}/>
        </View> 
        return this.aboutCommon.render(content, this.state.data.app)
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
