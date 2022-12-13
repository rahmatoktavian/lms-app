import { ScrollView } from 'react-native';
import { Appbar, Card, List, Text } from 'react-native-paper';

export default function DetailMateriScreen({ navigation }) {
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

				<List.Item
					title="Modul 1"
					right={props => <List.Icon {...props} icon="download" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
				<List.Item
					title="Modul 2"
					right={props => <List.Icon {...props} icon="download" />}
					style={{ marginVertical: 10 }}
					onPress={() => navigation.navigate('DetailMateriScreen')}
				/>
			</ScrollView>
		</>
	);
}
