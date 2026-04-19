import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RideSelectionScreen from '../screens/RideSelectionScreen';
import DriverMatchingScreen from '../screens/DriverMatchingScreen';
import DriverDetailsScreen from '../screens/DriverDetailsScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import RideCompleteScreen from '../screens/RideCompleteScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RideSelection" component={RideSelectionScreen} />
        <Stack.Screen name="DriverMatching" component={DriverMatchingScreen} />
        <Stack.Screen name="DriverDetails" component={DriverDetailsScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="RideComplete" component={RideCompleteScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}