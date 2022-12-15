import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Appbar, Button, Card, TextInput } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';

export default function CariKelasScreen({ navigation }) {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [kode, setKode] = useState('');
	const [kelas, setKelas] = useState([]);
	const [pesertaID, setPesertaID] = useState(null);

	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		setLoading(true)
		await getSession().then(async val => setPesertaID(val.id));
		setLoading(false)
	}

	const cariKelas = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('kelas')
			.select('id, label, deskripsi)')
			.eq('kode', kode)
			.single();

		if (data) {
			await setKelas(data);
		} else {
			await setKelas({ 'label': 'Kelas Tidak Ditemukan', 'deskripsi': '' });
		}
		await setVisible(true);
		setLoading(false)
	}

	const joinKelas = async () => {
		setLoading(true)
		const { error } = await supabase
			.from('kelas_peserta')
			.insert({ kelas_id: kelas.id, peserta_id: pesertaID, tanggal_mulai: new Date() })

		if (!error) {
			await navigation.navigate('HomeScreen');
		}
		setLoading(false)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Gabung Kelas" />
			</Appbar.Header>

			<Loader loading={loading} />

			<ScrollView style={{ marginHorizontal: 20 }}>
				<TextInput
					label="Kode Kelas"
					mode="outlined"
					value={kode}
					onChangeText={val => setKode(val)}
				/>
				<Button mode="contained" onPress={() => cariKelas()} style={{ marginVertical: 10 }}>Cari</Button>
			</ScrollView>

			{visible && (
				< Card style={{ margin: 10 }}>
					<Card.Content>
						<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{kelas.label}</Text>
						<Text variant="bodyLarge" style={{ marginVertical: 30 }}>{kelas.deskripsi}</Text>
					</Card.Content>
					<Card.Actions>
						{kelas.id ? (
							<Button icon="arrow-right" mode="contained" onPress={() => joinKelas()} contentStyle={{ flexDirection: 'row-reverse' }}>Gabung</Button>
						) : (
							<Button icon="close" mode="contained" onPress={() => setVisible(false)}>Tutup</Button>
						)}
					</Card.Actions>
				</Card>
			)}
		</>
	);
}