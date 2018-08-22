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

class GameScreen extends Component {

    state = {
        lobbyID: '',
        playerOne: '',
        playerOneScore: '0',
        playerOneDarts: [0,0,0],
        PlayerOnePointsPerDart: '0',
        playerTwo: '',
        playerTwoScore: '0',
        playerTwoDarts: [0,0,0],
        PlayerTwoPointsPerDart: '0',
    }

    componentWillMount(){
        var that = this;
        database = firebase2.database();
        var ref = database.ref('games');
        var thisGame = [];
        var thisID = this.props.navigation.state.params;
        ref.once('value', snapshot => {
            snapshot.forEach(function(data) {
                let result = data.val();
                result['key'] = data.key;
                if(result.key == thisID){
                    thisGame.push(result);
                }
            })
        }).then(function(){
            that.setState({
                playerOne: thisGame[0].playerOne,
                playerTwo: thisGame[0].playerTwo,
                lobbyID: thisGame[0].key,
            })
        })
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{width: '100%', height: '10%', backgroundColor: 'powderblue', justifyContent: 'center'}}>
                <Text>Player One: {this.state.playerOne}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.playerOneDarts[0]}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'powderblue'}}>
                <Text>{this.state.playerOneDarts[1]}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.playerOneDarts[2]}</Text>
                </View>
                <View style={{width: '40%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.PlayerOnePointsPerDart}</Text>
                </View>
                <View style={{width: '100%', height: '25%', backgroundColor: 'powderblue'}}/>
                <View style={{width: '100%', height: '10%', backgroundColor: 'skyblue'}}/>
                <View style={{width: '100%', height: '25%', backgroundColor: 'powderblue'}}/>
                <View style={{width: '40%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.PlayerTwoPointsPerDart}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.playerTwoDarts[0]}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'powderblue'}}>
                <Text>{this.state.playerTwoDarts[1]}</Text>
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                <Text>{this.state.playerTwoDarts[2]}</Text>
                </View>
                <View style={{width: '100%', height: '10%', backgroundColor: 'powderblue'}}>
                <Text>Player Two: {this.state.playerTwo}</Text>
                </View>
            </View>
        )
    }
}
export default GameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    }
})