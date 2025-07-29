import { createContext } from 'react';
import { BATTLE_TYPE_ID, BattleState } from '@/lib/battle';

interface BattleContextConfig {
	battle: BattleState | undefined;
	startBattle(battleTypeId: BATTLE_TYPE_ID): void;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: string }): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
