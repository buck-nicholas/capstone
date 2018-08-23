import React, {Component} from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet
} from 'react-native';
import {Button} from '../components/Button';


class DashBoard extends Component {
    render () {
        return (
            <View style={styles.container}>
                <Button onPress={() => this.props.navigation.navigate('CreateGame')}>Create New Game Lobby</Button>
                <Button onPress={() => this.props.navigation.navigate('JoinGame')}>Join Existing Game Lobby</Button>
                <Button onPress={() => this.props.navigation.navigate('Bluetooth')}>Join Existing Game Lobby</Button>
            </View>
        )
    }
}
export default DashBoard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})