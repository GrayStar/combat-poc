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
