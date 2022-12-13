import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import HomeScreen from '../screen/HomeScreen';
import CariKelasScreen from '../screen/CariKelasScreen';
import KelasScreen from '../screen/KelasScreen';
import PreTestScreen from '../screen/PreTestScreen';
import UjianScreen from '../screen/UjianScreen';
import MateriScreen from '../screen/MateriScreen';
import DetailMateriScreen from '../screen/DetailMateriScreen';

export default function PesertaNav() {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="HomeScreen" component={HomeScreen} />
				<Stack.Screen name="CariKelasScreen" component={CariKelasScreen} />
				<Stack.Screen name="KelasScreen" component={KelasScreen} />
				<Stack.Screen name="PreTestScreen" component={PreTestScreen} />
				<Stack.Screen name="UjianScreen" component={UjianScreen} />
				<Stack.Screen name="MateriScreen" component={MateriScreen} />
				<Stack.Screen name="DetailMateriScreen" component={DetailMateriScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}