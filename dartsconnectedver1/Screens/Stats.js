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


class Stats extends Component {

    state = {
        CurrentStats: [],
        mynum: ''
      }

componentWillMount(){
    var that = this
    database = firebase2.database();
    var ref = database.ref('stats/');
    var players = [];
    var user = firebase.auth().currentUser;
    ref.once('value', snapshot => {
        
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
                players.push(result);

        })
    }).then(function(){
        that.setState({
            CurrentStats: players,
            mynum: user.uid,
        })

    })
}

    render () {
        return (
            <View style={styles.container}>
            {/* <Button onPress={() => this.getGames()}>Get Games</Button> */}
            <Text>My id: {this.state.mynum}</Text>
            <FlatList 
            data={this.state.CurrentStats}
            renderItem={({item}) => <Text>{item.key} ppd: {item.ppdAvg}</Text>}
            />
            </View>
        )
    }
}
export default Stats;

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