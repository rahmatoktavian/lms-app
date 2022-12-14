import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Appbar, Button, Card, TextInput } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function CariKelasScreen({ navigation }) {
	const [visible, setVisible] = useState(false);
	const [kode, setKode] = useState('');
	const [kelas, setKelas] = useState([]);

	const cariKelas = async () => {
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
	}

	const joinKelas = async () => {
		const { error } = await supabase
			.from('kelas_peserta')
			.insert({ kelas_id: kelas.id, peserta_id: '9def004d-8cd1-40b9-a069-53b77e2656d3', tanggal_mulai: new Date() })

		if (!error) {
			await navigation.navigate('HomeScreen');
		}
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Gabung Kelas" />
			</Appbar.Header>

			<ScrollView>
				<View style={{ flexDirection: 'row', margin: 20 }}>
					<TextInput
						label="Kode Kelas"
						mode="outlined"
						value={kode}
						onChangeText={val => setKode(val)}
					/>
					<Button mode="contained" onPress={() => cariKelas()} style={{ margin: 10 }}>Cari</Button>
				</View>
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