import { BATTLE_TYPE_ID, BattleModel, CHARACTER_TYPE_IDS } from '@/lib/models';

export const battleData: Record<BATTLE_TYPE_ID, BattleModel> = {
	[BATTLE_TYPE_ID.TUTORIAL]: {
		battleTypeId: BATTLE_TYPE_ID.TUTORIAL,
		title: 'Tutorial',
		friendlyCharacterTypeIds: [CHARACTER_TYPE_IDS.PLAYER],
		hostileCharacterTypeIds: [CHARACTER_TYPE_IDS.SKELETON],
	},
	[BATTLE_TYPE_ID.FIRST_BATTLE]: {
		battleTypeId: BATTLE_TYPE_ID.FIRST_BATTLE,
		title: 'First Battle',
		friendlyCharacterTypeIds: [CHARACTER_TYPE_IDS.PLAYER],
		hostileCharacterTypeIds: [CHARACTER_TYPE_IDS.SPIDER, CHARACTER_TYPE_IDS.SPIDER],
	},
};
