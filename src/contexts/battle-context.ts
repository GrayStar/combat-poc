import { createContext } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID } from '@/lib/models';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle?: BattleInstance;
	handleCastSpell(payload: { casterId: string; targetId: string; spellTypeId: SPELL_TYPE_ID }): void;
	combatLog: string[];
}

export const BattleContext = createContext({} as BattleContextConfig);
