import { cloneDeep } from 'lodash';
import { PropsWithChildren, useState } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID } from '@/lib/models';
import { BattleContext } from '@/contexts';
import {
	adjustCharacterHeathByAmount,
	adjustCharacterManaByAmount,
	getBattleInstance,
	getSpellInstance,
} from '@/lib/utils';
import { spellData } from '@/lib/data';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleInstance>();
	const [combatLog, setCombatLog] = useState<string[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(getBattleInstance(battle));
	};

	const handleCastSpell = async ({
		casterId,
		targetId,
		spellTypeId,
	}: {
		casterId: string;
		targetId: string;
		spellTypeId: SPELL_TYPE_ID;
	}) => {
		const battleClone = cloneDeep(battle);
		if (!battleClone) {
			setCombatLog((previousValue) => ['[ERROR]: battleClone is undefined.', ...previousValue]);
			return;
		}

		const allCharacters = {
			...battleClone.friendlyCharacters,
			...battleClone.hostileCharacters,
		};

		const caster = allCharacters[casterId];
		const target = allCharacters[targetId];
		const casterKnowsSpell = !!Object.values(caster.spells).find((spell) => spell.spellTypeId === spellTypeId);
		const spellConfig = spellData[spellTypeId];
		const spell = getSpellInstance(spellConfig);
		// TODO: run spell through function that applies caster statusEffects to it and returns that instead of cloneDeep.
		const spellWithCasterStatusEffects = cloneDeep(spell);

		if (caster.health <= 0) {
			setCombatLog((previousValue) => [`${caster.title} is dead.`, ...previousValue]);
			return;
		}

		if (caster.isCasting) {
			setCombatLog((previousValue) => [`${caster.title} is busy.`, ...previousValue]);
			return;
		}

		if (!casterKnowsSpell) {
			setCombatLog((previousValue) => [`${caster.title} does not know ${spell.title}.`, ...previousValue]);
			return;
		}

		const spellHealthCost = spellWithCasterStatusEffects.casterEffects?.resources?.health ?? 0;
		const castersNextHealthValue = caster.health + spellHealthCost;
		if (castersNextHealthValue <= 0) {
			setCombatLog((previousValue) => [`${caster.title} does not have enough health.`, ...previousValue]);
			return;
		}

		const spellManaCost = spellWithCasterStatusEffects.casterEffects?.resources?.mana ?? 0;
		const castersNextManaValue = caster.mana + spellManaCost;
		if (castersNextManaValue <= 0) {
			setCombatLog((previousValue) => [`${caster.title} does not have enough mana.`, ...previousValue]);
			return;
		}

		const spellCastDurationInMs = spellWithCasterStatusEffects.castTimeDurationInMs ?? 0;
		if (spellCastDurationInMs > 0) {
			// Todo: animate casting?
		} else {
			castSpellWithStatusEffects();
		}

		setBattle(battleClone);

		function castSpellWithStatusEffects() {
			adjustCharacterHeathByAmount(caster, spellHealthCost);
			adjustCharacterManaByAmount(caster, spellManaCost);
			// Todo: cooldown caster spell instance.
			// Todo: apply caster status effects.
			// Todo: remove caster status effects.

			const spellHealthDamage = spellWithCasterStatusEffects.targetEffects?.resources?.health ?? 0;
			const spellManaDamage = spellWithCasterStatusEffects.targetEffects?.resources?.mana ?? 0;

			adjustCharacterHeathByAmount(target, spellHealthDamage);
			adjustCharacterManaByAmount(target, spellManaDamage);
			// Todo: apply target status effects.
			// Todo: remove target status effects.
			// Todo: interrupt target if spell can do that.
			// Todo: update enemy phase if i ever model that out.

			setCombatLog((previousValue) => [
				`${caster.title} cast ${spellWithCasterStatusEffects.title} on ${target.title}.`,
				...previousValue,
			]);
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
