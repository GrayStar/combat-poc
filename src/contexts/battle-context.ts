import { createContext } from 'react';
import { BattleModel, EnemyModel } from '@/lib/models';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle: BattleModel | undefined;
	enemies: EnemyModel[];
}

export const BattleContext = createContext({} as BattleContextConfig);
