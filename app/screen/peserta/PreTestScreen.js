import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, withTheme } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';
import uuid from 'react-native-uuid';

function PreTestScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { id, soalPaketId, kelasPesertaId } = route.params;
	const [preTest, setPreTest] = useState(null)
	const [pesertaId, setPesertaId] = useState(null)

	useEffect(() => {
		getPesertaId();
		CreateSoal();
	}, [])

	const getPesertaId = async () => {
		setLoading(true)
		await getSession().then(async val => setPesertaId(val.id));
		setLoading(false)
	}


	const CreateSoal = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('kelas_peserta_ujian')
			.select('id,label, kelas:kelas_id ( label)')
			.eq({ 'kelas_id': id, 'peserta_id': pesertaId, 'tipe': 'pre' })
			.single();
		setPreTest(data);
		setLoading(false)
	}


	const OnMulai = async () => {
		setLoading(true)
		const kelas_peserta_ujian_id = uuid.v4();
		let dateNow = new Date().toLocaleTimeString();

		const { error } = await supabase
			.from('kelas_peserta_ujian')
			.insert({ id: kelas_peserta_ujian_id, kelas_peserta_id: kelasPesertaId, kelas_id: id, peserta_id: pesertaId, tipe: 'pre', waktu_mulai: dateNow, status_ujian: false });

		let soalList = [];

		const { data: soal } = await supabase.rpc('get_soal', { soal_paket_id_filter: soalPaketId, limit_filter: 3 });

		await Promise.all(
			soal.map(async (row, idx) => {
				soalList = [idx, row.label];

				// let jawaban = [];
				// let jawaban_benar = [];
				const { data: getJawaban, error: JawabanErr } = await supabase.rpc('get_soal_jawaban', { soal_id_filter: row.id, limit_filter: 3 });

				// if (getJawaban) {
				// 	console.log('get 1 :', getJawaban);
				// }

				const { data: getJawaban_benar, error: JawabanBenarErr } = await supabase
					.from('soal_jawaban')
					.select('label')
					.eq(soal_id, row.id)
					.is(is_right, true)
					.single();

				// if (getJawaban_benar) {
				// 	console.log('get 2 :', getJawaban_benar);
				// }

				soalList[idx] = {
					'idx': idx, 'label': row.label, 'jawaban': { ...getJawaban }, 'jawaban_benar': getJawaban_benar
				};

			}),


			soalList.map(async (row) => {
				console.log('get 2 :', { kelas_peserta_ujian_id: kelas_peserta_ujian_id, kelas_id: id, peserta_id: pesertaId, soal: row.label, jawaban: row.jawaban, jawaban_benar: row.jawaban_benar })

				const { error: err } = await supabase
					.from('kelas_peserta_ujian_jawaban')
					.insert({ kelas_peserta_ujian_id: kelas_peserta_ujian_id, kelas_id: id, peserta_id: pesertaId, soal: row.label, jawaban: row.jawaban, jawaban_benar: row.jawaban_benar });

				if (err) {
					console.log('getErrx :', err);
				}
			})

		)
		setLoading(false)
		// navigation.navigate('UjianScreen', { id: id, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasPesertaUjianId: kelas_peserta_ujian_id });
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Pre Test" />
			</Appbar.Header>

			<Loader loading={loading} />

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