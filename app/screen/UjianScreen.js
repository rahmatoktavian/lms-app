import React, { useState, useRef } from 'react';
import { Dimensions, View, ScrollView } from 'react-native';
import { Appbar, Button, List, RadioButton } from 'react-native-paper';

export default function UjianScreen({ navigation, theme }) {
	const [soal, setSoal] = useState(1);
	const [jawaban, setJawaban] = useState('');
	const screenWidth = Dimensions.get('window').width;
	const ButtonWidth = Math.floor(screenWidth / 5);

	const scrollViewRef = useRef();
	const scrollButton = (newPos) => {
		setSoal(newPos)
		scrollViewRef.current?.scrollTo({ x: ((newPos - 1) * ButtonWidth), y: 0, animated: true });
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Kelas" />
			</Appbar.Header>

			<ScrollView>
				<View>
					<ScrollView ref={scrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 40, margin: 5 }}>
						<Button mode={soal == 1 ? 'contained' : 'outlined'} onPress={() => setSoal(1)} style={{ marginRight: 5 }}>Soal 1</Button>
						<Button mode={soal == 2 ? 'contained' : 'outlined'} onPress={() => setSoal(2)} style={{ marginRight: 5 }}>Soal 2</Button>
						<Button mode={soal == 3 ? 'contained' : 'outlined'} onPress={() => setSoal(3)} style={{ marginRight: 5 }}>Soal 3</Button>
						<Button mode={soal == 4 ? 'contained' : 'outlined'} onPress={() => setSoal(4)} style={{ marginRight: 5 }}>Soal 4</Button>
						<Button mode={soal == 5 ? 'contained' : 'outlined'} onPress={() => setSoal(5)} style={{ marginRight: 5 }}>Soal 5</Button>
						<Button mode={soal == 6 ? 'contained' : 'outlined'} onPress={() => setSoal(6)} style={{ marginRight: 5 }}>Soal 6</Button>
						<Button mode={soal == 7 ? 'contained' : 'outlined'} onPress={() => setSoal(7)} style={{ marginRight: 5 }}>Soal 7</Button>
						<Button mode={soal == 8 ? 'contained' : 'outlined'} onPress={() => setSoal(8)} style={{ marginRight: 5 }}>Soal 8</Button>
						<Button mode={soal == 9 ? 'contained' : 'outlined'} onPress={() => setSoal(9)} style={{ marginRight: 5 }}>Soal 9</Button>
						<Button mode={soal == 10 ? 'contained' : 'outlined'} onPress={() => setSoal(10)} style={{ marginRight: 5 }}>Soal 10</Button>
					</ScrollView>
				</View>

				<List.Section>
					<List.Item title="Siapa nama presiden sekarang?" titleStyle={{ fontSize: 20 }} />
					<List.Item title="Joko" left={() => <RadioButton value="A" status={jawaban == 'Joko' ? 'checked' : 'unchecked'} />} onPress={() => setJawaban('Joko')} />
					<List.Item title="Widodo" left={() => <RadioButton value="A" status={jawaban == 'Widodo' ? 'checked' : 'unchecked'} />} onPress={() => setJawaban('Widodo')} />
					<List.Item title="Jokowi" left={() => <RadioButton value="A" status={jawaban == 'Jokowi' ? 'checked' : 'unchecked'} />} onPress={() => setJawaban('Jokowi')} />
				</List.Section>
			</ScrollView>


			<View style={{ flexDirection: 'row' }}>
				<Button icon="arrow-left" mode="outlined" onPress={() => scrollButton(soal - 1)} style={{ flex: 1, margin: 10 }}>Prev</Button>
				<Button icon="arrow-right" mode="contained" onPress={() => scrollButton(soal + 1)} contentStyle={{ flexDirection: 'row-reverse' }} style={{ flex: 1, margin: 10 }}>Next</Button>
			</View>
		</>
	);
}