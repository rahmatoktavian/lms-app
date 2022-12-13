import { ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, withTheme } from 'react-native-paper';

function PreTestScreen({ navigation, theme }) {

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Akademi Bank Sampah" />
			</Appbar.Header>

			<ScrollView>
				<Card style={{ margin: 10 }}>
					<Card.Content>
						<Text variant="titleMedium">Kerjakan Soal</Text>
						<Text>Soal terdiri 50 Pilihan Ganda, kerjakan seluruh soal dengan teliti.</Text>
					</Card.Content>
				</Card>
			</ScrollView>

			<Button mode="contained" onPress={() => navigation.navigate('UjianScreen')} style={{ margin: 10 }}>Mulai Ujian</Button>
		</>
	);
}

export default withTheme(PreTestScreen);