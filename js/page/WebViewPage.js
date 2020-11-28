import React, { Component } from 'react'
import { View, Text, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteDao from '../expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

export default class WebViewPage extends Component {
    constructor(props) {
        super(props)
        this.params  = this.props.navigation.state.params
        const {title, url} =  this.params
        this.state = {
            title: title,
            url: url,
            canGoBack:  false,
        }
    }
    onBack() {
        if(this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    
    onNavigationStateChange (navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            uri: navState.url
        })
    }
    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30}: null
        let navigationBar = <NavigationBar 
            title={this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            />
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri:  this.state.url}}
                >
                </WebView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       marginTop: 40
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
})
