import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import LoginScreen from '../screen/auth/LoginScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';

export default function AuthNav() {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LoginScreen" component={LoginScreen} />
				<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}