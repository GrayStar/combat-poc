import { createContext } from 'react';
import { BattleModel } from '@/lib/models';
import { EnemyInstance } from '@/ecs/entities';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle: BattleModel | undefined;
	enemies: Record<string, EnemyInstance>;
	handleCastSpell(payload: { targetId: string; amount: number }): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
