import React, { Component } from 'react'
import {Modal, TouchableOpacity ,Text, StyleSheet, View, DeviceInfo} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpan from '../model/TimeSpan'
export const TimeSpans = [new TimeSpan('今 天', 'since=daily'), 
                    new TimeSpan('本 周', 'since=weekly'), 
                    new TimeSpan('本 月', 'since=monthly')]
export default class TrendingDialog extends Component {
    // constructor(props) {
    //     super(props)
    state = {
            visible: false
        }
    // }
    show() {
        this.setState({
            visible: true
        })
    }
    dismiss() {
        this.setState({
            visible: false
        })
    }
    render() {
        // 关闭或者选择时，回调onClose和onSelect
        const {onClose, onSelect} = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={()=> onClose}
            >
                <TouchableOpacity
                    style={styles.container}
                    onPress={
                        ()=> {this.dismiss();
                        }
                    }
                >
                    <MaterialIcons
                        name={'arrow-drop-up'}
                        size={36}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        {TimeSpans.map((item, index) => {
                            return <TouchableOpacity
                                key={index}
                                onPress={() => { onSelect(item)}}
                                underlayColor='transparent'
                                >
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>{item.showText}</Text>
                                    </View>
                                    {
                                        index!==TimeSpans.length-1?
                                        <View style={styles.line}></View>:null
                                    }
                            </TouchableOpacity>
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        alignItems: 'center'
    },
    arrow: {
        margin: -15,
        marginTop: 40,
        color: 'white',
        padding: 0
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingVertical: 3,
        marginRight: 3
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: 'black',
        padding: 8,
        paddingHorizontal: 26
    },
    line: {
        height: 0.3,
        backgroundColor: 'grey'
    }
})
