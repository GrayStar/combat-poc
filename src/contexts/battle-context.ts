import { createContext } from 'react';
import { BattleInstance } from '@/lib/battle';

interface BattleContextConfig {
	battle: BattleInstance | undefined;
	setBattle: React.Dispatch<React.SetStateAction<BattleInstance | undefined>>;
	handleCastSpell(payload: { casterId: string; targetId: string; spellId: string }): void;
}

export const BattleContext = createContext({} as BattleContextConfig);
