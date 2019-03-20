import React, {Component} from 'react';
import {DatePickerAndroid, TouchableWithoutFeedback, StyleSheet, Picker, TextInput, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

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
      plnText: 'I have',
      foreignText : 'I want',
      plnValue: '100',
      foreignValue : '',
      plnWant : false,
      foreignWant: true,
      finishValue: 0,
      canRenderExchange: false,
      canRenderError: false,
      date: new Date(),
      canRenderAdvanced: false
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
    this.setState({plnText: this.state.plnWant === true ? "I have" : "I want" });
    this.setState({foreignText: this.state.foreignWant === true ? "I have" : "I want" });
    this.setState({plnWant : !this.state.plnWant});
    this.setState({foreignWant : !this.state.foreignWant});
    this.setState({canRenderExchange: false});
    this.setState({canRenderError: false});
  }

  onAdvancedButton(){
    if (this.state.canRenderAdvanced){
      this.setState({date: new Date()});
    }
    this.setState({canRenderAdvanced: !this.state.canRenderAdvanced});
    this.setState({canRenderExchange: false});
    this.setState({canRenderError: false});
  }

  setForeignValue(text) {
    this.setState({canRenderExchange: false});
    this.setState({canRenderError: false});
    this.setState({foreignValue : this.getAmountWithoutText(text)});
    this.setState({plnValue: ''});
  }

  setPLNValue(text) {
    this.setState({canRenderExchange: false});
    this.setState({canRenderError: false});
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
    try {
      const response = await fetch('http://api.nbp.pl/api/exchangerates/rates/c/' + currency + '/' + date + '?format=json');
      const json = await response.json();
      let rate = json.rates[0];
      if (bid === true){
        this.setState({rateValue:rate.bid});
        this.setState({canRenderExchange: true});
        this.setState({canRenderError: false});
      } else{
        this.setState({rateValue:rate.ask});
        this.setState({canRenderExchange: true});
        this.setState({canRenderError: false});
      }
    } catch (e) {

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

  onPickerValueChange(itemValue, itemIndex) {
    this.setState({currency: itemValue});
    this.setState({canRenderExchange: false});
    this.setState({canRenderError: false});
  }

  openDatePicker = async(date) => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: date,
        maxDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({date: new Date(year,month,day)});
        this.setState({canRenderExchange: false});
        this.setState({canRenderError: false});
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
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

        <View style={{flexDirection: 'row', height: 50, borderBottomColor: 'black', borderBottomWidth: 2, borderTopColor: 'black', borderTopWidth: 2}}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderRightWidth: 2, borderRightColor: 'black'}}>
            <Text style={{width:DeviceWidth*0.2, fontSize:20, fontWeight: 'bold'}}>
              {this.state.plnText}
            </Text>
          </View>
          <TextInput
            style={{width:DeviceWidth*0.5, marginLeft:10}}
            keyboardType = 'numeric'
            onChangeText = {(text) => this.setPLNValue(text)}
            value = {this.state.plnValue}/>
          <View style={{borderLeftColor:'black', borderLeftWidth:2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:15, fontWeight: 'bold', marginLeft:10}}>PLN</Text>
          </View>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', height:50}}>
          <TouchableWithoutFeedback onPress = {() => this.onRevertButton()}>
            <Text style={{fontSize:15, fontWeight: 'bold'}}>
              Reverse
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <View style={{flexDirection: 'row', height: 50, borderBottomColor: 'black', borderBottomWidth: 2, borderTopColor: 'black', borderTopWidth: 2}}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderRightWidth: 2, borderRightColor: 'black'}}>
            <Text style={{width:DeviceWidth*0.2, fontSize:20, fontWeight: 'bold'}}>
              {this.state.foreignText}
            </Text>
          </View>
          <TextInput
            style={{width:DeviceWidth*0.5, marginLeft:10}}
            keyboardType = 'numeric'
            onChangeText = {(text) => this.setForeignValue(text)}
            value = {this.state.foreignValue}/>
          <View style={{borderLeftColor:'black', borderLeftWidth:2}}>
            <Picker
              style={{width:DeviceWidth*0.25}}
              selectedValue={this.state.currency}
              onValueChange={(itemValue, itemIndex) => this.onPickerValueChange(itemValue, itemIndex)}>
              {this.state.currencies.map((data, index) => {
                return this.renderPickerItem(data, index);
              })}
            </Picker>
          </View>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', height:50}}>

          <TouchableWithoutFeedback onPress = {() => this.onAdvancedButton()}>
            <Text style={{fontSize:15, fontWeight: 'bold'}}>
              Advanced
            </Text>
          </TouchableWithoutFeedback>
        </View>

        {this.renderAdvanced()}
        <Button onPress = {() => this.calculate()} title={'Calculate'} />

        {this.renderExchange()}
        {this.renderError()}
      </View>
    );
  }

  renderAdvanced(){
    if (!this.state.canRenderAdvanced){
      return null;
    }

    return <View style={{justifyContent: 'center', alignItems: 'center', flexDirection:'row', marginBottom: 20}}>
      <Text  style={{fontSize:15, fontWeight: 'bold'}}>
        Select exchange date:
      </Text>
      <TouchableWithoutFeedback onPress={this.openDatePicker.bind(this,this.state.date)}>
        <Text style={styles.dateFormat}>{this.state.date.toDateString()}</Text>
      </TouchableWithoutFeedback>
    </View>
  }

  renderError(){
    if (!this.state.canRenderError){
      return null;
    }

    return <View>
      <Text>
        An error occurred, try again later or with other data.
      </Text>
    </View>
  }

  renderExchange() {
    if (!this.state.canRenderExchange){
      return null;
    }

      if (this.state.plnWant === true && this.state.plnValue){
        return <View style={styles.answer}>
          <Text style={styles.answerRateText}>Exchange rate for:  {this.state.date.toISOString().substring(0,10)}</Text>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              You need:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.finishValue} {this.state.currency}
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              to get:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.plnValue} PLN
            </Text>
          </View>
        </View>
      } else if (this.state.plnWant === true && this.state.foreignValue){
        return <View style={styles.answer}>
          <Text style={styles.answerRateText}>Exchange rate for:  {this.state.date.toISOString().substring(0,10)}</Text>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              If you have:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.foreignValue} {this.state.currency}
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              you can get:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.finishValue} PLN
            </Text>
          </View>
        </View>
      } else if (this.state.plnWant === false && this.state.foreignValue){
        return <View style={styles.answer}>
          <Text style={styles.answerRateText}>Exchange rate for:  {this.state.date.toISOString().substring(0,10)}</Text>

          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              You need:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.finishValue} PLN
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              to get:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.foreignValue} {this.state.currency}
            </Text>
          </View>
        </View>
      } else if (this.state.plnWant === false && this.state.plnValue){
        return <View style={styles.answer}>
          <Text style={styles.answerRateText}>Exchange rate for:  {this.state.date.toISOString().substring(0,10)}</Text>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              If you have:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.plnValue} PLN
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerText}>
              you can get:
            </Text>
            <Text style={styles.answerCash}>
              {this.state.finishValue} {this.state.currency}
            </Text>
          </View>
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
  },
  dateFormat:{
    marginLeft: 10,
    width: DeviceWidth * 0.3,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },
  answer:{
    marginTop: 50,
    justifyContent: 'center'
  },
  answerText:{
    width: DeviceWidth*0.4,
    marginLeft:10,
    fontSize:20,
    fontWeight: 'bold'
  },
  answerCash:{
    width: DeviceWidth*0.6,
    marginLeft:10,
    fontSize:20,
    fontWeight: 'bold'
  },
  answerRow:{
    flexDirection: 'row'
  },
  answerRateText:{
    marginBottom: 10,
    alignItems:'center',
    marginLeft:10,
    fontSize:20,
    fontWeight: 'bold'
  }
});