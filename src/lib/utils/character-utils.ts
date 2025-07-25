import { v4 as uuidv4 } from 'uuid';
import { CharacterInstance, CharacterModel, SPELL_TYPE_ID, SpellInstance } from '@/lib/models';
import { spellData } from '@/lib/data';
import { getSpellInstance } from '@/lib/utils';

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
		const spellConfig = spellData[currentValue];
		const spellInstance = getSpellInstance(spellConfig);

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
