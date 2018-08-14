/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase from '@firebase/app'
import '@firebase/auth'
import {Input} from './components/Input.js';
import {Button} from './components/Button';
import {firebaseKey, firebaseAuthDom} from './components/Keys';





// type Props = {};
export default class App extends React.Component {
  state = {
    email: '',
    password: ''
  }

  componentWillMount() {
    const firebaseConfig = {
      apiKey: firebaseKey,
      authDomain: firebaseAuthDom,
    }

    firebase.initializeApp(firebaseConfig);
  };

  signUpUser = (email, password) => {
    if (this.state.password.length < 6) {
      alert("Please enter a password that is a minimum of 6 characters long!")
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
  }

  loginUser = (email, password) => {
    try{
      firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        console.log(user)
      })
    }
    catch(error){
      alert('No')
    }
    alert('yes')
  }

  render() {
    return (
      <View style={styles.container}>
        <Input 
        placeholder='Enter your Email'
        label='Email'
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        />
        <Input 
        placeholder='Enter your Password'
        label='Password'
        secureTextEntry
        onChangeText={password => this.setState({ password })}
        value={this.state.password}
        />
        <Button onPress={() => this.loginUser(this.state.email, this.state.password)}> Log In </Button>
        <Button onPress={() => this.signUpUser(this.state.email, this.state.password)}> Sign Up </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
