import { v4 as uuidv4 } from 'uuid';
import { enemyData } from '@/lib/data';
import { ENEMY_TYPE_IDS, EnemyModel } from '@/lib/models';
import { healthAdjuster, manaAdjuster, spellReciever } from '@/ecs/actions';

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

	const withHealth = healthAdjuster(enemyComposite, enemyComposite.maxHealth);
	const withMana = manaAdjuster(withHealth, withHealth.maxHealth);
	const withSpellReciever = spellReciever(withMana);

	return withSpellReciever;
};
