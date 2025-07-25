import { cloneDeep } from 'lodash';
import { PropsWithChildren, useState } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID, StatusEffectInstance } from '@/lib/models';
import { BattleContext } from '@/contexts';
import {
	addStatusEffectTypeIdToCharacter,
	adjustCharacterHeathByAmount,
	adjustCharacterManaByAmount,
	getBattleInstance,
	getSpellInstance,
	removeStatusEffectTypeIdFromCharacter,
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
			const statusEffectTypeIdsToAddToCaster =
				spellWithCasterStatusEffects.casterEffects?.statusEffectsTypeIdsToAdd ?? [];
			const statusEffectTypeIdsToRemoveFromCaster =
				spellWithCasterStatusEffects.casterEffects?.statusEffectsTypeIdsToRemove ?? [];

			adjustCharacterHeathByAmount(caster, spellHealthCost);
			adjustCharacterManaByAmount(caster, spellManaCost);
			statusEffectTypeIdsToAddToCaster.forEach((statusEffectTypeId) => {
				addStatusEffectTypeIdToCharacter(caster, statusEffectTypeId);
			});
			statusEffectTypeIdsToRemoveFromCaster.forEach((statusEffectTypeId) => {
				removeStatusEffectTypeIdFromCharacter(caster, statusEffectTypeId);
			});
			// Todo: cooldown caster spell instance.

			const spellTargetHealthAdjustment = spellWithCasterStatusEffects.targetEffects?.resources?.health ?? 0;
			const spellTargetManaAdjustment = spellWithCasterStatusEffects.targetEffects?.resources?.mana ?? 0;
			const statusEffectTypeIdsToAddToTarget =
				spellWithCasterStatusEffects.targetEffects?.statusEffectsTypeIdsToAdd ?? [];
			const statusEffectTypeIdsToRemoveFromTarget =
				spellWithCasterStatusEffects.targetEffects?.statusEffectsTypeIdsToRemove ?? [];

			adjustCharacterHeathByAmount(target, spellTargetHealthAdjustment);
			adjustCharacterManaByAmount(target, spellTargetManaAdjustment);
			statusEffectTypeIdsToAddToTarget.forEach((statusEffectTypeId) => {
				addStatusEffectTypeIdToCharacter(target, statusEffectTypeId);
			});
			statusEffectTypeIdsToRemoveFromTarget.forEach((statusEffectTypeId) => {
				removeStatusEffectTypeIdFromCharacter(target, statusEffectTypeId);
			});
			// Todo: interrupt target if spell can do that.
			// Todo: update enemy phase if i ever model that out.

			if (spellTargetHealthAdjustment > 0) {
				setCombatLog((previousValue) => [
					`${caster.title}'s ${spellWithCasterStatusEffects.title} healed ${target.title} for ${spellTargetHealthAdjustment}.`,
					...previousValue,
				]);
			} else if (spellTargetHealthAdjustment < 0) {
				setCombatLog((previousValue) => [
					`${caster.title}'s ${spellWithCasterStatusEffects.title} hit ${target.title} for ${spellTargetHealthAdjustment}.`,
					...previousValue,
				]);
			}

			if (spellTargetManaAdjustment > 0) {
				setCombatLog((previousValue) => [
					`${caster.title}'s ${spellWithCasterStatusEffects.title} gave ${target.title} ${spellTargetManaAdjustment} mana.`,
					...previousValue,
				]);
			} else if (spellTargetManaAdjustment < 0) {
				setCombatLog((previousValue) => [
					`${caster.title}'s ${spellWithCasterStatusEffects.title} removed ${target.title} ${spellTargetManaAdjustment} mana.`,
					...previousValue,
				]);
			}
		}
	};

	const handleStatusEffectInterval = (statusEffect: StatusEffectInstance, characterId: string) => {
		const battleClone = cloneDeep(battle);
		if (!battleClone) {
			setCombatLog((previousValue) => ['[ERROR]: battleClone is undefined.', ...previousValue]);
			return;
		}

		const allCharacters = {
			...battleClone.friendlyCharacters,
			...battleClone.hostileCharacters,
		};
		const target = allCharacters[characterId];
		const spellTypeIdsToCastOnInterval = statusEffect.intervalSpellTypeIds ?? [];

		console.log('target', target);
		console.log('spellTypeIdsToCastOnInterval', spellTypeIdsToCastOnInterval);
	};
	const handleStatusEffectTimeout = (statusEffect: StatusEffectInstance, characterId: string) => {
		const battleClone = cloneDeep(battle);
		if (!battleClone) {
			setCombatLog((previousValue) => ['[ERROR]: battleClone is undefined.', ...previousValue]);
			return;
		}

		const allCharacters = {
			...battleClone.friendlyCharacters,
			...battleClone.hostileCharacters,
		};

		const target = allCharacters[characterId];
		delete target.statusEffects[statusEffect.statusEffectId];

		setBattle(battleClone);
	};

	const value = {
		startBattle,
		battle,
		handleCastSpell,
		combatLog,
		handleStatusEffectInterval,
		handleStatusEffectTimeout,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
