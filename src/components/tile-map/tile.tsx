import { TILE_TYPE_ID, TileConfig } from '@/lib/map-editor/types';
import { tss } from '@/styles';
import classNames from 'classnames';

interface UseStyleProps extends Record<string, unknown> {
	borderRadius: number;
	floorColor: string;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
}

const useStyles = tss
	.withParams<UseStyleProps>()
	.create(({ borderRadius, floorColor, wallColor, ceilingColor, wallHeight }) => ({
		tileConcaveCorners: {
			width: '100%',
			height: '100%',
			position: 'relative',
			'& .corner': {
				zIndex: 2,
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
				zIndex: 2,
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
			width: '100%',
			height: '100%',
			position: 'relative',
			backgroundColor: floorColor,
		},
		tileWallRiser: {
			width: '100%',
			height: '100%',
			zIndex: 2,
			position: 'relative',
			backgroundColor: wallColor,
			'&:after': {
				left: 0,
				content: '""',
				width: '100%',
				height: '100%',
				position: 'absolute',
				pointerEvents: 'none',
				top: `-${wallHeight}px`,
				borderRadius: 'inherit',
				backgroundColor: ceilingColor,
			},
		},
		tileWallShadow: {
			top: 0,
			left: 0,
			zIndex: 1,
			width: '100%',
			height: '100%',
			position: 'absolute',
			backgroundColor: 'black',
			boxShadow: `${wallHeight}px 0 0 rgba(0,0,0,0.32)`,
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
		tileFloor: {
			backgroundColor: floorColor,
		},
		tileEmpty: {},
	}));

interface TileProps {
	tileConfig: TileConfig;
	x: number;
	y: number;
	grid: TileConfig[][];
	borderRadius: number;
	floorColor: string;
	wallColor: string;
	ceilingColor: string;
	wallHeight: number;
}

export const Tile = ({
	tileConfig,
	x,
	y,
	grid,
	borderRadius,
	floorColor,
	wallColor,
	ceilingColor,
	wallHeight,
}: TileProps) => {
	const { classes } = useStyles({ borderRadius, floorColor, wallColor, ceilingColor, wallHeight });

	if (!tileConfig) {
		return <div role="gridcell" className={classes.tileEmpty} />;
	}

	if (tileConfig.tileTypeId === TILE_TYPE_ID.WALL) {
		const outerBr = getOuterWallBorderRadius(grid, x, y, borderRadius);
		const br = getWallBorderRadius(grid, x, y, borderRadius);
		return (
			<div role="gridcell" className={classes.tileWall} style={{ borderRadius: outerBr }}>
				<div className={classes.tileWallRiser} style={{ borderRadius: br }} />
				<div className={classes.tileWallShadow} style={{ borderRadius: br }} />
			</div>
		);
	}

	if (tileConfig.tileTypeId === TILE_TYPE_ID.FLOOR || tileConfig.tileTypeId === TILE_TYPE_ID.EMPTY) {
		const flags = getFloorCornerFlags(grid, x, y);
		const r = borderRadius;

		return (
			<div
				role="gridcell"
				className={classNames(classes.tileConcaveCorners, {
					[classes.tileFloor]: tileConfig.tileTypeId === TILE_TYPE_ID.FLOOR,
					[classes.tileEmpty]: tileConfig.tileTypeId === TILE_TYPE_ID.EMPTY,
				})}
			>
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

function inBounds(grid: TileConfig[][], cx: number, cy: number) {
	const totalRows = grid.length;
	const totalCols = totalRows > 0 ? grid[0].length : 0;
	if (cy >= 0 && cy < totalRows && cx >= 0 && cx < totalCols) {
		return true;
	}
	return false;
}

function getTileSafe(grid: TileConfig[][], cx: number, cy: number): TileConfig | undefined {
	if (inBounds(grid, cx, cy)) {
		return grid[cy][cx];
	}
	return undefined;
}

function isWall(grid: TileConfig[][], cx: number, cy: number): boolean {
	const tile = getTileSafe(grid, cx, cy);
	if (tile && tile.tileTypeId === TILE_TYPE_ID.WALL) {
		return true;
	}
	return false;
}

function isEmpty(grid: TileConfig[][], cx: number, cy: number): boolean {
	const tile = getTileSafe(grid, cx, cy);
	if (!tile || tile.tileTypeId === TILE_TYPE_ID.EMPTY) {
		return true;
	}
	return false;
}

function getWallBorderRadius(grid: TileConfig[][], x: number, y: number, radius: number): string {
	const hasWallTop = isWall(grid, x, y - 1);
	const hasWallRight = isWall(grid, x + 1, y);
	const hasWallBottom = isWall(grid, x, y + 1);
	const hasWallLeft = isWall(grid, x - 1, y);

	let topLeftRadius = 0;
	let topRightRadius = 0;
	let bottomRightRadius = 0;
	let bottomLeftRadius = 0;

	if (!hasWallTop && !hasWallLeft) {
		topLeftRadius = radius;
	}
	if (!hasWallTop && !hasWallRight) {
		topRightRadius = radius;
	}
	if (!hasWallBottom && !hasWallRight) {
		bottomRightRadius = radius;
	}
	if (!hasWallBottom && !hasWallLeft) {
		bottomLeftRadius = radius;
	}

	const hasDiagonalWallTopLeft = isWall(grid, x - 1, y - 1);
	const hasDiagonalWallTopRight = isWall(grid, x + 1, y - 1);
	const hasDiagonalWallBottomRight = isWall(grid, x + 1, y + 1);
	const hasDiagonalWallBottomLeft = isWall(grid, x - 1, y + 1);

	if (topLeftRadius !== 0 && hasDiagonalWallTopLeft) {
		topLeftRadius = 0;
	}
	if (topRightRadius !== 0 && hasDiagonalWallTopRight) {
		topRightRadius = 0;
	}
	if (bottomRightRadius !== 0 && hasDiagonalWallBottomRight) {
		bottomRightRadius = 0;
	}
	if (bottomLeftRadius !== 0 && hasDiagonalWallBottomLeft) {
		bottomLeftRadius = 0;
	}

	return `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;
}

function getOuterWallBorderRadius(grid: TileConfig[][], x: number, y: number, radius: number): string {
	const isTopEmpty = isEmpty(grid, x, y - 1);
	const isRightEmpty = isEmpty(grid, x + 1, y);
	const isBottomEmpty = isEmpty(grid, x, y + 1);
	const isLeftEmpty = isEmpty(grid, x - 1, y);

	let topLeftRadius = 0;
	let topRightRadius = 0;
	let bottomRightRadius = 0;
	let bottomLeftRadius = 0;

	if (isTopEmpty && isLeftEmpty) {
		topLeftRadius = radius;
	}
	if (isTopEmpty && isRightEmpty) {
		topRightRadius = radius;
	}
	if (isBottomEmpty && isRightEmpty) {
		bottomRightRadius = radius;
	}
	if (isBottomEmpty && isLeftEmpty) {
		bottomLeftRadius = radius;
	}

	return `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;
}

function getFloorCornerFlags(
	grid: TileConfig[][],
	x: number,
	y: number
): { tl: boolean; tr: boolean; br: boolean; bl: boolean } {
	const H = grid.length;
	const W = grid[0].length;
	const inBounds = (cx: number, cy: number) => cy >= 0 && cy < H && cx >= 0 && cx < W;
	const isWall = (cx: number, cy: number) => inBounds(cx, cy) && grid[cy][cx].tileTypeId === TILE_TYPE_ID.WALL;

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
