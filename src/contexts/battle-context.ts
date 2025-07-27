import { createContext } from 'react';
import { BATTLE_TYPE_ID, BattleInstance } from '@/lib/battle';

interface BattleContextConfig {
	battle: BattleInstance | undefined;
	startBattle(battleTypeId: BATTLE_TYPE_ID): void;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: string }): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
