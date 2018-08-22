import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Picker,
} from 'react-native';
import {Button} from '../components/Button';
import {Input} from "../components/Input";
import * as firebase2 from 'firebase'
import firebase from '@firebase/app';
import '@firebase/auth';

class CreateGame extends Component {

    state = {
        title: '',
        gameType: '',
        gameState: '',
        playerOne: null,
        playerOneScore: '',
        playerOneDarts: [],
        PlayerOnePointsPerDart: '',
        playerTwo: '',
        playerTwoScore: '',
        playerTwoDarts: [],
        PlayerTwoPointsPerDart: '',
    }

    getUUID = () => {
        const uuidv4 =  require('uuid/v4');
        newID = uuidv4();
        return newID;
    }

    startLobby = () => {
        this.setFields();
        let lobbyID = this.getUUID();
        database = firebase2.database();
        firebase2.database().ref('games/' + lobbyID).set({
            title: this.state.title,
            gameState: this.state.gameState,
            gameType: this.state.gameType,
            playerOne: this.state.playerOne,
            playerTwo: 'emptyPlayer',
        }).then(this.props.navigation.navigate('GameScreen', lobbyID))
    }

    setFields = () => {
        var user = firebase.auth().currentUser;
        this.state.playerOne = user.uid;
        this.state.gameState = 'Awaiting Players';
        if(this.state.gameType === ''){
            this.state.gameType = '501'
        }
    }

    render () {
        return (
            <View style={styles.container}>
                <Input 
                placeholder='Enter Game Title'
                label='Title'
                onChangeText={title => this.setState({ title })}
                value={this.state.email}
                />
                <Picker 
                style={{width: '80%'}}
                prompt='Choose Game Mode'
                selectedValue={this.state.gameType} 
                onValueChange={(itemValue,itemIndex) => this.setState({gameType:itemValue})}>
                <Picker.Item label='501' value ='501'/>
                <Picker.Item label='301' value ='301'/>
                </Picker>
                <Button onPress={() => this.startLobby()}>Start Lobby</Button>
            </View>
        )
    }
}
export default CreateGame;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})