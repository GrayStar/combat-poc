import { BATTLE_IDS, BattleModel, ENEMY_IDS } from '@/lib/models';

export const battleData: Record<BATTLE_IDS, BattleModel> = {
	[BATTLE_IDS.TUTORIAL]: {
		battleId: BATTLE_IDS.TUTORIAL,
		title: 'Tutorial',
		enemyIds: [ENEMY_IDS.SKELETON],
	},
	[BATTLE_IDS.FIRST_BATTLE]: {
		battleId: BATTLE_IDS.FIRST_BATTLE,
		title: 'First Battle',
		enemyIds: [ENEMY_IDS.SPIDER, ENEMY_IDS.SPIDER, ENEMY_IDS.SPIDER],
	},
};
