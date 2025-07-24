import { useContext } from 'react';
import { BattleContext } from '@/contexts';

export const useBattle = () => {
	return useContext(BattleContext);
};
