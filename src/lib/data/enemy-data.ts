import { ENEMY_TYPE_IDS, EnemyModel } from '@/lib/models';

export const enemyData: Record<ENEMY_TYPE_IDS, EnemyModel> = {
	[ENEMY_TYPE_IDS.SKELETON]: {
		enemyTypeId: ENEMY_TYPE_IDS.SKELETON,
		title: 'Skeleton',
		maxHealth: 10,
	},
	[ENEMY_TYPE_IDS.SPIDER]: {
		enemyTypeId: ENEMY_TYPE_IDS.SPIDER,
		title: 'Spider',
		maxHealth: 5,
	},
};
