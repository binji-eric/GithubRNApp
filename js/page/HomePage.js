import React, { Component } from 'react'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import NavigationUtil from '../navigator/NavigationUtil'

export default class HomePage extends Component {
    static router = DynamicTabNavigator.router;
    constructor(props) {
        super(props);
    }
    render() {
        NavigationUtil.navigation = this.props.navigation
        return (
            <DynamicTabNavigator navigation={this.props.navigation}/>
        )
    }
}
