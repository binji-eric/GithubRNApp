import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, TextInput} from 'react-native'

export default class FetchDemoPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
    }
    loadData () {
        fetch(`https://api.github.com/search/repositories?q=${this.searchKey}`)
            .then(response => {
                if(response.ok) {
                    return response.text()
                } else {
                    throw new Error('network response was not ok')
                }
            })
            .then(responseText => {
                this.setState({
                    showText: responseText
                })
            })
            .catch( e => {
                this.setState({
                    showText: e.toString()
                })
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>FetchDemoPage</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.searchKey = text
                    }}
                ></TextInput>
                <Button
                        title={'获取数据'}
                        onPress= {
                            () => {
                               this.loadData()
                            }
                        }>
                </Button>
                <Text>
                    {this.state.showText}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    input: {
        height: 30,
        width: 60,
        borderColor: 'black',
        borderWidth: 2
    }
})
