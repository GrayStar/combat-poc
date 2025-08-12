export enum SCENE_ID {
	CENTRAL_ROOM = 'CENTRAL_ROOM',
	SOUTH_ROOM = 'SOUTH_ROOM',
}

export enum TILE_TYPE_ID {
	EMPTY = 'EMPTY',
	FLOOR = 'FLOOR',
	WALL = 'WALL',
	DOOR = 'DOOR',
}

export type TileConfig = {
	tileTypeId: TILE_TYPE_ID;
	tileTypeDescription: string;
};

export type DoorTileConfig = TileConfig & { sceneId: SCENE_ID };
