import React from 'react';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Map from './src/components/map';
import Settings from './src/components/settings';

const TabNavigator = createBottomTabNavigator(
  {
    Map: Map,
    Settings: Settings,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Map') {
          iconName = 'map';
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === 'Settings') {
          iconName = `cog`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#156fca',
      inactiveTintColor: 'gray',
    },
  }
);

export default createAppContainer(TabNavigator);