import React, {Component} from 'react';
import {Image, StyleSheet, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

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
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, alignSelf: 'stretch', flexDirection: 'row', marginBottom:10,borderBottomWidth: 1, borderBottomColor: 'black' }}>
        <View style={{justifyContent: 'center',alignItems: 'center',  flex: 1, alignSelf: 'stretch' }} >
          <Text style={{fontWeight: 'bold'}}>
            Currency
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, alignSelf: 'stretch' }} >
          <Text style={{fontWeight: 'bold'}}>
            Bid
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, alignSelf: 'stretch' }} >
          <Text style={{fontWeight: 'bold'}}>
            Ask
          </Text>
        </View>
      </View>
    );
  }

  renderRow(currency, bid, ask, index) {
    const items = [
      {
        id: 'AUD',
        image: require('../img/AUD.png'),
      },
      {
        id: 'CAD',
        image: require('../img/CAD.png'),
      },
      {
        id: 'CHF',
        image: require('../img/CHF.png'),
      },
      {
        id: 'CZK',
        image: require('../img/CZK.png'),
      },
      {
        id: 'DKK',
        image: require('../img/DKK.png'),
      },
      {
        id: 'EUR',
        image: require('../img/EUR.png'),
      },
      {
        id: 'GBP',
        image: require('../img/GBP.png'),
      },
      {
        id: 'HUF',
        image: require('../img/HUF.png'),
      },
      {
        id: 'JPY',
        image: require('../img/JPY.png'),
      },
      {
        id: 'NOK',
        image: require('../img/NOK.png'),
      },
      {
        id: 'SEK',
        image: require('../img/SEK.png'),
      },
      {
        id: 'USD',
        image: require('../img/USD.png'),
      },
      {
        id: 'XDR',
        image: require('../img/XDR.png'),
      }
    ];
    let path = items.find(x => x.id === currency).image;
    return (
      <View key={index} style={{justifyContent: 'center', alignItems: 'center',  height:100, alignSelf: 'stretch', flexDirection: 'row', backgroundColor: 'white', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: 'black' }}>
        <View style={{justifyContent: 'center', alignItems: 'center',  flex: 1, alignSelf: 'stretch', flexDirection: 'row', marginLeft:10}}>
          <Text style={{fontSize:30}}>
            {currency}
          </Text>
          <Image
            style={{marginLeft:20, width: 30, height: 30}}
            source={path} />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center',  flex: 1, alignSelf: 'stretch' }} >
          <Text style={{fontSize:30}}>
            {Math.round(bid*100)/100}
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center',  flex: 1, alignSelf: 'stretch' }} >
          <Text style={{fontSize:30}}>
            {Math.round(ask*100)/100}
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
      <ScrollView style={styles.container}>
        <Text  style={{fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontSize:30}}>Exchange rates for: {this.state.table.effectiveDate}</Text>
        {this.renderHeaderRow()}
        {
          this.state.table.rates.map((data, index) => {
            return this.renderRow(data.code, data.bid, data.ask, index)
          })
        }
      </ScrollView>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    //backgroundColor: '#F5FCFF',
  },
  row: {
    marginLeft: 20,
    flexDirection: 'row',
    textAlign: 'left',
    marginBottom:20,
    height:50,
    alignItems:'center',
    backgroundColor: 'skyblue'
  },
  leftName:{
    fontWeight:'bold',
    width: DeviceWidth * 0.3
  }
});