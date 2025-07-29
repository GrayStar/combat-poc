import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { BattleContext } from '@/contexts';
import { BATTLE_TYPE_ID, battleService, BattleState } from '@/lib/battle';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleState>();
	const unsubscribeRef = useRef<() => void>(() => {});

	const handleCastSpell = (payload: { casterId: string; targetId: string; spellId: string }) => {
		if (!battle) {
			throw new Error('battle is undefined.');
		}

		battleService.castSpell(battle?.battleId, payload);
	};

	const startBattle = useCallback((battleTypeId: BATTLE_TYPE_ID) => {
		unsubscribeRef.current();
		const { battle: newBattle, subscribe } = battleService.createBattleByBattleTypeId(battleTypeId);

		setBattle(newBattle);

		unsubscribeRef.current = subscribe((updatedBattleState) => {
			console.log('notified:', updatedBattleState);
			setBattle(updatedBattleState);
		});
	}, []);

	// const [combatLog, setCombatLog] = useState<string[]>([]);

	// const startBattle = (battle: BattleModel) => {
	// 	setBattle(getBattleInstance(battle));
	// };

	// const handleCastSpell = async ({
	// 	casterId,
	// 	targetId,
	// 	spellTypeId,
	// }: {
	// 	casterId: string;
	// 	targetId: string;
	// 	spellTypeId: SPELL_TYPE_ID;
	// }) => {
	// 	const battleClone = cloneDeep(battle);
	// 	if (!battleClone) {
	// 		setCombatLog((previousValue) => ['[ERROR]: battleClone is undefined.', ...previousValue]);
	// 		return;
	// 	}

	// 	const allCharacters = {
	// 		...battleClone.friendlyCharacters,
	// 		...battleClone.hostileCharacters,
	// 	};

	// 	const caster = allCharacters[casterId];
	// 	const target = allCharacters[targetId];
	// 	const casterKnowsSpell = !!Object.values(caster.spells).find((spell) => spell.spellTypeId === spellTypeId);
	// 	const spell = getSpellInstance(spellTypeId);
	// 	// TODO: run spell through function that applies caster statusEffects to it and returns that instead of cloneDeep.
	// 	const spellWithCasterStatusEffects = cloneDeep(spell);

	// 	if (caster.health <= 0) {
	// 		setCombatLog((previousValue) => [`${caster.title} is dead.`, ...previousValue]);
	// 		return;
	// 	}

	// 	if (caster.isCasting) {
	// 		setCombatLog((previousValue) => [`${caster.title} is busy.`, ...previousValue]);
	// 		return;
	// 	}

	// 	if (!casterKnowsSpell) {
	// 		setCombatLog((previousValue) => [`${caster.title} does not know ${spell.title}.`, ...previousValue]);
	// 		return;
	// 	}

	// 	const spellHealthCost = spellWithCasterStatusEffects.casterEffects?.resources?.health ?? 0;
	// 	const castersNextHealthValue = caster.health + spellHealthCost;
	// 	if (castersNextHealthValue <= 0) {
	// 		setCombatLog((previousValue) => [`${caster.title} does not have enough health.`, ...previousValue]);
	// 		return;
	// 	}

	// 	const spellManaCost = spellWithCasterStatusEffects.casterEffects?.resources?.mana ?? 0;
	// 	const castersNextManaValue = caster.mana + spellManaCost;
	// 	if (castersNextManaValue <= 0) {
	// 		setCombatLog((previousValue) => [`${caster.title} does not have enough mana.`, ...previousValue]);
	// 		return;
	// 	}

	// 	const spellCastDurationInMs = spellWithCasterStatusEffects.castTimeDurationInMs ?? 0;
	// 	if (spellCastDurationInMs > 0) {
	// 		// Todo: animate casting?
	// 	} else {
	// 		castSpellWithStatusEffects();
	// 	}

	const value = {
		battle,
		startBattle,
		handleCastSpell,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
