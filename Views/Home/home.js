import React, {Component} from 'react';
import {StyleSheet,TouchableOpacity, Button, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height*0.8;

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
        <View >
          <TouchableOpacity style={styles.buttonContainer} onPress={()=>navigate('TableSummary')} >
            <View style={styles.buttonContText}>
              <Text style={styles.buttonText}>All currencies</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View >
          <TouchableOpacity style={styles.buttonContainer}  onPress={()=>navigate('Exchange')} >
            <View style={styles.buttonContText}>
              <Text style={styles.buttonText}>Exchange</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },buttonContainer: {
    margin:10,
    width: DeviceWidth,
    backgroundColor: '#4286f4',
    height: DeviceHeight * 0.5
  },buttonContText:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },buttonText:{
    color: 'white',
    fontSize:40,
  }

});