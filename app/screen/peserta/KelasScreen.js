import { useEffect, useState } from 'react';
import { Appbar, withTheme } from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist'
import Loader from '../../comp/Loader';
import { supabase } from '../../config/supabase';

function KelasScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { id, pesertaId, soalPaketId, kelasPesertaId, kelasLabel } = route.params;
	const [data, setData] = useState();
	const [statusKelas, setStatusKelas] = useState(1);

	useEffect(() => {
		setLoading(true)
		getData();
		setLoading(false)
	}, [])

	const getData = async () => {
		const { data, error } = await supabase
			.from('kelas_peserta')
			.select('status_kelas')
			.eq('peserta_id', pesertaId)
			.eq('kelas_id', id)
			.single();

		if (!error) {
			setStatusKelas(data.status_kelas);
			setData([
				{ title: 'Pre Test', lineColor: theme.colors.primary, dotColor: theme.colors.primary, circleColor: theme.colors.primary, screen: 'PreTestScreen' },
				{ title: 'Materi Belajar', lineColor: data.status_kelas >= 2 ? theme.colors.primary : 'gray', dotColor: data.status_kelas >= 2 ? theme.colors.primary : 'gray', circleColor: data.status_kelas >= 2 ? theme.colors.primary : 'gray', screen: 'MateriScreen' },
				{ title: 'Post Test', lineColor: data.status_kelas >= 3 ? theme.colors.primary : 'gray', dotColor: data.status_kelas >= 3 ? theme.colors.primary : 'gray', circleColor: data.status_kelas >= 3 ? theme.colors.primary : 'gray', screen: 'HomeScreen' },
				{ title: 'Lulus', lineColor: data.status_kelas >= 4 ? theme.colors.primary : 'gray', dotColor: data.status_kelas >= 4 ? theme.colors.primary : 'gray', circleColor: data.status_kelas >= 4 ? theme.colors.primary : 'gray', screen: 'HomeScreen' },
			]);
		}
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={kelasLabel} />
			</Appbar.Header>

			<Loader loading={loading} />

			<Timeline
				data={data}
				showTime={false}
				onEventPress={(event, idx) => {
					(data.indexOf(event) + 1) <= statusKelas && navigation.navigate(event.screen, { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel })
				}}
				innerCircle='dot'
				lineColor={'rgb(45,156,219)'}
				separator={true}
			/>
		</>
	);
}

export default withTheme(KelasScreen);