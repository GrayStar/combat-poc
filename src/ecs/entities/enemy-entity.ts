import { v4 as uuidv4 } from 'uuid';
import { healthAdjuster } from '@/ecs/actions';
import { enemyData } from '@/lib/data';
import { ENEMY_TYPE_IDS, EnemyModel } from '@/lib/models';

interface EnemyComposite extends EnemyModel {
	readonly id: string;
}

export type EnemyInstance = ReturnType<typeof EnemyEntity>;

export const EnemyEntity = (enemyTypeId: ENEMY_TYPE_IDS) => {
	const enemyConfig = enemyData[enemyTypeId];
	const enemyComposite: EnemyComposite = {
		...enemyConfig,
		id: uuidv4(),
	};

	return {
		...enemyComposite,
		...healthAdjuster(enemyComposite, enemyComposite.maxHealth),
	};
};
