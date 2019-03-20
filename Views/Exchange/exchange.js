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
      plnWant : false,
      foreignWant: true,
      finishValue: 0,
      canRenderExchange: false,
      date: new Date()
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
   return text.replace(/[^0-9.]/g,'');
  }

  onRevertButton(){
    this.setState({plnText: this.state.plnWant === true ? "Mam" : "Chcę" });
    this.setState({foreignText: this.state.foreignWant === true ? "Mam" : "Chcę" });
    this.setState({plnWant : !this.state.plnWant});
    this.setState({foreignWant : !this.state.foreignWant});
  }

  setForeignValue(text) {
    this.setState({canRenderExchange: false});
    this.setState({foreignValue : this.getAmountWithoutText(text)});
    this.setState({plnValue: ''});
  }

  setPLNValue(text) {
    this.setState({canRenderExchange: false});
    this.setState({plnValue : this.getAmountWithoutText(text)});
    this.setState({foreignValue: ''});
  }

  async calculate() {

    if(!this.onPressValidate()){
      return;
    }

    let bid = false; //kupno obcej waluty

    if (this.state.plnWant === true && this.state.plnValue){
      bid = true;
    } else if (this.state.plnWant === true && this.state.foreignValue){
      bid = false;
    } else if (this.state.plnWant === false && this.state.foreignValue){
      bid = true;
    } else if (this.state.plnWant === false && this.state.plnValue){
      bid = false;
    }

    await this.getExchangeValue(this.state.currency, this.state.date.toISOString().substring(0,10), bid);

    let finishValue = 0;

    if (this.state.plnValue){
      finishValue = this.state.plnValue / this.state.rateValue;
    } else {
      finishValue = this.state.foreignValue * this.state.rateValue;
    }

    this.setState({finishValue : Math.round(finishValue*100)/100});
  }

  async getExchangeValue(currency, date, bid) {
    const response = await fetch('http://api.nbp.pl/api/exchangerates/rates/c/' + currency + '/' + '2019-03-19' + '?format=json');
    const json = await response.json();
    let rate = json.rates[0];
    if (bid === true){
      this.setState({rateValue:rate.bid});
      this.setState({canRenderExchange: true});
    } else{
      this.setState({rateValue:rate.ask});
      this.setState({canRenderExchange: true});
    }
  }

  onPressValidate() {
    if (!this.state.foreignValue && !this.state.plnValue){
      return false;
    }
    return true;
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
        <Button onPress = {() => this.calculate()} title={'Oblicz'} />

        {this.renderExchange()}
      </View>
    );
  }

  renderExchange() {
    if (!this.state.canRenderExchange){
      return null;
    }

      if (this.state.plnWant === true && this.state.plnValue){
        return <View>
          <Text>
            To get {this.state.plnValue} PLN you need {this.state.finishValue} {this.state.currency}
          </Text>
        </View>
      } else if (this.state.plnWant === true && this.state.foreignValue){
        return <View>
          <Text>
            If you have {this.state.foreignValue} {this.state.currency} you can get {this.state.finishValue} PLN
          </Text>
        </View>
      } else if (this.state.plnWant === false && this.state.foreignValue){
        return <View>
          <Text>
              To get {this.state.foreignValue} {this.state.currency} you need {this.state.finishValue} PLN
          </Text>
        </View>
      } else if (this.state.plnWant === false && this.state.plnValue){
        return <View>
          <Text>
              If you have {this.state.plnValue} PLN you can get {this.state.finishValue} {this.state.currency}
          </Text>
        </View>
      }


    if (this.state.plnWant){

    }
    if (this.state.foreignWant){
      return <View>
        <Text>
          To get {this.state.foreignValue} {this.state.currency} you need {this.state.finishValue} PLN
        </Text>
      </View>
    }
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