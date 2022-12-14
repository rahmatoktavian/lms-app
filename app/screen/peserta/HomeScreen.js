import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, ProgressBar, Button, List } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function HomeScreen({ navigation }) {
	const [kelas, setKelas] = useState([]);

	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		const { data, error } = await supabase
			.from('kelas_peserta')
			.select('id, kelas:kelas_id ( id,label, deskripsi)')
			.eq('peserta_id', '9def004d-8cd1-40b9-a069-53b77e2656d3');

		if (!error) {
			setKelas(data);
			console.log(kelas);
		}
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="LMS" />
			</Appbar.Header>

			<List.Item
				title="Rians"
				description="0881 1991 0050"
				left={props => <List.Icon {...props} icon="account" />}
				style={{ marginVertical: 20 }}
			/>

			<ScrollView>

				{kelas && (
					kelas.map((val, idx) => (
						<Card style={{ margin: 10 }} key={idx} onPress={() => navigation.navigate('KelasScreen', { id: val.kelas.id })}>
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
