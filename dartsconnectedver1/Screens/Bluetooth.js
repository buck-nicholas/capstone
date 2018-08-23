import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Switch,
    TouchableOpacity,
    ToastAndroid
  } from 'react-native';
  var _ = require('lodash');
  import BluetoothSerial from 'react-native-bluetooth-serial'
  // import convertInput from '../components/InputConverter'
  class Bluetooth extends Component {
    constructor (props) {
        super(props)
        this.state = {
          isEnabled: false,
          discovering: false,
          devices: [],
          unpairedDevices: [],
          connected: false,
          lastHit: {
            Number: '0',
            Type: 'Dart Not Thrown'
          },
        }
      }
      componentWillMount(){
     
        Promise.all([
          BluetoothSerial.isEnabled(),
          BluetoothSerial.list()
        ])
        .then((values) => {
          const [ isEnabled, devices ] = values
     
          this.setState({ isEnabled, devices })
        })
     
        BluetoothSerial.on('bluetoothEnabled', () => {
     
          Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list()
          ])
          .then((values) => {
            const [ isEnabled, devices ] = values
            this.setState({  devices })
          })
     
          BluetoothSerial.on('bluetoothDisabled', () => {
     
             this.setState({ devices: [] })
     
          })
          BluetoothSerial.on('error', (err) => console.log('Error: ${err.message}'))
     
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
                  value.Type = types[i-20];
              }
              value.Number = i + 1;
              value.Type = Types[inputs[i].indexOf(recieved)];
            }
          }
          if(value.Number != ''){this.setState({ lastHit: value})}
          })
        })
      }
      connect (device) {
        this.setState({ connecting: true })
        BluetoothSerial.connect(device.id)
        .then((res) => {
          console.log(`Connected to device ${device.name}`);
          
          ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
        })
        .catch((err) => console.log((err.message)))
      }
      _renderItem(item){
     
        return(<TouchableOpacity onPress={() => this.connect(item.item)}>
                <View style={styles.deviceNameWrap}>
                  <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
                </View>
              </TouchableOpacity>)
      }
      enable () {
        BluetoothSerial.enable()
        .then((res) => this.setState({ isEnabled: true }))
        .catch((err) => Toast.showShortBottom(err.message))
      }
     
      disable () {
        BluetoothSerial.disable()
        .then((res) => this.setState({ isEnabled: false }))
        .catch((err) => Toast.showShortBottom(err.message))
      }
     
      toggleBluetooth (value) {
        if (value === true) {
          this.enable()
        } else {
          this.disable()
        }
      }
      discoverAvailableDevices () {
        
        if (this.state.discovering) {
          return false
        } else {
          this.setState({ discovering: true })
          BluetoothSerial.discoverUnpairedDevices()
          .then((unpairedDevices) => {
            const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
            console.log(uniqueDevices);
            this.setState({ unpairedDevices: uniqueDevices, discovering: false })
          })
          .catch((err) => console.log(err.message))
        }
      }
      toggleSwitch(){
        BluetoothSerial.write("T")
        .then((res) => {
          console.log(res);
          console.log('Successfuly wrote to device')
          this.setState({ connected: true })
        })
        .catch((err) => console.log(err.message))
      }
      render() {
     
        return (
          <View style={styles.container}>
          <View style={styles.toolbar}>
                <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
                <View style={styles.toolbarButton}>
                  <Switch
                    value={this.state.isEnabled}
                    onValueChange={(val) => this.toggleBluetooth(val)}
                  />
                </View>
          </View>
            <Button
              onPress={this.discoverAvailableDevices.bind(this)}
              title="Scan for Devices"
              color="#841584"
            />
            <FlatList
              style={{flex:1}}
              data={this.state.devices}
              keyExtractor={item => item.id}
              renderItem={(item) => this._renderItem(item)}
            />
            <Text>Dart Hit: {this.state.lastHit.Type} {this.state.lastHit.Number}</Text>
            
          </View>
        );
      }
    }
    
export default Bluetooth

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
      },
      toolbar:{
        paddingTop:30,
        paddingBottom:30,
        flexDirection:'row'
      },
      toolbarButton:{
        width: 50,
        marginTop: 8,
      },
      toolbarTitle:{
        textAlign:'center',
        fontWeight:'bold', 
        fontSize: 20,
        flex:1,
        marginTop:6
      },
      deviceName: {
        fontSize: 17,
        color: "black"
      },
      deviceNameWrap: {
        margin: 10,
        borderBottomWidth:1
      }
    });