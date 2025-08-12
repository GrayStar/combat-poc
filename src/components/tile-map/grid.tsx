import { Tile } from '@/components/tile-map/tile';
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
	data: number[][];
	tileSize: number;
	borderRadius: number;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
	onEntryClick(): void;
}

export const Grid = ({
	data,
	tileSize,
	borderRadius,
	ceilingColor,
	wallColor,
	wallHeight,
	onEntryClick,
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
						value={value}
						size={tileSize}
						x={x}
						y={y}
						grid={data}
						borderRadius={borderRadius}
						wallColor={wallColor}
						ceilingColor={ceilingColor}
						wallHeight={wallHeight}
						onClick={onEntryClick}
					/>
				))
			)}
		</div>
	);
};
