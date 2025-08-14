import { TileConfig } from '@/lib/map-editor/types';
import { centralChamber } from './central-chamber';
import { southernChamber } from './southern-chamber';
import { northernChamber } from './northern-chamber';
import { westerChamber } from './wastern-chamber';
import { easternChamber } from './eastern-chamber';

export enum SCENE_ID {
	CENTRAL_CHAMBER = 'CENTRAL_CHAMBER',
	NORTHERN_CHAMBER = 'NORTHERN_CHAMBER',
	EASTERN_CHAMBER = 'EASTERN_CHAMBER',
	SOUTHERN_CHAMBER = 'SOUTHERN_CHAMBER',
	WESTERN_CHAMBER = 'WESTERN_CHAMBER',
}

export const scenes: Record<SCENE_ID, TileConfig[][]> = {
	[SCENE_ID.CENTRAL_CHAMBER]: centralChamber as TileConfig[][],
	[SCENE_ID.NORTHERN_CHAMBER]: northernChamber as TileConfig[][],
	[SCENE_ID.EASTERN_CHAMBER]: easternChamber as TileConfig[][],
	[SCENE_ID.SOUTHERN_CHAMBER]: southernChamber as TileConfig[][],
	[SCENE_ID.WESTERN_CHAMBER]: westerChamber as TileConfig[][],
};
