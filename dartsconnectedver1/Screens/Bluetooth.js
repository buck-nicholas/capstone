import { BleManager} from 'react-native-ble-plx';
import React, {Component} from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet
} from 'react-native';
import {Button} from '../components/Button';

class Bluetooth extends Component {
    
    render () {
        return (
            <View style={styles.container}>
                <Text>BlueTooth Screen</Text>
            </View>
        )
    }
}
export default Bluetooth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})