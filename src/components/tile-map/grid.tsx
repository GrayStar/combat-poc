import { MapObjectDoor, TileConfig } from '@/lib/map-editor/types';
import { Tile } from '@/components/tile-map/tile';
import { tss } from '@/styles';

interface UseStyleProps extends Record<string, unknown> {
	rows: number;
	columns: number;
	tileSize: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ rows, columns, tileSize }) => ({
	grid: {
		display: 'grid',
		gridTemplateColumns: `repeat(${columns}, ${tileSize}px)`,
		gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
	},
}));

interface TileGridProps {
	data: TileConfig[][];
	tileSize: number;
	borderRadius: number;
	floorColor: string;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
	onDoorClick(mapObjectDoor: MapObjectDoor): void;
}

export const Grid = ({
	data,
	tileSize,
	borderRadius,
	floorColor,
	ceilingColor,
	wallColor,
	wallHeight,
	onDoorClick,
}: TileGridProps) => {
	const rows = data.length;
	const columns = data[0]?.length ?? 0;
	const { classes } = useStyles({ rows, columns, tileSize });

	return (
		<div role="grid" aria-rowcount={rows} aria-colcount={columns} className={classes.grid}>
			{data.map((col, y) =>
				col.map((value, x) => (
					<Tile
						key={`${x}-${y}`}
						tileConfig={value}
						x={x}
						y={y}
						grid={data}
						borderRadius={borderRadius}
						wallColor={wallColor}
						ceilingColor={ceilingColor}
						wallHeight={wallHeight}
						floorColor={floorColor}
						onDoorClick={onDoorClick}
					/>
				))
			)}
		</div>
	);
};
