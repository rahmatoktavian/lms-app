import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import HomeScreen from '../screen/peserta/HomeScreen';
import CariKelasScreen from '../screen/peserta/CariKelasScreen';
import KelasScreen from '../screen/peserta/KelasScreen';
import PreTestScreen from '../screen/peserta/PreTestScreen';
import UjianScreen from '../screen/peserta/UjianScreen';
import MateriScreen from '../screen/peserta/MateriScreen';
import DetailMateriScreen from '../screen/peserta/DetailMateriScreen';
import DetailMateriWebViewScreen from '../screen/peserta/DetailMateriWebViewScreen';

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
				<Stack.Screen name="DetailMateriWebViewScreen" component={DetailMateriWebViewScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}