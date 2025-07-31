import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { BattleContext } from '@/contexts';
import { BATTLE_TYPE_ID } from '@/lib/battle/battle-data';
import { BattleState } from '@/lib/battle/battle-class';
import { battleService } from '@/lib/battle/battle-service';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleState>();
	const unsubscribeRef = useRef<() => void>(() => {});

	const startBattle = useCallback((battleTypeId: BATTLE_TYPE_ID) => {
		unsubscribeRef.current();
		const { battle: newBattle, subscribe } = battleService.createBattleByBattleTypeId(battleTypeId);

		setBattle(newBattle);

		unsubscribeRef.current = subscribe((updatedBattleState) => {
			console.log('notified:', updatedBattleState);
			setBattle(updatedBattleState);
		});
	}, []);

	const handleCastSpell = (payload: { casterId: string; targetId: string; spellId: string }) => {
		if (!battle) {
			throw new Error('battle is undefined.');
		}

		battleService.castSpell(battle.battleId, payload);
	};

	const handleAbortCastSpell = (payload: { casterId: string }) => {
		if (!battle) {
			throw new Error('battle is undefined.');
		}

		battleService.abortCastSpell(battle.battleId, payload);
	};

	const value = {
		battle,
		startBattle,
		handleCastSpell,
		handleAbortCastSpell,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
