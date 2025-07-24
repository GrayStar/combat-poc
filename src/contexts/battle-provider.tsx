import { PropsWithChildren, useState } from 'react';
import { BattleModel, EnemyModel } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { enemyData } from '@/lib/data';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleModel>();
	const [enemies, setEnemies] = useState<EnemyModel[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(battle);
		setEnemies(battle.enemyIds.map((enemyId) => enemyData[enemyId]));
	};

	const value = { startBattle, battle, enemies };

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
