import React, { Component } from 'react'
import { View, Text, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteDao from '..//expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        this.params  = this.props.navigation.state.params
        const  {projectModel, flag} = this.params
        this.favoriteDao = new FavoriteDao(flag)
        const title = projectModel.item.full_name || projectModel.item.fullName
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
        this.state = {
            title: title,
            url: this.url,
            canGoBack:  false,
            isFavorite: projectModel.isFavorite
        }
        let key = projectModel.item.fullName || projectModel.item.id.toString()
        if(projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }
    onBack() {
        if(this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onFavoriteButtonClick() {
        const {projectModel, callback} = this.params
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
        callback(isFavorite)
        this.setState({
            isFavorite: isFavorite
        })
    }
    _genRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>{
                        this.onFavoriteButtonClick()
                    }}
                >
                    <FontAwesome
                        name={this.state.isFavorite? 'star' :'star-o'}
                        size={20}
                        style={{color: 'white', marginRight: 10, marginTop: 2}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(()=>{

                })}
            </View>
        )
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
            leftButton = {ViewUtil.getLeftBackButton(()=> this.onBack())}
            title={this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            titleLayoutStyle={titleLayoutStyle}
            rightButton={this._genRightButton()}
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
