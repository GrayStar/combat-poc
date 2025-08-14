import { SCENE_ID } from '../scenes/types';

export enum TILE_TYPE_ID {
	EMPTY = 'EMPTY',
	FLOOR = 'FLOOR',
	WALL = 'WALL',
}

export type TileConfig = {
	tileTypeId: TILE_TYPE_ID;
	tileTypeDescription: string;
	mapObject?: MapObjectComposite;
};

export enum MAP_OBJECT_ID {
	DOOR = 'DOOR',
}

export type MapObjectConfig = {
	mapObjectId: MAP_OBJECT_ID;
	mapObjectDescription: string;
};

export type MapObjectDoor = MapObjectConfig & {
	sceneId: SCENE_ID;
};

// add future types to union
export type MapObjectComposite = MapObjectDoor;

export const mapObjects: Record<MAP_OBJECT_ID, MapObjectConfig> = {
	[MAP_OBJECT_ID.DOOR]: {
		mapObjectId: MAP_OBJECT_ID.DOOR,
		mapObjectDescription: 'Door',
	},
};

export const mapObjectIsDoor = (mapObjectComposite: MapObjectComposite): mapObjectComposite is MapObjectDoor => {
	return mapObjectComposite.mapObjectId === MAP_OBJECT_ID.DOOR;
};
