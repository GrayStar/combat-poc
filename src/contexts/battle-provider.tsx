import { PropsWithChildren, useEffect, useState } from 'react';
import { BattleContext } from '@/contexts';
import { BattleInstance, battleService } from '@/lib/battle';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleInstance>();

	useEffect(() => {
		console.log('battle updated:', battle);
	}, [battle]);

	const handleCastSpell = (payload: { casterId: string; targetId: string; spellId: string }) => {
		if (!battle) {
			throw new Error('battle is undefined.');
		}

		battleService.castSpell(battle?.battleId, payload);
	};

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

	// 	setBattle(battleClone);

	// 	function castSpellWithStatusEffects() {
	// 		applySpellToCaster(spellWithCasterStatusEffects, caster);
	// 		applySpellToTarget(spellWithCasterStatusEffects, target);
	// 	}
	// };

	// const applySpellToCaster = (spell: SpellInstance, target: CharacterInstance) => {
	// 	const spellTargetHealthAdjustment = spell.casterEffects?.resources?.health ?? 0;
	// 	const spellTargetManaAdjustment = spell.casterEffects?.resources?.mana ?? 0;
	// 	const statusEffectTypeIdsToAddToTarget = spell.casterEffects?.statusEffectTypeIdsToAdd ?? [];
	// 	const statusEffectTypeIdsToRemoveFromTarget = spell.casterEffects?.statusEffectTypeIdsToRemove ?? [];

	// 	adjustCharacterHeathByAmount(target, spellTargetHealthAdjustment);
	// 	adjustCharacterManaByAmount(target, spellTargetManaAdjustment);

	// 	statusEffectTypeIdsToAddToTarget.forEach((statusEffectTypeId) => {
	// 		addStatusEffectTypeIdToCharacter(target, statusEffectTypeId);
	// 	});

	// 	statusEffectTypeIdsToRemoveFromTarget.forEach((statusEffectTypeId) => {
	// 		removeStatusEffectTypeIdFromCharacter(target, statusEffectTypeId);
	// 	});
	// };

	// const applySpellToTarget = (spell: SpellInstance, target: CharacterInstance) => {
	// 	Object.values(target.statusEffects).forEach((statusEffect) => {
	// 		applyStatusEffectToIncomingSpell(statusEffect, spell);
	// 	});

	// 	const spellTargetHealthAdjustment = spell.targetEffects?.resources?.health ?? 0;
	// 	const spellTargetManaAdjustment = spell.targetEffects?.resources?.mana ?? 0;
	// 	const statusEffectTypeIdsToAddToTarget = spell.targetEffects?.statusEffectTypeIdsToAdd ?? [];
	// 	const statusEffectTypeIdsToRemoveFromTarget = spell.targetEffects?.statusEffectTypeIdsToRemove ?? [];

	// 	adjustCharacterHeathByAmount(target, spellTargetHealthAdjustment);
	// 	adjustCharacterManaByAmount(target, spellTargetManaAdjustment);

	// 	statusEffectTypeIdsToAddToTarget.forEach((statusEffectTypeId) => {
	// 		addStatusEffectTypeIdToCharacter(target, statusEffectTypeId);
	// 	});

	// 	statusEffectTypeIdsToRemoveFromTarget.forEach((statusEffectTypeId) => {
	// 		removeStatusEffectTypeIdFromCharacter(target, statusEffectTypeId);
	// 	});

	// 	// Todo: interrupt target if spell can do that.
	// 	// Todo: update enemy phase if i ever model that out.
	// };

	// const handleStatusEffectInterval = (statusEffect: StatusEffectInstance, characterId: string) => {
	// 	const battleClone = cloneDeep(battle);
	// 	if (!battleClone) {
	// 		return;
	// 	}

	// 	const allCharacters = {
	// 		...battleClone.friendlyCharacters,
	// 		...battleClone.hostileCharacters,
	// 	};
	// 	const target = allCharacters[characterId];
	// 	const spellTypeIdsToCastOnInterval = statusEffect.intervalSpellTypeIds ?? [];

	// 	spellTypeIdsToCastOnInterval.forEach((spellTypeId) => {
	// 		const spell = getSpellInstance(spellTypeId);
	// 		applySpellToTarget(spell, target);
	// 	});

	// 	setBattle(battleClone);
	// };
	// const handleStatusEffectTimeout = (statusEffect: StatusEffectInstance, characterId: string) => {
	// 	const battleClone = cloneDeep(battle);
	// 	if (!battleClone) {
	// 		return;
	// 	}

	// 	const allCharacters = {
	// 		...battleClone.friendlyCharacters,
	// 		...battleClone.hostileCharacters,
	// 	};

	// 	const target = allCharacters[characterId];
	// 	const spellTypeIdsToCastOnTimeout = statusEffect.timeoutSpellTypeIds ?? [];

	// 	spellTypeIdsToCastOnTimeout.forEach((spellTypeId) => {
	// 		const spell = getSpellInstance(spellTypeId);
	// 		applySpellToTarget(spell, target);
	// 	});

	// 	delete target.statusEffects[statusEffect.statusEffectId];
	// 	setBattle(battleClone);
	// };

	const value = {
		battle,
		setBattle,
		handleCastSpell,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
