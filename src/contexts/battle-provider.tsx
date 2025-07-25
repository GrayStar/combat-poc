import { PropsWithChildren, useEffect, useState } from 'react';
import { BattleInstance, BattleModel, SPELL_IDS } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { getBattleInstance } from '@/lib/utils';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleInstance>();
	const [combatLog, setCombatLog] = useState<string[]>([]);

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
		spellId: SPELL_IDS;
	}) => {
		try {
			setBattle((previousValue) => {
				if (!previousValue) {
					return undefined;
				}

				const allCharacters = {
					...previousValue.friendlyCharacters,
					...previousValue.hostileCharacters,
				};
				const caster = allCharacters[casterId];
				const target = allCharacters[targetId];

				const spell = caster?.castSpell(spellId);
				target.recieveSpell(spell);

				return {
					...previousValue,
				};
			});

			// setCombatLog((previousValue) => [
			// 	`__CASTER__ casts ${spellCastInstance.title} on __TARGET__.`,
			// 	...previousValue,
			// ]);
		} catch (error) {
			setCombatLog((previousValue) => [error as string, ...previousValue]);
		}
	};

	const value = {
		startBattle,
		battle,
		handleCastSpell,
		combatLog,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
