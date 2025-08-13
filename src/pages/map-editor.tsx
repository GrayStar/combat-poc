import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { tss } from '@/styles';
import { cloneDeep } from 'lodash';
import { TILE_TYPE_ID, TileConfig } from '@/lib/map-editor/types';
import { EditTileModal } from '@/components/map-editor/edit-tile-modal';
import { scenes } from './map';
import { Tile } from '@/components/tile-map/tile';
import { useTheme } from '@/styles/hooks/use-theme';

type Brush = {
	brushId: TILE_TYPE_ID;
	title: string;
};

const brushes: Record<TILE_TYPE_ID, Brush> = {
	[TILE_TYPE_ID.EMPTY]: {
		brushId: TILE_TYPE_ID.EMPTY,
		title: 'Empty',
	},
	[TILE_TYPE_ID.FLOOR]: {
		brushId: TILE_TYPE_ID.FLOOR,
		title: 'Floor',
	},
	[TILE_TYPE_ID.WALL]: {
		brushId: TILE_TYPE_ID.WALL,
		title: 'Wall',
	},
};

interface UseStyleProps extends Record<string, unknown> {
	size: number;
	rows: number;
	columns: number;
	showGrid: boolean;
	isAddingObject: boolean;
}

const useStyles = tss
	.withParams<UseStyleProps>()
	.create(({ showGrid, size, rows, columns, isAddingObject, ...theme }) => ({
		mapEditor: {
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, ${size}px)`,
			gridTemplateRows: `repeat(${rows}, ${size}px)`,
		},
		mapTile: {
			position: 'relative',
			'&:after': {
				inset: 0,
				zIndex: 3,
				content: '""',
				opacity: 0.32,
				position: 'absolute',
				border: `${showGrid ? 1 : 0}px solid ${isAddingObject ? theme.colors.success : theme.colors.white}`,
			},
			'&:hover:after': {
				opacity: 1,
			},
		},
		renderJson: {
			padding: 16,
			maxHeight: 256,
			borderRadius: 8,
			overflowY: 'auto',
			whiteSpace: 'pre-wrap',
			color: theme.colors.gray600,
			backgroundColor: 'rgba(0,0,0,0.32)',
		},
	}));

export const MapEditor = () => {
	const [showGrid, setShowGrid] = useState(true);
	const [formValues, setFormValues] = useState({
		size: 48,
		rows: 7,
		columns: 9,
	});
	const [selectedBrushId, setSelectedBrushId] = useState<TILE_TYPE_ID>(TILE_TYPE_ID.WALL);
	const [isAddingObject, setIsAddingObject] = useState(false);

	const [mapData, setMapData] = useState<TileConfig[][]>([]);
	const [tileToEditCoords, setTileToEditCoords] = useState<{ x: number; y: number }>();
	const tileToEdit = useMemo(() => {
		if (!tileToEditCoords) {
			return undefined;
		}

		return mapData[tileToEditCoords.y][tileToEditCoords.x];
	}, [tileToEditCoords]);

	const { theme } = useTheme();
	const { classes } = useStyles({ ...formValues, showGrid, isAddingObject });

	useEffect(() => {
		if (formValues.rows > 0 && formValues.columns > 0) {
			setMapData(() =>
				Array.from({ length: formValues.rows }, () =>
					Array.from({ length: formValues.columns }, () => ({
						tileTypeId: TILE_TYPE_ID.EMPTY,
						tileTypeDescription: 'Empty',
					}))
				)
			);
		} else {
			setMapData([]);
		}
	}, [formValues]);

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	const handleTileClick = (x: number, y: number) => {
		setMapData((d) => {
			const clone = cloneDeep(d);
			clone[y][x] = {
				tileTypeId: selectedBrushId,
				tileTypeDescription: brushes[selectedBrushId].title,
			};

			return clone;
		});
	};

	const handleAddObjectToTileAtCoord = (x: number, y: number) => {
		setMapData((d) => {
			const clone = cloneDeep(d);
			const selectedTile = clone[y][x];

			console.log('selected tile', selectedTile);

			return clone;
		});
	};

	const handleEditTileModalSubmit = (tileConfig: TileConfig) => {
		if (!tileToEditCoords) {
			return;
		}

		setMapData((d) => {
			const clone = cloneDeep(d);
			clone[tileToEditCoords.y][tileToEditCoords.x] = tileConfig;
			return clone;
		});

		setTileToEditCoords(undefined);
	};

	return (
		<>
			<EditTileModal
				show={!!tileToEditCoords}
				tileToEdit={tileToEdit}
				sceneIds={Object.keys(scenes)}
				onSubmit={handleEditTileModalSubmit}
				onHide={() => {
					setTileToEditCoords(undefined);
				}}
			/>

			<Container>
				<Row className="mb-4">
					<Col>
						<h1>Map Editor</h1>
					</Col>
				</Row>
				<Row className="mb-4">
					<Col>
						<h2 className="mb-2">Canvas</h2>
						<Form.Check
							type="checkbox"
							name="show-grid"
							id="show-grid"
							value="SHOW_GRID"
							label="Show Grid"
							checked={showGrid}
							onChange={() => {
								setShowGrid((show) => !show);
							}}
						/>
						<div className={classes.mapEditor}>
							{mapData.map((col, y) =>
								col.map((tile, x) => (
									<div
										key={`${x}-${y}`}
										className={classes.mapTile}
										onClick={() => {
											if (isAddingObject) {
												handleAddObjectToTileAtCoord(x, y);
												setIsAddingObject(false);
												return;
											}

											handleTileClick(x, y);
										}}
									>
										<Tile
											tileConfig={tile}
											x={x}
											y={y}
											grid={mapData}
											borderRadius={8}
											floorColor={theme.colors.gray800}
											wallColor={theme.colors.gray700}
											ceilingColor={theme.colors.gray600}
											wallHeight={16}
										/>
									</div>
								))
							)}
						</div>
					</Col>
					<Col>
						<h2 className="mb-2">Settings</h2>
						<Form onSubmit={handleFormSubmit}>
							<fieldset disabled={isAddingObject}>
								<Row>
									<Col>
										<Form.Group className="mb-4">
											<Form.Label>Tile Size</Form.Label>
											<Form.Control
												type="number"
												name="rows"
												value={formValues.size}
												onChange={({ currentTarget }) => {
													setFormValues((v) => ({
														...v,
														size: parseInt(currentTarget.value, 10),
													}));
												}}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Group className="mb-4">
											<Form.Label>Rows</Form.Label>
											<Form.Control
												type="number"
												name="rows"
												value={formValues.rows}
												onChange={({ currentTarget }) => {
													setFormValues((v) => ({
														...v,
														rows: parseInt(currentTarget.value, 10),
													}));
												}}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group className="mb-4">
											<Form.Label>Columns</Form.Label>
											<Form.Control
												type="number"
												name="rows"
												value={formValues.columns}
												onChange={({ currentTarget }) => {
													setFormValues((v) => ({
														...v,
														columns: parseInt(currentTarget.value, 10),
													}));
												}}
											/>
										</Form.Group>
									</Col>
								</Row>
							</fieldset>
						</Form>
						<Row>
							<Col>
								<Form.Group className="mb-4">
									<Form.Label>Tile Brushes</Form.Label>
									{Object.values(brushes).map((b) => (
										<Form.Check
											key={b.brushId}
											id={b.brushId}
											type="radio"
											name="brush"
											value={b.brushId}
											label={b.title}
											checked={selectedBrushId === b.brushId}
											onChange={() => {
												setSelectedBrushId(b.brushId);
											}}
										/>
									))}
								</Form.Group>
							</Col>
							<Col>
								<Form.Group>
									<Form.Label>Map Objects</Form.Label>
									<div>
										{isAddingObject ? (
											<Button
												type="button"
												variant="danger"
												onClick={() => {
													setIsAddingObject(false);
												}}
											>
												Cancal Map Object
											</Button>
										) : (
											<Button
												type="button"
												onClick={() => {
													setShowGrid(true);
													setIsAddingObject(true);
												}}
											>
												Add Map Object
											</Button>
										)}
									</div>
								</Form.Group>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row>
					<Col>
						<h2 className="mb-2">Result</h2>
						<div
							className={classes.renderJson}
							dangerouslySetInnerHTML={{ __html: JSON.stringify(mapData, null, 4) }}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};
