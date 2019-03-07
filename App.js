import {createStackNavigator, createAppContainer} from 'react-navigation';

import Home from './Views/Home/home'
import Exchange from './Views/Exchange/exchange'
import TableSummary from './Views/TableSummary/tablesummary'

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  Exchange: {screen: Exchange},
  TableSummary: {screen: TableSummary},
});

const App = createAppContainer(MainNavigator);

export default App;