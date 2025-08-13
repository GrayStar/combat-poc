export enum SCENE_ID {
	CENTRAL_CHAMBER = 'CENTRAL_CHAMBER',
	SOUTHERN_CHAMBER = 'SOUTHERN_CHAMBER',
}

export enum TILE_TYPE_ID {
	EMPTY = 'EMPTY',
	FLOOR = 'FLOOR',
	WALL = 'WALL',
}

export type TileConfig = {
	tileTypeId: TILE_TYPE_ID;
	tileTypeDescription: string;
	mapObject?: MapObjectConfig;
};

export enum MAP_OBJECT_ID {
	DOOR = 'DOOR',
}
export type MapObjectConfig = {
	mapObjectId: MAP_OBJECT_ID;
	mapObjectDescription: string;
};
export const mapObjects: Record<MAP_OBJECT_ID, MapObjectConfig> = {
	[MAP_OBJECT_ID.DOOR]: {
		mapObjectId: MAP_OBJECT_ID.DOOR,
		mapObjectDescription: 'Door',
	},
};
