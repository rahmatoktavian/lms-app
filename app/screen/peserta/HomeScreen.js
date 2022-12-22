import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, ProgressBar, Button, List } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';

export default function HomeScreen({ navigation }) {
	const [loading, setLoading] = useState(false);
	const [kelas, setKelas] = useState([]);
	const [peserta, setPeserta] = useState([]);
	const [pesertaId, setPesertaId] = useState(null);

	useEffect(() => {
		getPeserta();
		getData();
	}, [])

	const getPeserta = async () => {
		setLoading(true)
		await getSession().then(async val => setPesertaId(val.id));
		setLoading(false)
	}


	const getData = async () => {
		setLoading(true)
		await getSession().then(async val => {
			const { data, error } = await supabase
				.from('kelas_peserta')
				.select('id, kelas:kelas_id ( id,label, deskripsi,soal_paket_id)')
				.eq('peserta_id', val.id);

			if (!error) {
				setKelas(data);
				setPeserta(val);
			}
		})
		setLoading(false)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="LMS" />
				<Appbar.Action icon="power-standby" onPress={() => supabase.auth.signOut()} />
			</Appbar.Header>

			<Loader loading={loading} />

			<List.Item
				title={peserta.nama}
				description={peserta.telpon}
				left={props => <List.Icon {...props} icon="account" />}
				style={{ marginVertical: 20 }}
			/>

			<ScrollView>

				{kelas && (
					kelas.map((val, idx) => (
						<Card style={{ margin: 10 }} key={idx} onPress={() => navigation.navigate('KelasScreen', { id: val.kelas.id, pesertaId: pesertaId, kelasLabel: val.kelas.label, soalPaketId: val.kelas.soal_paket_id, kelasPesertaId: val.id })}>
							<Card.Content>
								<Text variant="titleMedium">{val.kelas.label}</Text>

								<View style={{ marginVertical: 15 }}>
									<Text variant="labelSmall">Perkembangan: 70%</Text>
									<ProgressBar progress={0.7} />
								</View>

								<Text>{val.kelas.deskripsi}</Text>
							</Card.Content>
							<Card.Actions>
								<Button mode="text">Lihat Detil</Button>
							</Card.Actions>
						</Card>
					))
				)}

			</ScrollView>

			<Button icon="plus" mode="contained" onPress={() => navigation.navigate('CariKelasScreen')} style={{ margin: 10 }}>Gabung Kelas</Button>
		</>
	);
}
