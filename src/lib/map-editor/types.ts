export enum SCENE_ID {
	CENTRAL_CHAMBER = 'CENTRAL_CHAMBER',
	SOUTHERN_CHAMBER = 'SOUTHERN_CHAMBER',
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
	sceneId?: SCENE_ID;
};
