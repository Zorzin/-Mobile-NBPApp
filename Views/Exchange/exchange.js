import React, {Component} from 'react';
import {StyleSheet, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;

export default class Exchange extends Component {

  static navigationOptions = {
    title: 'Exchange',
  };
  
  constructor(props){
    super(props)

    this.state = {
    }
  }


  render(){

    return(
      <View style={styles.container}>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  row: {
    marginLeft: 20,
    flexDirection: 'row',
    textAlign: 'left',
    marginBottom:20,
    height:50,
    alignItems:'center'
  },
  leftName:{
    fontWeight:'bold',
    width: DeviceWidth * 0.3
  }
});