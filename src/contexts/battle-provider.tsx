import { cloneDeep } from 'lodash';
import { PropsWithChildren, useState } from 'react';
import {
	BattleInstance,
	BattleModel,
	CharacterInstance,
	SPELL_TYPE_ID,
	SpellInstance,
	StatusEffectInstance,
} from '@/lib/models';
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
			appleSpellToCaster(spellWithCasterStatusEffects, caster);
			applySpellToTarget(spellWithCasterStatusEffects, target);
		}
	};

	const appleSpellToCaster = (spell: SpellInstance, target: CharacterInstance) => {
		const spellTargetHealthAdjustment = spell.casterEffects?.resources?.health ?? 0;
		const spellTargetManaAdjustment = spell.casterEffects?.resources?.mana ?? 0;
		const statusEffectTypeIdsToAddToTarget = spell.casterEffects?.statusEffectsTypeIdsToAdd ?? [];
		const statusEffectTypeIdsToRemoveFromTarget = spell.casterEffects?.statusEffectsTypeIdsToRemove ?? [];

		adjustCharacterHeathByAmount(target, spellTargetHealthAdjustment);
		adjustCharacterManaByAmount(target, spellTargetManaAdjustment);

		statusEffectTypeIdsToAddToTarget.forEach((statusEffectTypeId) => {
			addStatusEffectTypeIdToCharacter(target, statusEffectTypeId);
		});

		statusEffectTypeIdsToRemoveFromTarget.forEach((statusEffectTypeId) => {
			removeStatusEffectTypeIdFromCharacter(target, statusEffectTypeId);
		});
	};

	const applySpellToTarget = (spell: SpellInstance, target: CharacterInstance) => {
		const spellTargetHealthAdjustment = spell.targetEffects?.resources?.health ?? 0;
		const spellTargetManaAdjustment = spell.targetEffects?.resources?.mana ?? 0;
		const statusEffectTypeIdsToAddToTarget = spell.targetEffects?.statusEffectsTypeIdsToAdd ?? [];
		const statusEffectTypeIdsToRemoveFromTarget = spell.targetEffects?.statusEffectsTypeIdsToRemove ?? [];

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
	};

	const handleStatusEffectInterval = (statusEffect: StatusEffectInstance, characterId: string) => {
		const battleClone = cloneDeep(battle);
		if (!battleClone) {
			return;
		}

		const allCharacters = {
			...battleClone.friendlyCharacters,
			...battleClone.hostileCharacters,
		};
		const target = allCharacters[characterId];
		const spellTypeIdsToCastOnInterval = statusEffect.intervalSpellTypeIds ?? [];

		spellTypeIdsToCastOnInterval.forEach((spellTypeId) => {
			const spellConfig = spellData[spellTypeId];
			const spell = getSpellInstance(spellConfig);
			applySpellToTarget(spell, target);
		});

		setBattle(battleClone);
	};
	const handleStatusEffectTimeout = (statusEffect: StatusEffectInstance, characterId: string) => {
		const battleClone = cloneDeep(battle);
		if (!battleClone) {
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
