import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, View, ScrollView } from 'react-native';
import { Appbar, Button, List, RadioButton, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import Loader from '../../comp/Loader';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

export default function UjianScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const [jawabanIdx, setJawabanIdx] = useState(null)
	const [firstRender, setFirstRender] = useState(true);
	const { id, pesertaId, soalPaketId, kelasPesertaId, kelasLabel, kelasUjianPesertaId } = route.params;
	const [soalList, setSoalList] = useState(null);
	const [checked, setChecked] = useState([]);
	const [soalIdx, setSoalIdx] = useState(0);
	const [jawaban, setJawaban] = useState('');
	const screenWidth = Dimensions.get('window').width;
	const ButtonWidth = Math.floor(screenWidth / 5);

	const scrollViewRef = useRef();
	const scrollButton = (newPos) => {
		setSoalList(newPos)
		scrollViewRef.current?.scrollTo({ x: ((newPos - 1) * ButtonWidth), y: 0, animated: true });
	}

	useEffect(async () => {
		getSoal();
	}, [])


	const onPrev = () => {
		setLoading(true)
		setSoalIdx(soalIdx - 1)
		setJawabanIdx(null)
		setLoading(false)
	}


	const onSoalSlc = (idx) => {
		setLoading(true)
		setSoalIdx(idx)
		setJawabanIdx(null)
		setLoading(false)
	}


	const onNext = () => {
		setLoading(true)
		setSoalIdx(soalIdx + 1)
		setJawabanIdx(null)
		setLoading(false)
	}


	const getSoal = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('kelas_peserta_ujian_jawaban')
			.select('id,soal,jawaban_list,jawaban_benar,jawaban_dipilih,jawaban_status')
			.eq('kelas_peserta_ujian_id', kelasUjianPesertaId);

		setSoalList(data);
		setLoading(false);
	}


	const onPilihJawaban = async (selected) => {
		setJawabanIdx(selected)
		let soalTemp = soalList;
		let jawaban_benar = soalList[soalIdx].jawaban_benar;

		//offline
		soalTemp[soalIdx].jawaban_dipilih = selected;
		let jawaban_status = selected === jawaban_benar ? true : false;
		soalTemp[soalIdx].jawaban_status = jawaban_status;

		//online
		const { data, error } = await supabase
			.from('kelas_peserta_ujian_jawaban')
			.update({ jawaban_dipilih: selected, jawaban_status: jawaban_status })
			.eq('id', soalTemp[soalIdx].id);

		if (!error) {
			setSoalList(soalTemp)
		}
	}


	const onSelesai = async () => {
		let total_jawaban_benar = 0;

		Dialog.show({
			type: ALERT_TYPE.SUCCESS,
			title: 'Yakin ingin menyelesaikan ujian?',
			button: 'Yakin',
			onPressButton: async () => {
				return Promise.all(soalList.map(row => {
					if (row.jawaban_status) {
						total_jawaban_benar++
					}
				})).then(async () => {
					let total_soal = soalList.length;
					let nilai = Math.ceil(total_jawaban_benar / total_soal * 100);

					let dateNow = new Date();
					const { error: errKelasPesertaUjian } = await supabase
						.from('kelas_peserta_ujian')
						.update({ waktu_selesai: dateNow, status_ujian: true, nilai: nilai, total_jawaban_benar: total_jawaban_benar })
						.eq('id', kelasUjianPesertaId);
					console.log('cek errors', { waktu_selesai: dateNow, status_ujian: true, nilai: nilai, total_jawaban_benar: total_jawaban_benar }, errKelasPesertaUjian);

					const { error: errKelasPeserta } = await supabase
						.from('kelas_peserta')
						.update({ status_kelas: 2 })
						.eq('id', kelasPesertaId);

					navigation.navigate('KelasScreen', { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel }), Dialog.hide()
				})
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

			<ScrollView>
				<View>
					<ScrollView ref={scrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 40, margin: 5 }}>
						{soalList && (
							soalList.map((row, idx) => (
								<Button mode={soalIdx == idx ? 'contained' : 'outlined'} onPress={() => onSoalSlc(idx)} style={{ marginRight: 5 }}>Soal {idx + 1}</Button>
							))
						)}
					</ScrollView>
				</View>

				{
					soalList && (<>
						<List.Item
							title={() => <Text variant="headlineSmall">{soalList[soalIdx].soal}</Text>}
							style={{ margin: 20 }}
						/>
						<View style={{ marginHorizontal: 20 }}>
							<RadioButton.Group onValueChange={val => onPilihJawaban(val)} value={jawabanIdx ? jawabanIdx : soalList[soalIdx].jawaban_dipilih}>
								{JSON.parse(soalList[soalIdx].jawaban_list).map((jawabanRow) => (
									<List.Item
										// onPress={() => (setChecked(jawabanRow), onJawabSoal(soalList[soalIdx].id, soalList[soalIdx].jawaban_benar, jawabanRow))}
										left={() => (<RadioButton
											value={jawabanRow}
										/>)}
										title={(
											<Text variant="titleMedium">{jawabanRow}</Text>
										)}
									/>
								))}
							</RadioButton.Group>
						</View>
					</>
					)
				}

			</ScrollView >


			<View style={{ flexDirection: 'row' }}>
				<Button icon="arrow-left" mode="outlined" disabled={soalIdx > 0 ? false : true} onPress={() => onPrev()} style={{ flex: 1, margin: 10 }}>Prev</Button>

				{soalList && (
					soalIdx < (soalList.length - 1) ?
						<Button icon="arrow-right" mode="contained" onPress={() => onNext()} contentStyle={{ flexDirection: 'row-reverse' }} style={{ flex: 1, margin: 10 }}>Next</Button>
						:
						<Button icon="check" mode="contained" onPress={() => onSelesai()} contentStyle={{ flexDirection: 'row-reverse' }} style={{ flex: 1, margin: 10 }}>Selesai</Button>
				)}
			</View>
		</>
	);
}