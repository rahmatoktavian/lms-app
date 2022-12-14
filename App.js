import React, { useState, useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { AlertNotificationRoot } from 'react-native-alert-notification';

import 'react-native-url-polyfill/auto';
import { supabase } from './app/config/supabase';
import PesertaNav from './app/nav/PesertaNav';
import AuthNav from './app/nav/AuthNav';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'green',
		primaryContainer: '#dce6da',
		secondary: 'orange',
		secondaryContainer: '#dce6da',
		surfaceVariant: '#dce6da',
	},
};

export default function App() {
	const [appSession, setAppSession] = useState(null)
	
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setAppSession(session)
		})
	
		supabase.auth.onAuthStateChange((_event, session) => {
			setAppSession(session)
		})
	}, [])

	return (
		<PaperProvider theme={theme}>
			<AlertNotificationRoot>
			{appSession && appSession.user ? <PesertaNav /> : <AuthNav />}
			</AlertNotificationRoot>
		</PaperProvider>
	);
}

AppRegistry.registerComponent(appName, () => Main);