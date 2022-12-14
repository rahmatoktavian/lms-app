import { useEffect, useState } from 'react';
import { Appbar, withTheme } from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist'

function KelasScreen({ navigation, route, theme }) {
	const { id } = route.params;
	const [data, setData] = useState();

	useEffect(() => {
		setData([
			{ title: 'Pre Test', lineColor: theme.colors.primary, dotColor: theme.colors.primary, circleColor: theme.colors.primary, screen: 'PreTestScreen' },
			{ title: 'Materi Belajar', lineColor: 'gray', dotColor: 'gray', circleColor: 'gray', screen: 'MateriScreen' },
			{ title: 'Post Test', lineColor: 'gray', dotColor: 'gray', circleColor: 'gray', screen: 'HomeScreen' },
		]);
	}, [])


	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Akademi Bank Sampah" />
			</Appbar.Header>

			<Timeline
				data={data}
				showTime={false}
				onEventPress={(event) => navigation.navigate(event.screen, { id: id })}
				innerCircle='dot'
				lineColor={'rgb(45,156,219)'}
				separator={true}
			/>
		</>
	);
}

export default withTheme(KelasScreen);