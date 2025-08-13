import { Tile } from '@/components/tile-map/tile';
import { TileConfig } from '@/lib/map-editor/types';
import { tss } from '@/styles';

interface UseStyleProps extends Record<string, unknown> {
	rows: number;
	columns: number;
	tileSize: number;
	borderRadius: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ rows, columns, tileSize, borderRadius }) => ({
	grid: {
		display: 'grid',
		gridTemplateColumns: `repeat(${columns}, ${tileSize}px)`,
		gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
		borderRadius: `${borderRadius}px`,
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
	onTileClick(tileConfig: TileConfig): void;
}

export const Grid = ({
	data,
	tileSize,
	borderRadius,
	floorColor,
	ceilingColor,
	wallColor,
	wallHeight,
	onTileClick,
}: TileGridProps) => {
	const rows = data.length;
	const columns = data[0]?.length ?? 0;
	const { classes } = useStyles({ rows, columns, tileSize, borderRadius });

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
						onClick={onTileClick}
						floorColor={floorColor}
					/>
				))
			)}
		</div>
	);
};
