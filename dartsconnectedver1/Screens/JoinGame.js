import React, {Component} from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import {Button} from '../components/Button';
import {Input} from "../components/Input";
import * as firebase2 from 'firebase'
import firebase from '@firebase/app';
import '@firebase/auth';


class JoinGame extends Component {

    state = {
        activeGames: []
      }

componentWillMount(){
    var that = this;
    database = firebase2.database();
    var ref = database.ref('games');
    var games = []
    ref.once('value', snapshot => {
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
            if(result.gameState == 'Awaiting Players'){
                games.push(result);
            }
        })
    }).then(function(){
        that.setState({
            activeGames: games
        })
    })
}

joinGame = (gameObj) => {
    var user = firebase.auth().currentUser;
    firebase2.database().ref('games/' + gameObj.key).update({
        playerTwo: user.uid,
        gameState: 'In Progress'
    }).then(this.props.navigation.navigate('Bluetooth', gameObj.key))// .then(this.props.navigation.navigate('GameScreen', gameObj.key)) // direct to bT connect, then pass key to gamescreen
} 

    render () {
        return (
            <View style={styles.container}>
            {/* <Button onPress={() => this.getGames()}>Get Games</Button> */}
            <FlatList 
            data={this.state.activeGames}
            renderItem={({item}) => <Button onPress={() => this.joinGame(item)}><Text style={styles.item}>{item.title}</Text></Button>}
            />
            </View>
        )
    }
}
export default JoinGame;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44
    }
})