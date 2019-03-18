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
      foreignText : 'Chcę',
      plnValue: '100',
      foreignValue : '',
      plnWant : true,
      foreignWant: false
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

  getAmountWithoutText(text) {
   return text.replace(/[^0-9,.]/g,'');
  }

  onRevertButton(){
    this.setState({plnWant : !this.state.plnWant});
    this.setState({foreignWant : !this.state.foreignWant});
    this.setState({plnText: this.state.plnWant === true ? "Chcę" : "Mam" });
    this.setState({foreignText: this.state.foreignWant === true ? "Chcę" : "Mam" });
  }

  setForeignValue(text) {
    this.setState({foreignValue : this.getAmountWithoutText(text)});
    this.setState({plnValue: ''});
  }

  setPLNValue(text) {
    this.setState({plnValue : this.getAmountWithoutText(text)});
    this.setState({foreignValue: ''});
  }

  renderPickerItem(data, index){
    return (
      <Picker.Item key={index} label={data} value={data}></Picker.Item>
    )
  }

  render(){
    if (this.state.isLoading){
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
          <TextInput
              keyboardType = 'numeric'
              onChangeText = {(text) => this.setPLNValue(text)}
              value = {this.state.plnValue}/>
          <Text>PLN</Text>
        </View>
        <View>
          <Text>{this.state.foreignText}</Text>
          <TextInput
              keyboardType = 'numeric'
              onChangeText = {(text) => this.setForeignValue(text)}
              value = {this.state.foreignValue}/>
          <Picker selectedValue={this.state.currency}
                  onValueChange={(itemValue, itemIndex) => this.setState({currency: itemValue})}>
            {this.state.currencies.map((data, index) => {
              return this.renderPickerItem(data, index);
            })}
          </Picker>
        </View>

        <TouchableWithoutFeedback
          onPress = {() => this.onRevertButton()}
        >
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