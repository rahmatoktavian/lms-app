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
		console.log('get soal nih', JSON.parse(data[0].jawaban_list), error, kelasUjianPesertaId);
		setLoading(false)
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
						<Button mode={soalIdx == 1 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(1)} style={{ marginRight: 5 }}>Soal 1</Button>
						<Button mode={soalIdx == 2 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(2)} style={{ marginRight: 5 }}>Soal 2</Button>
						<Button mode={soalIdx == 3 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(3)} style={{ marginRight: 5 }}>Soal 3</Button>
						<Button mode={soalIdx == 4 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(4)} style={{ marginRight: 5 }}>Soal 4</Button>
						<Button mode={soalIdx == 5 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(5)} style={{ marginRight: 5 }}>Soal 5</Button>
						<Button mode={soalIdx == 6 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(6)} style={{ marginRight: 5 }}>Soal 6</Button>
						<Button mode={soalIdx == 7 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(7)} style={{ marginRight: 5 }}>Soal 7</Button>
						<Button mode={soalIdx == 8 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(8)} style={{ marginRight: 5 }}>Soal 8</Button>
						<Button mode={soalIdx == 9 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(9)} style={{ marginRight: 5 }}>Soal 9</Button>
						<Button mode={soalIdx == 10 ? 'contained' : 'outlined'} onPress={() => setSoalIdx(10)} style={{ marginRight: 5 }}>Soal 10</Button>
					</ScrollView>
				</View>

				{soalList && (
					<List.Item
						title={() => <Text variant="headlineSmall">{soalList[soalIdx].jawaban_list[0].label}</Text>}
						style={{ margin: 20 }}
					/>
				)}

				{/* {soalList[soalIdx].jawaban_list.map((jawabanRow) => (
					<List.Item
						title={(<Text variant="headlineSmall">{jawabanRow}</Text>)}
						style={{ margin: 20 }}
					/>
				))} */}


			</ScrollView>


			<View style={{ flexDirection: 'row' }}>
				<Button icon="arrow-left" mode="outlined" onPress={() => scrollButton(soalIdx - 1)} style={{ flex: 1, margin: 10 }}>Prev</Button>
				<Button icon="arrow-right" mode="contained" onPress={() => scrollButton(soalIdx + 1)} contentStyle={{ flexDirection: 'row-reverse' }} style={{ flex: 1, margin: 10 }}>Next</Button>
			</View>
		</>
	);
}