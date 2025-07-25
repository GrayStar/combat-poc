import { createContext } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID, StatusEffectInstance } from '@/lib/models';

interface BattleContextConfig {
	startBattle(battle: BattleModel): void;
	battle?: BattleInstance;
	combatLog: string[];
	handleCastSpell(payload: { casterId: string; targetId: string; spellTypeId: SPELL_TYPE_ID }): void;
	handleStatusEffectInterval(statusEffect: StatusEffectInstance, characterId: string): void;
	handleStatusEffectTimeout(statusEffect: StatusEffectInstance, characterId: string): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
