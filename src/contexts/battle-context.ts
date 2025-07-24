import { createContext } from 'react';
import { BattleModel, SPELL_IDS } from '@/lib/models';
import { EnemyInstance } from '@/ecs/entities';
import { PlayerInstance } from '@/ecs/entities/player-entity';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle?: BattleModel;
	player?: PlayerInstance;
	enemies: Record<string, EnemyInstance>;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: SPELL_IDS }): void;
	combatLog: string[];
}

export const BattleContext = createContext({} as BattleContextConfig);
