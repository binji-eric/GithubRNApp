import React from 'react'
import NavigationUtil from "../../navigator/NavigationUtil"
import BackPresComponent from '../../common/BackPressComponent'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import GlobalStyles from '../../share/styles/globalStyles'
import {DeviceInfo,View, Text, Image, Dimensions, StyleSheet, Platform} from "react-native";
import ViewUtil from '../../util/ViewUtil'

const window = Dimensions.get('window');
const THEME_COLOR = '#678'
const AVATAR_SIZE = 90;  // 头像大小
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android;
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};

export default class AboutCommon {
    constructor (props, updateState) {
        this.props = props
        this.updateState = updateState // udpateState是函数
        this.backPress = new BackPresComponent({backPress: () => this.onBackPress()})
    }

    onBackPress () {
        NavigationUtil.goBack(this.props.navigation)
        return true
    }
    componentDidMount () {
        this.backPress.componentDidMount()
        fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network Error');
            })
            .then(config => {
                if (config) {
                    this.updateState({
                        data: config
                    })
                }
            })
            .catch(e => {
                console(e);
            })
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }
    onShare () {

    }
    getParallaxRenderConfig(params) {
        let config = {}
        console.log('params ->>', params)
        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar
        console.log(avatar)
        // 背景内容
        config.renderBackground = () => {
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        }
        // 前景
        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar}
                       source={avatar}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        );
        // 悬浮的header
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );
        // 固定的header
        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
                {ViewUtil.getShareButton(() => this.onShare())}
            </View>
        );
        return config
    }

    render(contentView, params) {
        const renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                backgroundColor={THEME_COLOR}
                contentBackgroundColor={'#f3f3f4'}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}  // 下拉后（正常显示）头部的高度
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}  // 顶部栏的高度
                backgroundScrollSpeed={10}
                {...renderConfig}>
                {contentView}
            </ParallaxScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        alignItems: 'center',
        paddingTop:TOP
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop:TOP
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5,
        marginBottom: 10
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
        marginLeft: 10
    },
})