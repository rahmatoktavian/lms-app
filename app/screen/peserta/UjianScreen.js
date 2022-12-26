import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, View, ScrollView } from 'react-native';
import { Appbar, Button, List, RadioButton, Text } from 'react-native-paper';
import { supabase } from '../../config/supabase';
import getSession from '../../comp/getSession';
import Loader from '../../comp/Loader';

export default function UjianScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { kelasUjianPesertaId } = route.params;
	const [pesertaId, setPesertaId] = useState(null)
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
		getPesertaId();
		getSoal();
	}, [])


	const getPesertaId = async () => {
		setLoading(true)
		await getSession().then(async val => setPesertaId(val.id));
		setLoading(false)
	}



	const getSoal = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('kelas_peserta_ujian_jawaban')
			.select('id,soal,jawaban_list,jawaban_benar,jawaban_dipilih,jawaban_status')
			.eq('kelas_peserta_ujian_id', kelasUjianPesertaId);

		setSoalList(data);
		console.log('get soal nih', data, error);
		setLoading(false);
	}

	const onJawabSoal = async (id, jawabanBenar, jawabanDipilih) => {
		let jawaban_status = jawabanBenar == jawabanDipilih ? true : false;

		const { data, error } = await supabase
			.from('kelas_peserta_ujian_jawaban')
			.update({ jawaban_dipilih: jawabanDipilih, jawaban_status: jawaban_status })
			.eq('id', id);
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Kelas" />
			</Appbar.Header>

			<Loader loading={loading} />

			<ScrollView>
				<View>
					<ScrollView ref={scrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 40, margin: 5 }}>
						{soalList && (
							soalList.map((row, idx) => (
								<Button mode={soalIdx == idx ? 'contained' : 'outlined'} onPress={() => setSoalIdx(idx)} style={{ marginRight: 5 }}>Soal {idx + 1}</Button>
							))
						)}
					</ScrollView>
				</View>

				{soalList && (<>
					<List.Item
						title={() => <Text variant="headlineSmall">{soalList[soalIdx].soal}</Text>}
						style={{ margin: 20 }}
					/>
					<View style={{ margin: 20 }}>
						{JSON.parse(soalList[soalIdx].jawaban_list).map((jawabanRow) => (
							<List.Item
								onPress={() => (setChecked(jawabanRow.id), onJawabSoal(soalList[soalIdx].id, soalList[soalIdx].jawaban_benar, jawabanRow.id))}
								left={() => (<RadioButton
									value={jawabanRow.id}
									status={checked[soalIdx] === jawabanRow.id ? 'checked' : 'unchecked'}
								/>)}
								title={(
									<Text variant="bodyLarge">{jawabanRow.label}</Text>
								)}
							/>
						))}
					</View>
				</>
				)}

			</ScrollView>


			<View style={{ flexDirection: 'row' }}>
				<Button icon="arrow-left" mode="outlined" onPress={() => setSoalIdx(soalIdx - 1)} style={{ flex: 1, margin: 10 }}>Prev</Button>
				<Button icon="arrow-right" mode="contained" onPress={() => setSoalIdx(soalIdx + 1)} contentStyle={{ flexDirection: 'row-reverse' }} style={{ flex: 1, margin: 10 }}>Next</Button>
			</View>
		</>
	);
}