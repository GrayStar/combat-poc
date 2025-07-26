import { v4 as uuidv4 } from 'uuid';
import { CharacterInstance, CharacterModel, SPELL_TYPE_ID, SpellInstance, STATUS_EFFECT_TYPE_ID } from '@/lib/models';
import { statusEffectData } from '@/lib/data';
import { getSpellInstance, getStatusEffectInstance } from '@/lib/utils';

export const getCharacterInstance = (character: CharacterModel): CharacterInstance => {
	const characterInstance: CharacterInstance = {
		title: character.title,
		characterId: uuidv4(),
		characterTypeId: character.characterTypeId,
		health: character.maxHealth,
		maxHealth: character.maxHealth,
		mana: character.maxMana,
		maxMana: character.maxMana,
		spells: getSpellRecord(character.spellIds),
		statusEffects: {},
		isCasting: false,
	};

	return characterInstance;
};

const getSpellRecord = (spellTypeIds: SPELL_TYPE_ID[]) => {
	return spellTypeIds.reduce((accumulator, currentValue) => {
		const spellInstance = getSpellInstance(currentValue);

		return {
			...accumulator,
			[spellInstance.spellId]: spellInstance,
		};
	}, {} as Record<string, SpellInstance>);
};

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
	const statusEffectConfig = statusEffectData[statusEffectTypeId];
	const statusEffectInstance = getStatusEffectInstance(statusEffectConfig);

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
