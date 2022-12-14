import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import LoginScreen from '../screen/auth/LoginScreen';

export default function AuthNav() {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LoginScreen" component={LoginScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}