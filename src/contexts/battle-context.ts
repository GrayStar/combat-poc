import { createContext } from 'react';
import { BattleInstance } from '@/lib/battle';

interface BattleContextConfig {
	battle: BattleInstance | undefined;
	setBattle: React.Dispatch<React.SetStateAction<BattleInstance | undefined>>;
}

export const BattleContext = createContext({} as BattleContextConfig);
