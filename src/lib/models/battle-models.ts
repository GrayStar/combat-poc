import { CHARACTER_TYPE_IDS, CharacterInstance } from '@/lib/models';

export enum BATTLE_TYPE_ID {
	TUTORIAL = 'TUTORIAL',
	FIRST_BATTLE = 'FIRST_BATTLE',
}

export interface BattleModel {
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	friendlyCharacterTypeIds: CHARACTER_TYPE_IDS[];
	hostileCharacterTypeIds: CHARACTER_TYPE_IDS[];
}

export interface BattleInstance {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	hostileCharacters: Record<string, CharacterInstance>;
	friendlyCharacters: Record<string, CharacterInstance>;
}
