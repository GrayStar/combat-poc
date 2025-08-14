import { MAP_OBJECT_ID, MapObjectComposite, mapObjects } from '@/lib/map-editor/types';
import { SCENE_ID } from '@/lib/scenes/types';
import { useState } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';

interface EditTileModalProps extends ModalProps {
	onSubmit(mapObject: MapObjectComposite): void;
}

export const EditTileModal = ({ sceneIds, onSubmit, ...props }: EditTileModalProps) => {
	const [selectedMapObjectId, setSelectedMapObjectId] = useState<MAP_OBJECT_ID>();
	const [supplementalFields, setSupplementalFields] = useState<{ sceneId?: SCENE_ID }>({});

	const handleOnEnter = () => {
		setSelectedMapObjectId(undefined);
		setSupplementalFields({});
	};

	const handleOnSubmitButtonClick = () => {
		if (!selectedMapObjectId) {
			return;
		}

		if (selectedMapObjectId === MAP_OBJECT_ID.DOOR) {
			if (!supplementalFields.sceneId) {
				return;
			}

			onSubmit({
				...mapObjects[selectedMapObjectId],
				sceneId: supplementalFields.sceneId,
			});
		}
	};

	return (
		<Modal {...props} centered onEntering={handleOnEnter}>
			<Modal.Header closeButton>
				<Modal.Title>Add Map Object</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group>
					<Form.Label>Map Object</Form.Label>
					<Form.Select
						value={selectedMapObjectId ?? ''}
						onChange={({ currentTarget }) => {
							setSelectedMapObjectId(currentTarget.value as MAP_OBJECT_ID);
						}}
					>
						<option value="" disabled>
							Select...
						</option>
						{Object.values(mapObjects).map((o) => (
							<option key={o.mapObjectId} value={o.mapObjectId}>
								{o.mapObjectDescription}
							</option>
						))}
					</Form.Select>
				</Form.Group>
				{selectedMapObjectId === MAP_OBJECT_ID.DOOR && (
					<Form.Group>
						<Form.Label>Scene ID to Load</Form.Label>
						<Form.Select
							value={supplementalFields.sceneId ?? ''}
							onChange={({ currentTarget }) => {
								setSupplementalFields((v) => ({ ...v, sceneId: currentTarget.value as SCENE_ID }));
							}}
						>
							<option value="" disabled>
								Select...
							</option>
							{Object.keys(SCENE_ID).map((o) => (
								<option key={o} value={o}>
									{o}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				)}
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
