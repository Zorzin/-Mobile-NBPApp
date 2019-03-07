import React, {Component} from 'react';
import {StyleSheet, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;

export default class Home extends Component {

  static navigationOptions = {
    title: 'NBP App',
  };
  
  constructor(props){
    super(props)

    this.state = {
    }
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View style={styles.container}>
        <Button onPress={()=>navigate('TableSummary')} title='All currencies'/>
        <Button onPress={()=>navigate('Exchange')} title='Exchange'/>
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