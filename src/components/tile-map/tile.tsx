import { tss } from '@/styles';
import classNames from 'classnames';

const TILE = {
	Floor: 0,
	Wall: 1,
	Entry: 2,
} as const;

interface UseStyleProps extends Record<string, unknown> {
	size: number;
	borderRadius: number;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
}

const useStyles = tss
	.withParams<UseStyleProps>()
	.create(({ size, borderRadius, wallColor, ceilingColor, wallHeight }) => ({
		tileFloor: {
			width: `${size}px`,
			height: `${size}px`,
			position: 'relative',
			'& .corner': {
				position: 'absolute',
				width: `${borderRadius}px`,
				height: `${borderRadius}px`,
				pointerEvents: 'none',
				transformOrigin: '50% 50%',
				color: wallColor,
				'&.corner-tl': {
					top: 0,
					left: 0,
				},
				'&.corner-tr': {
					top: 0,
					right: 0,
					transform: 'rotate(90deg)',
				},
				'&.corner-br': {
					bottom: 0,
					right: 0,
					transform: 'rotate(180deg)',
				},
				'&.corner-bl': {
					bottom: 0,
					left: 0,
					transform: 'rotate(270deg)',
				},
			},
			'& .corner-ceil': {
				position: 'absolute',
				width: `${borderRadius}px`,
				height: `${borderRadius}px`,
				pointerEvents: 'none',
				transformOrigin: '50% 50%',
				color: ceilingColor,
				'&.corner-ceil-tl': {
					top: `-${wallHeight}px`,
					left: 0,
				},
				'&.corner-ceil-tr': {
					top: `-${wallHeight}px`,
					right: 0,
					transform: 'rotate(90deg)',
				},
				'&.corner-ceil-br': {
					bottom: `${wallHeight}px`,
					right: 0,
					transform: 'rotate(180deg)',
				},
				'&.corner-ceil-bl': {
					bottom: `${wallHeight}px`,
					left: 0,
					transform: 'rotate(270deg)',
				},
			},
		},
		tileWall: {
			width: `${size}px`,
			height: `${size}px`,
			position: 'relative',
			backgroundColor: wallColor,
			'&:before': {
				content: '""',
				top: `-${wallHeight}px`,
				left: 0,
				position: 'absolute',
				height: '100%',
				width: '100%',
				backgroundColor: ceilingColor,
				borderRadius: 'inherit',
				pointerEvents: 'none',
			},
			'&:after': {
				zIndex: -1,
				inset: 0,
				borderRadius: 'inherit',
				position: 'absolute',
				content: '""',
				boxShadow: `${wallHeight}px 0 0 rgba(0, 0, 0, 0.32)`,
			},
		},
		tileEntry: {
			border: 0,
			appearance: 'none',
			borderRadius: `${borderRadius}px`,
			backgroundColor: 'green',
			'&:before': {
				display: 'none',
			},
		},
		tileEmpty: {
			width: `${size}px`,
			height: `${size}px`,
		},
	}));

interface TileProps {
	value: number;
	size: number;
	x: number;
	y: number;
	grid: number[][];
	borderRadius: number;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
	onClick(): void;
}

export const Tile = ({
	value,
	size,
	x,
	y,
	grid,
	borderRadius,
	wallColor,
	ceilingColor,
	wallHeight,
	onClick,
}: TileProps) => {
	const { classes } = useStyles({ borderRadius, size, wallColor, ceilingColor, wallHeight });

	if (value === TILE.Wall) {
		const br = getWallBorderRadius(grid, x, y, borderRadius);
		return <div role="gridcell" className={classes.tileWall} style={{ borderRadius: br }} />;
	}

	if (value === TILE.Entry) {
		return (
			<button
				role="gridcell"
				className={classNames(classes.tileWall, classes.tileEntry)}
				onClick={() => {
					onClick();
				}}
			/>
		);
	}

	if (value === TILE.Floor) {
		const flags = getFloorCornerFlags(grid, x, y);
		const r = borderRadius;

		return (
			<div role="gridcell" className={classes.tileFloor}>
				{flags.tl && (
					<>
						<svg className="corner corner-tl" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
						<svg className="corner-ceil corner-ceil-tl" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
					</>
				)}
				{flags.tr && (
					<>
						<svg className="corner corner-tr" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
						<svg className="corner-ceil corner-ceil-tr" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
					</>
				)}
				{flags.br && (
					<>
						<svg className="corner corner-br" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
						<svg className="corner-ceil corner-ceil-br" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
					</>
				)}
				{flags.bl && (
					<>
						<svg className="corner corner-bl" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
						<svg className="corner-ceil corner-ceil-bl" width={r} height={r} viewBox={`0 0 ${r} ${r}`}>
							<path d={`M ${r} 0 A ${r} ${r} 0 0 0 0 ${r} L 0 0 Z`} fill="currentColor" />
						</svg>
					</>
				)}
			</div>
		);
	}

	return <div role="gridcell" className={classes.tileEmpty} />;
};

function getWallBorderRadius(grid: number[][], x: number, y: number, radius: number): string {
	if (grid[y][x] !== TILE.Wall) return '0';

	const H = grid.length;
	const W = grid[0].length;
	const inBounds = (cx: number, cy: number) => cy >= 0 && cy < H && cx >= 0 && cx < W;
	const isWall = (cx: number, cy: number) => inBounds(cx, cy) && grid[cy][cx] === TILE.Wall;

	const top = isWall(x, y - 1);
	const right = isWall(x + 1, y);
	const bottom = isWall(x, y + 1);
	const left = isWall(x - 1, y);

	// Initial outer radii: only when the edge is exposed to floor
	let tl = !(top || left) ? radius : 0;
	let tr = !(top || right) ? radius : 0;
	let br = !(bottom || right) ? radius : 0;
	let bl = !(bottom || left) ? radius : 0;

	// Diagonal suppression rule:
	// In 2x2 blocks where walls are diagonal and floors are the other diagonal,
	// square off the wall corner that faces the other diagonal wall.
	const tlDiagWall = isWall(x - 1, y - 1);
	const trDiagWall = isWall(x + 1, y - 1);
	const brDiagWall = isWall(x + 1, y + 1);
	const blDiagWall = isWall(x - 1, y + 1);

	if (tl && tlDiagWall) tl = 0; // top-left corner faces a diagonal wall
	if (tr && trDiagWall) tr = 0; // top-right corner faces a diagonal wall
	if (br && brDiagWall) br = 0; // bottom-right corner faces a diagonal wall
	if (bl && blDiagWall) bl = 0; // bottom-left corner faces a diagonal wall

	return `${tl}px ${tr}px ${br}px ${bl}px`;
}

function getFloorCornerFlags(
	grid: number[][],
	x: number,
	y: number
): { tl: boolean; tr: boolean; br: boolean; bl: boolean } {
	// Only floors get concave corners
	if (grid[y][x] !== TILE.Floor) return { tl: false, tr: false, br: false, bl: false };

	const H = grid.length;
	const W = grid[0].length;
	const inBounds = (cx: number, cy: number) => cy >= 0 && cy < H && cx >= 0 && cx < W;
	const isWall = (cx: number, cy: number) => inBounds(cx, cy) && grid[cy][cx] === TILE.Wall;

	const top = isWall(x, y - 1);
	const right = isWall(x + 1, y);
	const bottom = isWall(x, y + 1);
	const left = isWall(x - 1, y);

	return {
		tl: top && left,
		tr: top && right,
		br: bottom && right,
		bl: bottom && left,
	};
}
