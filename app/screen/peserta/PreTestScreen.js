import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, withTheme } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';
import uuid from 'react-native-uuid';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

function PreTestScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { id, soalPaketId, kelasPesertaId } = route.params;
	const [preTest, setPreTest] = useState(null)
	const [pesertaId, setPesertaId] = useState(null)

	useEffect(() => {
		CekUjian();
	}, [])


	const CekUjian = async () => {
		setLoading(true)

		await getSession().then(async val => {
			setPesertaId(val.id);
			const { data, error } = await supabase
				.from('kelas_peserta_ujian')
				.select('id, kelas:kelas_id (label)')
				.eq('kelas_id', id)
				.eq('peserta_id', val.id)
				.eq('tipe', 'pre')
				.limit(1)
				.single();
			setPreTest(data);
		});

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


		soal.map(async (row, idx) => {
			const kelas_peserta_ujian_jawaban_id = uuid.v4();

			const { error: err } = await supabase
				.from('kelas_peserta_ujian_jawaban')
				.insert({ id: kelas_peserta_ujian_jawaban_id, soal: row.label, kelas_peserta_ujian_id: kelas_peserta_ujian_id, kelas_id: id, peserta_id: pesertaId, jawaban_list: '-', jawaban_benar: '-' });

			if (err) {
				console.log('getErrx :', err);
			}

			let jawaban_list = [];
			let jawaban_benar = [];
			const { data: getJawaban, error: JawabanErr } = await supabase.rpc('get_soal_jawaban', { soal_id_filter: row.id, limit_filter: 3 });

			if (JawabanErr) {
				console.log('error jawaban :', JawabanErr);
			} else {
				getJawaban.map((val, childIdx) => {
					jawaban_list[childIdx] = val;
					if (val.is_right) {
						jawaban_benar[idx] = val.id;
					}
				})

				// await Promise.all(
				await supabase
					.from('kelas_peserta_ujian_jawaban')
					.update({ jawaban_list: JSON.stringify(jawaban_list), jawaban_benar: jawaban_benar[idx] })
					.eq('id', kelas_peserta_ujian_jawaban_id)
				// );
			}
		})

		setLoading(false)

		Dialog.show({
			type: ALERT_TYPE.SUCCESS,
			title: 'Soal Telah disiapkan, segera kerjakan Pre Test sekarang',
			button: 'Ok',
			onPressButton: () => {
				navigation.navigate('UjianScreen', { kelasUjianPesertaId: kelas_peserta_ujian_id }), Dialog.hide()
			},
		})
		// navigation.navigate('UjianScreen', { kelasUjianPesertaId: kelas_peserta_ujian_id });
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
					<Card onPress={() => navigation.navigate('UjianScreen', { kelasUjianPesertaId: preTest.id })} style={{ margin: 10 }}>
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