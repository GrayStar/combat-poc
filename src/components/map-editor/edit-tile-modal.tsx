import { SCENE_ID, TileConfig } from '@/lib/map-editor/types';
import { useState } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';

interface EditTileModalProps extends ModalProps {
	tileToEdit?: TileConfig;
	sceneIds: string[];
	onSubmit(tileToEdit: TileConfig): void;
}

export const EditTileModal = ({ sceneIds, tileToEdit, onSubmit, ...props }: EditTileModalProps) => {
	const [formValues, setFormValues] = useState({
		sceneId: '',
	});

	const handleOnSubmitButtonClick = () => {
		if (!tileToEdit) {
			return;
		}

		onSubmit({
			...tileToEdit,
			sceneId: formValues.sceneId as SCENE_ID,
		});
	};

	return (
		<Modal {...props} centered>
			<Modal.Header closeButton>
				<Modal.Title>Edit Tile ({tileToEdit?.tileTypeDescription})</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group>
					<Form.Label>Scene ID</Form.Label>
					<Form.Select
						value={formValues.sceneId}
						onChange={({ currentTarget }) => {
							setFormValues((fv) => ({ ...fv, sceneId: currentTarget.value }));
						}}
					>
						<option value="" disabled>
							Select scene ID to load
						</option>
						{sceneIds.map((sceneId) => (
							<option key={sceneId} value={sceneId}>
								{sceneId}
							</option>
						))}
					</Form.Select>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" onClick={props.onHide}>
					Close
				</Button>
				<Button type="button" onClick={handleOnSubmitButtonClick}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
