import { BATTLE_IDS, BattleModel, ENEMY_TYPE_IDS } from '@/lib/models';

export const battleData: Record<BATTLE_IDS, BattleModel> = {
	[BATTLE_IDS.TUTORIAL]: {
		battleId: BATTLE_IDS.TUTORIAL,
		title: 'Tutorial',
		enemyTypeIds: [ENEMY_TYPE_IDS.SKELETON],
	},
	[BATTLE_IDS.FIRST_BATTLE]: {
		battleId: BATTLE_IDS.FIRST_BATTLE,
		title: 'First Battle',
		enemyTypeIds: [ENEMY_TYPE_IDS.SPIDER, ENEMY_TYPE_IDS.SPIDER, ENEMY_TYPE_IDS.SPIDER],
	},
};
