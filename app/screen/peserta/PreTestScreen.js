import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text, Button, withTheme, List, ProgressBar } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';
import uuid from 'react-native-uuid';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

function PreTestScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { id, pesertaId, soalPaketId, kelasPesertaId, kelasLabel } = route.params;
	const [preTest, setPreTest] = useState(null);
	const [waktuMulai, setWaktuMulai] = useState(null);
	const [waktuSelesai, setWaktuSelesai] = useState(null);
	const [statusUjian, setStatusUjian] = useState(false);

	useEffect(() => {
		CekUjian();
	}, [])


	const CekUjian = async () => {
		setLoading(true)

		const { data, error } = await supabase
			.from('kelas_peserta_ujian')
			.select('id, waktu_mulai, waktu_selesai,nilai,status_ujian,total_soal,total_jawaban_benar, kelas:kelas_id (label)')
			.eq('kelas_id', id)
			.eq('peserta_id', pesertaId)
			.eq('tipe', 'pre')
			.limit(1)
			.single();

		if (data && data.status_ujian === true) {
			let waktuMulai = new Date(data.waktu_mulai).toLocaleDateString();
			let waktuSelesai = new Date(data.waktu_selesai).toLocaleDateString();
			setWaktuMulai(waktuMulai);
			setWaktuSelesai(waktuSelesai);
			setStatusUjian(true);
		}

		setPreTest(data);
		setLoading(false)
	}


	const OnMulai = async () => {
		setLoading(true)
		const totalSoal = 3;
		const kelas_peserta_ujian_id = uuid.v4();
		let dateNow = new Date();

		const { error } = await supabase
			.from('kelas_peserta_ujian')
			.insert({ id: kelas_peserta_ujian_id, kelas_peserta_id: kelasPesertaId, kelas_id: id, peserta_id: pesertaId, tipe: 'pre', waktu_mulai: dateNow, status_ujian: false, total_soal: totalSoal });

		const { data: soal } = await supabase.rpc('get_soal', { soal_paket_id_filter: soalPaketId, limit_filter: totalSoal });

		soal.map(async (row, idx) => {
			const kelas_peserta_ujian_jawaban_id = uuid.v4();

			const { error: err } = await supabase
				.from('kelas_peserta_ujian_jawaban')
				.insert({ id: kelas_peserta_ujian_jawaban_id, soal: row.label, kelas_peserta_ujian_id: kelas_peserta_ujian_id, kelas_id: id, peserta_id: pesertaId, jawaban_list: '-', jawaban_benar: '-' });

			let jawaban_list = [];
			let jawaban_benar = [];
			const { data: getJawaban, error: JawabanErr } = await supabase.rpc('get_soal_jawaban', { soal_id_filter: row.id, limit_filter: 3 });

			if (!JawabanErr) {
				getJawaban.map((val, childIdx) => {
					jawaban_list[childIdx] = val.label;
					if (val.is_right) {
						jawaban_benar[idx] = val.label;
					}
				})

				// await Promise.all(
				await supabase
					.from('kelas_peserta_ujian_jawaban')
					.update({ jawaban_list: JSON.stringify(jawaban_list), jawaban_benar: jawaban_benar[idx], soal_id: row.id })
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
				navigation.navigate('UjianScreen', { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel, kelasUjianPesertaId: kelas_peserta_ujian_id }), Dialog.hide()
			},
		})
	}


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Pre Test" />
			</Appbar.Header>

			<Loader loading={loading} />

			{(preTest && preTest.status_ujian) && (
				<ScrollView>
					<Card style={{ margin: 10 }}>
						<Card.Content>
							<List.Item
								title={<Text variant="titleLarge">Nilai: {preTest.nilai}</Text>}
								description={<View style={{ flexDirection: 'row', paddingVertical: 10 }}>
									<View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
										<Text>Jawaban Benar: {preTest.total_jawaban_benar}</Text>
										<Text>Total Soal: {preTest.total_soal}</Text>
									</View>
									<View style={{ flexDirection: 'column', justifyContent: 'flex-end', marginLeft: 50 }}>
										<Text>Mulai: {waktuMulai}</Text>
										<Text>Selesai: {waktuSelesai}</Text>
									</View>
								</View>}
								left={props => <List.Icon {...props} icon={statusUjian ? 'check' : 'timer-sand'} />}
							/>
							<ProgressBar progress={preTest.nilai / 100} />
						</Card.Content>
					</Card>
				</ScrollView >
			)
			}
			{
				(preTest && preTest.status_ujian === false) && (
					<ScrollView>
						<Card onPress={() => navigation.navigate('UjianScreen', { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel, kelasUjianPesertaId: preTest.id })} style={{ margin: 10 }}>
							<Card.Content>
								<Text variant="titleMedium">Kerjakan Soal</Text>
								<Text>Soal terdiri 50 Pilihan Ganda, kerjakan seluruh soal dengan teliti.</Text>
							</Card.Content>
						</Card>
					</ScrollView>
				)
			}

			{
				preTest == null && (
					<>
						{/* <Button mode="contained" onPress={() => navigation.navigate('UjianScreen', { id: id, soalPaketId: soalPaketId })} style={{ margin: 10 }}>Mulai Ujian</Button> */}
						<Button Button mode="contained" onPress={() => OnMulai()} style={{ margin: 10 }}>Mulai Ujian</Button>
					</>
				)
			}

		</>
	);
}

export default withTheme(PreTestScreen);