import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import BaseItem from './BaseItem'

export default class TrendingItem extends BaseItem {
    render() {
        const { projectModel } = this.props
        const item = projectModel.item
        if(!item)
            return null;

        return (
            <TouchableOpacity
                onPress={() => this.onItemClick()}
            >
                <View style={styles.cellContainer}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author: </Text>
                            {item.contributors.map((item, i) => {
                                return i < 5? (<Image 
                                            key={i}
                                            style={{height: 22, width: 22, margin: 2}}
                                            source={{uri: item}}
                                        />): null
                            })}
                        </View>
                        <View style={styles.row}>
                            <Text>Stars:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {this._favoriteIcon()}
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    cellContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 0.5,
        shadowColor: 'grey',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowRadius: 1,
        elevation: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    }
})