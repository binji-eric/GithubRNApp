import React, { Component } from 'react'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import NavigationUtil from '../navigator/NavigationUtil'
import CustomTheme from './CustomTheme'
import {connect} from 'react-redux';
import actions from '../action';
import {View} from 'react-native'


class HomePage extends Component {
    static router = DynamicTabNavigator.router;
    constructor(props) {
        super(props);
    }
    renderCustomThemeView() {
        const {customThemeViewVisible, onShowCustomThemeView} = this.props;
        return (<CustomTheme
            visible={customThemeViewVisible}
            {...this.props}
            onClose={() => onShowCustomThemeView(false)}
        />);
    }
    render() {
        NavigationUtil.navigation = this.props.navigation
        return (
            <View style={{flex: 1}}>
                <DynamicTabNavigator navigation={this.props.navigation}/>
                {this.renderCustomThemeView()}
            </View>
        )
    }
}


const mapStateToProps = state => ({
    customThemeViewVisible: state.theme.customThemeViewVisible,
    theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
