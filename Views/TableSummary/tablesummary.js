import React, {Component} from 'react';
import {StyleSheet, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;

export default class TableSummary extends Component {

  static navigationOptions = {
    title: 'All currencies',
  };
  
  constructor(props){
    super(props);
    this.state = {
      isLoading: true
    };
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


  renderHeaderRow() {
    return (
      <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            Currency
          </Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            Bid
          </Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            Ask
          </Text>
        </View>
      </View>
    );
  }

  renderRow(currency, bid, ask, index) {
    return (
      <View key={index} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            {currency}
          </Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            {bid}
          </Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }} >
          <Text>
            {ask}
          </Text>
        </View>
      </View>
    );
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
      <Text>Trading date: {this.state.table.tradingDate}</Text>
      <Text>Effective date: {this.state.table.effectiveDate}</Text>
      {this.renderHeaderRow()}
      {
        this.state.table.rates.map((data, index) => {
          return this.renderRow(data.code, data.bid, data.ask, index)
        })
      }
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