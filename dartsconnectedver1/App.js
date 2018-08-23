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

import LoginScreen from './Screens/LoginScreen';
import DashBoard from './Screens/DashBoard';
import CreateGame from './Screens/CreateGame';
import JoinGame from './Screens/JoinGame';
import GameScreen from './Screens/GameScreen';
import Bluetooth from './Screens/Bluetooth';

import {StackNavigator} from 'react-navigation'

const AppStackNavigator = new StackNavigator({
  LoginScreen:{screen:LoginScreen},
  DashBoard:{screen:DashBoard},
  CreateGame:{screen:CreateGame},
  JoinGame:{screen:JoinGame},
  GameScreen:{screen:GameScreen},
  Bluetooth:{screen:Bluetooth}
},
{
  headerMode: 'none'
},
)

// type Props = {};
export default class App extends React.Component {

  render() {
    return (
      <AppStackNavigator />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
