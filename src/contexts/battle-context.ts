import { createContext } from 'react';
import { BattleModel, SPELL_IDS } from '@/lib/models';
import { BattleInstance } from '@/lib/instances';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle?: BattleInstance;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: SPELL_IDS }): void;
	combatLog: string[];
}

export const BattleContext = createContext({} as BattleContextConfig);
