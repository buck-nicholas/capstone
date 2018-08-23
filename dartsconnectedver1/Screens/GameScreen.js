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
import BluetoothSerial from 'react-native-bluetooth-serial'

class GameScreen extends Component {
constructor(props){
    super(props)
    this.state = {
        // lobbyID: '',
        // playerOne: '',
        // playerOneScore: '0',
        // playerOneDarts: [0,0,0],
        // PlayerOnePointsPerDart: '0',
        // playerTwo: '',
        // playerTwoScore: '0',
        // playerTwoDarts: [0,0,0],
        // PlayerTwoPointsPerDart: '0',
        lastHit: {
            Number: '0',
            Type: 'Dart Not Thrown'
        },
    }
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

        BluetoothSerial.withDelimiter('\r').then(() => {
            Promise.all([
              BluetoothSerial.isEnabled(),
              BluetoothSerial.list(),
            ])
            BluetoothSerial.on('read', data => {
            let inputs = [
                ['4,8','6,8','5,8'], // 1
                ['2,5','0,5','1,5'], // 2
                ['2,7','0,7','1,7'], // 3
                ['4,7','6,7','5,7'], // 4
                ['4,2','6,2','5,1'], // 5
                ['4,5','6,5','5,5'], // 6
                ['2,8','0,8','1,8'], // 7
                ['2,2','0,2','1,2'], // 8
                ['4,0','6,0','5,0'], // 9
                ['4,4','6,4','5,4'], // 10
                ['2,1','0,1','1,1'], // 11
                ['4,1','6,1','5,1'], // 12
                ['4,6','6,6','5,6'], // 13
                ['2,0','0,0','1,0'], // 14
                ['2,4','0,4','1,4'], // 15
                ['2,3','0,3','1,3'], // 16
                ['2,6','0,6','1,6'], // 17
                ['4,9','6,9','5,9'], // 18
                ['2,9','0,9','1,9'], // 19
                ['4,3','6,3','5,3'], // 20
                ['3,1'], // SingleBull
                ['3,0'], // DoubleBull
            ]
            let value = {
              Number: '',
              Type: '',
            }
            let recieved = data.data.trim()
              // console.log('Data from Bluetooth: ${data.data}'), 
            let Types = ['Single','Double','Triple']
            for(i=0;i<inputs.length;i++){
              if(inputs[i].includes(recieved)){
                if(i >= 20){
                    value.Number = 'Bull';
                    value.Type = Types[i-20];
                    break;
                }
                else{
                    value.Number = i + 1;
                    value.Type = Types[inputs[i].indexOf(recieved)];
                    break;
                }
              }
            }
            if(value.Number != ''){this.setState({ lastHit: value})}
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
                {/* <Text>{this.state.playerOneDarts[0]}</Text> */}
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'powderblue'}}>
                {/* <Text>{this.state.playerOneDarts[1]}</Text> */}
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                {/* <Text>{this.state.playerOneDarts[2]}</Text> */}
                </View>
                <View style={{width: '40%', height: '10%', backgroundColor: 'skyblue'}}>
                {/* <Text>{this.state.PlayerOnePointsPerDart}</Text> */}
                </View>
                <View style={{width: '100%', height: '25%', backgroundColor: 'powderblue', justifyContent: 'center'}}>
                <Text>Dart Hit: {this.state.lastHit.Type} {this.state.lastHit.Number}</Text>
                </View>
                <View style={{width: '100%', height: '10%', backgroundColor: 'skyblue'}}/>
                <View style={{width: '100%', height: '25%', backgroundColor: 'powderblue'}}/>
                <View style={{width: '40%', height: '10%', backgroundColor: 'skyblue'}}>
                {/* <Text>{this.state.PlayerTwoPointsPerDart}</Text> */}
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                {/* <Text>{this.state.playerTwoDarts[0]}</Text> */}
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'powderblue'}}>
                {/* <Text>{this.state.playerTwoDarts[1]}</Text> */}
                </View>
                <View style={{width: '20%', height: '10%', backgroundColor: 'skyblue'}}>
                {/* <Text>{this.state.playerTwoDarts[2]}</Text> */}
                </View>
                <View style={{width: '100%', height: '10%', backgroundColor: 'powderblue'}}>
                {/* <Text>Player Two: {this.state.playerTwo}</Text> */}
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