import React, {Component} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Picker, TextInput, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;

export default class Exchange extends Component {

  static navigationOptions = {
    title: 'Exchange',
  };

  constructor(props){
    super(props);

    this.state = {
      isLoading : true,
      currencies: [],
      currency : 'USD',
      plnText: 'Mam',
      foreignText : 'Chcę'
    };
    this.getNbpTable();
  }

  getNbpTable() {
    return fetch('http://api.nbp.pl/api/exchangerates/tables/c?format=json')
      .then((response) => response.json())
      .then((responseJson) => {
        let table = responseJson[0];
        table.rates.map((data) => {
          this.state.currencies.push(data.code);
        });
        this.setState({
          isLoading : false
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderPickerItem(data, index){
    return (
      <Picker.Item key={index} label={data} value={data}></Picker.Item>
    )
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
        <View>
          <Text>{this.state.plnText}</Text>
          <TextInput/>
          <Text>PLN</Text>
        </View>
        <View>
          <Text>{this.state.foreignText}</Text>
          <TextInput/>
          <Picker selectedValue={this.state.currency}
                  onValueChange={(itemValue, itemIndex) => this.setState({currency: itemValue})}>
            {this.state.currencies.map((data, index) => {
              return this.renderPickerItem(data, index);
            })}
          </Picker>
        </View>

        <TouchableWithoutFeedback>
          <Text>
            Odwróć
          </Text>
        </TouchableWithoutFeedback>
        <Button title={'Oblicz'} />
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