import { PropsWithChildren, useEffect, useState } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { getBattleInstance } from '@/lib/utils';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleInstance>();
	const [combatLog] = useState<string[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(getBattleInstance(battle));
	};

	useEffect(() => {
		console.log('battle state:', battle);
	}, [battle]);

	const handleCastSpell = async ({
		casterId,
		targetId,
		spellId,
	}: {
		casterId: string;
		targetId: string;
		spellId: SPELL_TYPE_ID;
	}) => {
		console.log('casterId', casterId);
		console.log('targetId', targetId);
		console.log('spellId', spellId);
	};

	const value = {
		startBattle,
		battle,
		handleCastSpell,
		combatLog,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
