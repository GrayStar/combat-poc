import { BattleModel } from '@/lib/battle';
import { CHARACTER_TYPE_ID } from '@/lib/character';

export enum BATTLE_TYPE_ID {
	TUTORIAL = 'TUTORIAL',
	FIRST_BATTLE = 'FIRST_BATTLE',
}

export const battleData: Record<BATTLE_TYPE_ID, BattleModel> = {
	[BATTLE_TYPE_ID.TUTORIAL]: {
		battleTypeId: BATTLE_TYPE_ID.TUTORIAL,
		title: 'Tutorial',
		playerCharacterTypeId: CHARACTER_TYPE_ID.PLAYER,
		friendlyNonPlayerCharacterTypeIds: [],
		hostileNonPlayerCharacterTypeIds: [CHARACTER_TYPE_ID.SKELETON],
	},
	[BATTLE_TYPE_ID.FIRST_BATTLE]: {
		battleTypeId: BATTLE_TYPE_ID.FIRST_BATTLE,
		title: 'First Battle',
		playerCharacterTypeId: CHARACTER_TYPE_ID.PLAYER,
		friendlyNonPlayerCharacterTypeIds: [],
		hostileNonPlayerCharacterTypeIds: [CHARACTER_TYPE_ID.SPIDER, CHARACTER_TYPE_ID.SPIDER],
	},
};
