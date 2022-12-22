import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, List, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import Loader from '../../comp/Loader';

export default function DetailMateriScreen({ navigation, route }) {
	const [loading, setLoading] = useState(false);
	const { id } = route.params;
	const [detailMateri, setDetailMateri] = useState([]);

	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('kelas_materi_file')
			.select('id,label,tipe,materi_url')
			.order('urutan', { ascending: true })
			.eq('kelas_materi_id', id);

		if (!error) {
			setDetailMateri(data);
		}
		setLoading(false)
	}


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Materi Belajar" />
			</Appbar.Header>

			<Loader loading={loading} />

			<ScrollView>
				{detailMateri &&
					detailMateri.map((val, idx) => (
						<List.Item
							key={idx}
							title={val.label}
							left={props => <List.Icon {...props} icon={val.tipe === 'file' ? 'file-document' : val.tipe === 'video' ? 'play-circle' : val.tipe === 'link' && 'link'} />}
							right={props => <List.Icon {...props} icon="arrow-right" />}
							style={{ marginVertical: 10 }}
							onPress={() => navigation.navigate('DetailMateriWebViewScreen', { label: val.label, url: val.materi_url, tipe: val.tipe })}
						/>
					))
				}
			</ScrollView>
		</>
	);
}
