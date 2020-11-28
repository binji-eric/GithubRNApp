import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, TextInput} from 'react-native'
import dataStorage from '../expand/dao/DataStorage'

export default class DataStorageDemoPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
        this.dataStorage = new dataStorage();
    }
    loadData () {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
        this.dataStorage.fetchData(url)
            .then(data => {
                let showData=`初次数据加载时间：${new Date(data.timeStamp)}\n${JSON.stringify(data.data)}}`
                this.setState({
                    showText: showData
                })
            })
            .catch( error => {
                error&&console.log(error.toString())
            })

            
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>离线缓存框架设计</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.searchKey = text
                    }}
                ></TextInput>
                <Button
                        title={'getStorageData'}
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
