import { v4 as uuidv4 } from 'uuid';
import { healthAdjuster } from '@/entities/actions';
import { enemyData } from '@/lib/data';
import { ENEMY_IDS, EnemyModel } from '@/lib/models';

interface EnemyComposite extends EnemyModel {
	readonly id: string;
}

export type EnemyInstance = ReturnType<typeof EnemyEntity>;

export const EnemyEntity = (enemyId: ENEMY_IDS) => {
	const enemyConfig = enemyData[enemyId];
	const enemyComposite: EnemyComposite = {
		...enemyConfig,
		...{
			id: uuidv4(),
		},
	};

	return {
		...enemyComposite,
		...healthAdjuster(enemyComposite, enemyComposite.maxHealth),
	};
};
