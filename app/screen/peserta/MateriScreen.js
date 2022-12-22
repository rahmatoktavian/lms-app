import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import { supabase } from '../../config/supabase';

export default function MateriScreen({ navigation, route }) {
	const { id, pesertaId, kelasLabel } = route.params;
	const [materi, setMateri] = useState([]);
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
		await Promise.all(
			menu.map(async (row, idx) => {
				treeList[idx] = { key: row.id, title: row.label }

				const { data: menuchild } = await supabase
					.rpc('kelas_materi_file_rpc', { peserta_id: pesertaId })

				if (menuchild != null) {
					let children = [];
					menuchild.map(rowchild => {

						children.push({ id: rowchild.id, tipe: rowchild.tipe, title: rowchild.label, selected: (rowchild.log_time === null) ? false : true })
					})
					treeList[idx]['children'] = children
				}

			})
		)

		setTreeData(treeList)
		console.log('treeList', treeList[0].children)
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
										left={props => <List.Icon {...props} icon={valChild.tipe === 'file' ? 'file-document' : valChild.tipe === 'video' ? 'play-circle' : valChild.tipe === 'link' && 'link'} />}
									/>
								))}
							</List.Accordion>
						))}
					</List.Section>
				)
				}

			</ScrollView>
		</>
	);
}
