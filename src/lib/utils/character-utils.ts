import { STATUS_EFFECT_TYPE_ID } from '@/lib/models';
import { getStatusEffectInstance } from '@/lib/utils';
import { CharacterInstance } from '@/lib/character';

export const adjustCharacterHeathByAmount = (character: CharacterInstance, amount: number) => {
	const nextHealthValue = character.health + amount;

	if (nextHealthValue <= 0) {
		character.health = 0;
		return;
	}

	if (nextHealthValue >= character.maxHealth) {
		character.health = character.maxHealth;
		return;
	}

	character.health = nextHealthValue;
};

export const adjustCharacterManaByAmount = (character: CharacterInstance, amount: number) => {
	const nextManaValue = character.mana + amount;

	if (nextManaValue <= 0) {
		character.mana = 0;
		return;
	}

	if (nextManaValue >= character.maxMana) {
		character.mana = character.maxMana;
		return;
	}

	character.mana = nextManaValue;
};

export const addStatusEffectTypeIdToCharacter = (
	character: CharacterInstance,
	statusEffectTypeId: STATUS_EFFECT_TYPE_ID
) => {
	const statusEffectInstance = getStatusEffectInstance(statusEffectTypeId);

	if (statusEffectInstance.canStack) {
		statusEffectInstance.stacks = 1;
	}

	const matchingStatusEffect = Object.values(character.statusEffects).find(
		(se) => se.statusEffectTypeId === statusEffectInstance.statusEffectTypeId
	);

	if (matchingStatusEffect) {
		const stacks = (matchingStatusEffect.stacks ?? 0) + 1;

		if (statusEffectInstance.canStack) {
			statusEffectInstance.stacks = stacks;
		}

		delete character.statusEffects[matchingStatusEffect.statusEffectId];
	}

	character.statusEffects = {
		...character.statusEffects,
		[statusEffectInstance.statusEffectId]: statusEffectInstance,
	};
};

export const removeStatusEffectTypeIdFromCharacter = (
	character: CharacterInstance,
	statusEffectTypeId: STATUS_EFFECT_TYPE_ID
) => {
	console.group('removeStatusEffectFromCharacter');
	console.log('character', character);
	console.log('statusEffectTypeId', statusEffectTypeId);
	console.groupEnd();
};
