import { ScrollView } from 'react-native';
import { Appbar, Card, List, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function DetailMateriScreen({ navigation, route }) {
	const { id } = route.params;
	const [detailMateri, setDetailMateri] = useState([]);

	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		const { data, error } = await supabase
			.from('kelas_materi_file')
			.select('id,label,tipe,materi_url')
			.eq('kelas_materi_id', id);

		if (!error) {
			setDetailMateri(data);
		}
	}


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Materi : Pengenalan" />
			</Appbar.Header>

			<ScrollView>
				<Card style={{ margin: 10 }}>
					<Card.Content>
						<Text variant="titleMedium">Video Pengenalan</Text>
					</Card.Content>
				</Card>

				{materi &&
					detailMateri.map((val, idx) => (
						<List.Item
							key={idx}
							title={val.label}
							right={props => <List.Icon {...props} icon="arrow-right" />}
							style={{ marginVertical: 10 }}
							onPress={() => navigation.navigate('DetailMateriScreen', { id: val.id })}
						/>
					))
				}

			</ScrollView>
		</>
	);
}
