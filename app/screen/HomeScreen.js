import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, ProgressBar, Button, List } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
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
				<Card style={{ margin: 10 }} onPress={() => navigation.navigate('KelasScreen')}>
					<Card.Content>
						<Text variant="titleMedium">Akademi Bank Sampah</Text>

						<View style={{ marginVertical: 15 }}>
							<Text variant="labelSmall">Perkembangan: 70%</Text>
							<ProgressBar progress={0.7} />
						</View>

						<Text>Kelas ini mengajarkan peserta untuk memiliki pengetahuan & keterampilan dalam pengolahan sampah</Text>
					</Card.Content>
					<Card.Actions>
						<Button mode="text">Lihat Detil</Button>
					</Card.Actions>
				</Card>
			</ScrollView>

			<Button icon="plus" mode="contained" onPress={() => navigation.navigate('CariKelasScreen')} style={{ margin: 10 }}>Gabung Kelas</Button>
		</>
	);
}
