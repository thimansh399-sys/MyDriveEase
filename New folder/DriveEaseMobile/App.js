import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#101924',
		primary: '#4ade80',
		card: '#222e3a',
		text: '#fff',
		border: '#4ade80',
		notification: '#4ade80',
	},
};

function PlaceholderScreen({ title }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101924' }}>
			<Text style={{ color: '#4ade80', fontSize: 28, fontWeight: 'bold' }}>{title}</Text>
		</View>
	);
}

export default function App() {
	return (
		<NavigationContainer theme={theme}>
			<Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Splash" component={SplashScreen} />
				<Stack.Screen name="Auth" children={() => <PlaceholderScreen title="Auth" />} />
				<Stack.Screen name="Home" component={require('./screens/HomeScreen').default} />
				<Stack.Screen name="Booking" component={require('./screens/BookingScreen').default} />
				<Stack.Screen name="Cars" children={() => <PlaceholderScreen title="Cars" />} />
				<Stack.Screen name="Profile" component={require('./screens/ProfileScreen').default} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

