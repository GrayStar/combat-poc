import { createContext } from 'react';
import { BattleModel } from '@/lib/models';
import { EnemyInstance } from '@/entities/entities';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle: BattleModel | undefined;
	enemies: EnemyInstance[];
}

export const BattleContext = createContext({} as BattleContextConfig);
