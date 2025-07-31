import { createContext } from 'react';
import { BattleState } from '@/lib/battle/battle-class';
import { BATTLE_TYPE_ID } from '@/lib/battle/battle-data';

interface BattleContextConfig {
	battle: BattleState | undefined;
	startBattle(battleTypeId: BATTLE_TYPE_ID): void;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: string }): void;
	handleAbortCastSpell(payload: { casterId: string }): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
