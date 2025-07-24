import { PropsWithChildren, useState } from 'react';
import { BattleModel } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { EnemyEntity, EnemyInstance } from '@/ecs/entities';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleModel>();
	const [enemies, setEnemies] = useState<Record<string, EnemyInstance>>({});

	const startBattle = (battle: BattleModel) => {
		setBattle(battle);

		setEnemies(
			battle.enemyTypeIds.reduce((accumulator, currentValue) => {
				const enemy = EnemyEntity(currentValue);

				return {
					...accumulator,
					[enemy.id]: enemy,
				};
			}, {} as typeof enemies)
		);
	};

	const handleCastSpell = ({ targetId, amount }: { targetId: string; amount: number }) => {
		setEnemies((previousValue) => {
			previousValue[targetId].adjustHealth(amount);

			return {
				...previousValue,
			};
		});
	};

	const value = { startBattle, battle, enemies, handleCastSpell };

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
