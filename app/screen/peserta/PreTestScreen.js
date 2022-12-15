import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, withTheme } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import uuid from 'react-native-uuid';

function PreTestScreen({ navigation, route, theme }) {
	const { id, soalPaketId, kelasPesertaId } = route.params;
	const [preTest, setPreTest] = useState(null)
	const [pesertaId, setPesertaId] = useState(null)

	useEffect(() => {
		getPesertaId();
		CreateSoal();
		getSoal();
	}, [])

	const getPesertaId = async () => {
		await getSession().then(async id => setPesertaId(id));
	}


	const CreateSoal = async () => {
		const { data, error } = await supabase
			.from('kelas_peserta_ujian')
			.select('id,label, kelas:kelas_id ( label)')
			.eq({ 'kelas_id': id, 'peserta_id': pesertaId, 'tipe': 'pre' })
			.single();
		setPreTest(data);
	}


	const OnMulai = async () => {
		// const getUid = uuid.v4();
		// const kelas_peserta_ujian_id = getUid;

		// const { error } = await supabase
		// 	.from('kelas_peserta_ujian')
		// 	.insert({ id: kelas_peserta_ujian_id, kelas_peserta_id: kelasPesertaId, kelas_id: id, peserta_id: pesertaId, tipe: 'tipe', waktu_mulai: new Date(), status_ujian: false });

		// if (error) {
		// 	console.log('masalah nih:', error);
		// } else {
		// 	await navigation.navigate('HomeScreen');
		// }

		// let soalList = [];

		// const { data: soal } = await supabase.rpc('get_soal', { soal_paket_id_filter: soalPaketId, 3 });

		// await Promise.all(
		// 	soal.map(async (row, idx) => {
		// 		soalList = [{ idx, row.label }];

		// 		let jawaban = [];
		// 		let jawaban_benar = [];
		// 		const { data: jawaban } = await supabase.rpc('get_soal_jawaban', { soal_id_filter: row.id, 3 });
		// 		const { data: jawaban_benar } = await supabase
		// 			.from('soal_jawaban')
		// 			.select('label')
		// 			.eq(soal_id, row.id)
		// 			.is(is_right, true)
		// 			.single();


		// 		soalList[idx] = {
		// 			idx: idx, label: row.label, 'jawaban': { ...jawaban }, 'jawaban_benar': jawaban_benar
		// 		};
		// 	})

		// soalList.map(async (row) => {
		// 		const { error } = await supabase
		// 			.from('kelas_peserta_ujian_jawaban')
		// 			.insert({ kelas_peserta_ujian_id: kelas_peserta_ujian_id, kelas_id: id, peserta_id: pesertaId, soal: row.label, jawaban: row.jawaban, jawaban_benar: row.jawaban_benar });
		// 	})

		// navigate('UjianScreen', { id: id, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasPesertaUjianId: kelas_peserta_ujian_id });
		// )
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={preTest.kelas.label} />
			</Appbar.Header>

			{preTest && (
				<ScrollView>
					<Card style={{ margin: 10 }}>
						<Card.Content>
							<Text variant="titleMedium">Kerjakan Soal</Text>
							<Text>Soal terdiri 50 Pilihan Ganda, kerjakan seluruh soal dengan teliti.</Text>
						</Card.Content>
					</Card>
				</ScrollView>
			)}

			{preTest == null && (
				<>
					{/* <Button mode="contained" onPress={() => navigation.navigate('UjianScreen', { id: id, soalPaketId: soalPaketId })} style={{ margin: 10 }}>Mulai Ujian</Button> */}
					<Button Button mode="contained" onPress={() => OnMulai()} style={{ margin: 10 }}>Mulai Ujian</Button>
				</>
			)}

		</>
	);
}

export default withTheme(PreTestScreen);