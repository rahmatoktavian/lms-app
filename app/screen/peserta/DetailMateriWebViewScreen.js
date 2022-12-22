import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, List, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import { WebView } from 'react-native-webview';

export default function DetailMateriWebViewScreen({ navigation, route }) {
	const { label, url, tipe } = route.params;

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={label} />
			</Appbar.Header>

			<WebView
				source={{ uri: (tipe === 'file') ? 'https://docs.google.com/gview?embedded=true&url=' + url : url }}
			/>
		</>
	);
}
