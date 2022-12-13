import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { name as appName } from './app.json';
import PesertaNav from './app/nav/PesertaNav';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'green',
		//   secondary: 'orange',
	},
};

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<PesertaNav />
		</PaperProvider>
	);
}

AppRegistry.registerComponent(appName, () => Main);