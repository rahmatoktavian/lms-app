import { Portal, Modal, ActivityIndicator } from 'react-native-paper';

export default function Loader(props) {
	return (
		<Portal>
			<Modal visible={props.loading}>
				<ActivityIndicator animating={true} size="large" />
			</Modal>
		</Portal>
	);
}
