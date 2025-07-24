import { PropsWithChildren, useState } from 'react';
import { BattleModel } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { EnemyEntity, EnemyInstance } from '@/entities/entities';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleModel>();
	const [enemies, setEnemies] = useState<EnemyInstance[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(battle);
		setEnemies(battle.enemyIds.map((enemyId) => EnemyEntity(enemyId)));
	};

	const value = { startBattle, battle, enemies };

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
