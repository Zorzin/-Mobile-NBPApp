import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Home from './Views/Home/Home'
import Exchange from './Views/Exchange/Exchange'
import TableSummary from './Views/TableSummary/TableSummary'

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  Exchange: {screen: Exchange},
  TableSummary: {screen: TableSummary},
});

const App = createAppContainer(MainNavigator);

export default App;