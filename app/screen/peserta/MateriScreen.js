import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Button, Checkbox, List } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function MateriScreen({ navigation, route }) {
	const { id, pesertaId, soalPaketId, kelasPesertaId, kelasLabel } = route.params;
	const [materi, setMateri] = useState([]);
	const [materiUnchecked, setMateriUnchecked] = useState(0);
	const [treeData, setTreeData] = useState([]);

	useEffect(() => {
		getDataTree();
	}, [])

	const getDataTree = async () => {
		const { data: menu } = await supabase
			.from('kelas_materi')
			.select('id,label,deskripsi')
			.eq('kelas_id', id)
			.order('urutan', { ascending: true });

		let treeList = [];
		let totalUnchecked = 0;
		let selectedVal = false;
		await Promise.all(
			menu.map(async (row, idx) => {
				treeList[idx] = { key: row.id, title: row.label }

				const { data: menuchild } = await supabase
					.rpc('kelas_materi_file_rpc', { peserta_id_filter: pesertaId, kelas_materi_id_filter: row.id })
				let children = [];
				if (menuchild != null) {
					menuchild.map(rowchild => {
						selectedVal = (rowchild.log_time === null) ? false : true;
						if (!selectedVal) {
							totalUnchecked++
						}
						children.push({ id: rowchild.id, tipe: rowchild.tipe, url: rowchild.url, title: rowchild.label, selected: selectedVal })
					})
				}
				treeList[idx]['children'] = children

			})
		)
		setMateriUnchecked(totalUnchecked)
		setTreeData(treeList)
	}

	const onSelesai = async () => {
		const { error } = await supabase
			.from('kelas_peserta')
			.update({ status_kelas: 3 })
			.eq('id', kelasPesertaId);

		navigation.navigate('KelasScreen', { id: id, pesertaId: pesertaId, soalPaketId: soalPaketId, kelasPesertaId: kelasPesertaId, kelasLabel: kelasLabel });
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={kelasLabel} />
			</Appbar.Header>

			<ScrollView>

				{materi && (
					<List.Section title="Materi">
						{treeData.map((val, idx) => (
							<List.Accordion
								title={val.title}
								key={idx}
								left={props => <List.Icon {...props} icon="folder" />}>
								{val.children.map((valChild, idx) => (
									<List.Item title={valChild.title}
										key={idx}
										left={props => <List.Icon {...props} icon={valChild.tipe === 'file' ? 'file-document' : valChild.tipe === 'video' ? 'play-circle' : valChild.tipe === 'link' && 'link'} />}
										right={props => <Checkbox status={valChild.selected ? 'checked' : 'unchecked'} />}
										onPress={() => navigation.navigate('DetailMateriWebViewScreen', { kelasId: id, materiFileId: valChild.id, label: valChild.label, url: valChild.url, tipe: valChild.tipe, pesertaId: pesertaId, kelasPesertaId: kelasPesertaId })}
									/>
								))}
							</List.Accordion>
						))}
					</List.Section>
				)
				}

			</ScrollView>
			{materiUnchecked === 0 && (
				<Button mode="contained" icon="check" onPress={() => onSelesai()} style={{ margin: 10 }} contentStyle={{ flexDirection: 'row-reverse' }} >Materi Selesai</Button>
			)}
		</>
	);
}
