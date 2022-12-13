import { useState } from 'react';
import { Text, View } from 'react-native';
import { Appbar, Button, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import HomeScreen from './HomeScreen';

export default function CariKelasScreen({ navigation }) {
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = { backgroundColor: 'white', padding: 30, marginHorizontal: 30 };


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Gabung Kelas" />
			</Appbar.Header>

			<Portal>
				<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
					<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Akademi Bank Sampah</Text>
					<Text variant="bodyLarge" style={{ marginVertical: 30 }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, voluptas officia vero sapiente dolore Fugiat natus atque perferendis ratione!</Text>
					<Button icon="arrow-right" mode="contained" onPress={() => navigation.navigate('HomeScreen')} contentStyle={{ flexDirection: 'row-reverse' }}>Gabung</Button>
				</Modal>
			</Portal>

			<View style={{ flexDirection: 'row', margin: 20 }}>
				<TextInput
					label="Kode Kelas"
					mode="outlined"
				/>
				<Button mode="contained" onPress={showModal} style={{ margin: 10 }}>Cari</Button>
			</View>
		</>
	);
}