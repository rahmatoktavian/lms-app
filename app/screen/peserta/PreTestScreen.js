import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, withTheme } from 'react-native-paper';
import { supabase } from '../../config/supabase';

function PreTestScreen({ navigation, route, theme }) {
	const { id, soalPaketId } = route.params;
	const [soal, setSoal] = useState([]);
	const [soalCurr, setSoalCurr] = useState(0)

	useEffect(() => {
		getSoal();
	}, [])


	const getSoal = async () => {
		const { data, error } = await supabase
			.from('soal')
			.select('id,label')
			.eq('soal_paket_id', soalPaketId);

		if (!error) {
			const soalList = [];
			await Promise.all(
				data.map(async (row, idx) => {

					const { data: jawaban, error: jawabanErr } = await supabase
						.from('soal_jawaban')
						.select('id, label, is_right')
						.eq('soal_id', row.id)

					if (!jawabanErr) {
						let jawabanList = [];
						jawaban.map((rowchild, childidx) => {
							jawabanList.push({ idx: childidx, label: rowchild.label, is_right: rowchild.is_right })
						})
						soalList[idx] = {
							idx: idx, label: row.label, 'jawaban': { ...jawabanList }
						};
					}

				})
			)
			setSoal(soalList);
		}
	}

	const cekSoal = () => {
		console.log('ini soal', soal);
	}

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

			{/* <Button mode="contained" onPress={() => navigation.navigate('UjianScreen', { id: id, soalPaketId: soalPaketId })} style={{ margin: 10 }}>Mulai Ujian</Button> */}
			<Button mode="contained" onPress={() => cekSoal()} style={{ margin: 10 }}>Mulai Ujian</Button>
		</>
	);
}

export default withTheme(PreTestScreen);