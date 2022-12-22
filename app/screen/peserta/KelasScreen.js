import { useEffect, useState } from 'react';
import { Appbar, withTheme } from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist'
import Loader from '../../comp/Loader';

function KelasScreen({ navigation, route, theme }) {
	const [loading, setLoading] = useState(false);
	const { id, pesertaId, soalPaketId, kelasPesertaId, kelasLabel } = route.params;
	const [data, setData] = useState();

	useEffect(() => {
		setLoading(true)
		setData([
			{ title: 'Pre Test', lineColor: theme.colors.primary, dotColor: theme.colors.primary, circleColor: theme.colors.primary, screen: 'PreTestScreen' },
			{ title: 'Materi Belajar', lineColor: 'gray', dotColor: 'gray', circleColor: 'gray', screen: 'MateriScreen' },
			{ title: 'Post Test', lineColor: 'gray', dotColor: 'gray', circleColor: 'gray', screen: 'HomeScreen' },
		]);
		setLoading(false)
	}, [])


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
				onEventPress={(event) => navigation.navigate(event.screen, { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel })}
				innerCircle='dot'
				lineColor={'rgb(45,156,219)'}
				separator={true}
			/>
		</>
	);
}

export default withTheme(KelasScreen);