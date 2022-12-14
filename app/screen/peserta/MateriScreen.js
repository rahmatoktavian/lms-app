import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function MateriScreen({ navigation, route }) {
	const { id } = route.params;
	const [materi, setMateri] = useState([]);

	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		const { data, error } = await supabase
			.from('kelas_materi')
			.select('id,label,deskripsi')
			.eq('kelas_id', id);

		if (!error) {
			setMateri(data);
		}
	}


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Akademi Bank Sampah" />
			</Appbar.Header>

			<ScrollView>

				{materi &&
					materi.map((val, idx) => (
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
