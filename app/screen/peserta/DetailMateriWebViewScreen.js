import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, List, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import { WebView } from 'react-native-webview';

export default function DetailMateriWebViewScreen({ navigation, route }) {
	const { kelasId, materiFileId, label, url, tipe, pesertaId, kelasPesertaId } = route.params;


	useEffect(() => {
		insertLog();
	}, [])


	const insertLog = async () => {
		const { data } = await supabase
			.from('kelas_materi_file_log')
			.select('id')
			.eq('peserta_id', pesertaId)
			.eq('kelas_materi_file_id', materiFileId);
		console.log('dceks', data);
		if (data === [] || data.length === 0 || data === null) {
			const { error } = await supabase
				.from('kelas_materi_file_log')
				.insert({ kelas_peserta_id: kelasPesertaId, kelas_materi_file_id: materiFileId, kelas_id: kelasId, peserta_id: pesertaId, waktu_akses: new Date() })
			console.log('errrs', error);
		}
	}

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
