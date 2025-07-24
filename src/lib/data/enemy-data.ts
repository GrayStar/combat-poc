import { ENEMY_IDS, EnemyModel } from '@/lib/models';

export const enemyData: Record<ENEMY_IDS, EnemyModel> = {
	[ENEMY_IDS.SKELETON]: {
		enemyId: ENEMY_IDS.SKELETON,
		title: 'Skeleton',
		health: 10,
	},
	[ENEMY_IDS.SPIDER]: {
		enemyId: ENEMY_IDS.SPIDER,
		title: 'Spider',
		health: 5,
	},
};
