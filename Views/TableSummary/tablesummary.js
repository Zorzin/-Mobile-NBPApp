import React, {Component} from 'react';
import {StyleSheet, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;

export default class TableSummary extends Component {

  static navigationOptions = {
    title: 'All currencies',
  };
  
  constructor(props){
    super(props)
    this.state = {
      isLoading: true
    }
    this.getNbpTable();
  }
  
  getNbpTable() {
    return fetch('http://api.nbp.pl/api/exchangerates/tables/c?format=json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          table: responseJson[0],
          isLoading : false
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <Text>Loading....</Text>
        </View>
      )
    }
    
    return(
      <View style={styles.container}>
      <Text>{this.state.table.no}</Text>
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