import { ScrollView, View } from 'react-native';
import { Appbar, Button, List } from 'react-native-paper';

export default function MateriScreen({ navigation }) {
	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Akademi Bank Sampah" />
			</Appbar.Header>

			<ScrollView>
				<List.Item
					title="Pengenalan"
					right={props => <List.Icon {...props} icon="arrow-right" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
				<List.Item
					title="Konsep"
					right={props => <List.Icon {...props} icon="arrow-right" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
				<List.Item
					title="Praktikum"
					right={props => <List.Icon {...props} icon="arrow-right" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
				<List.Item
					title="Studi Kasus"
					right={props => <List.Icon {...props} icon="arrow-right" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
			</ScrollView>
		</>
	);
}
