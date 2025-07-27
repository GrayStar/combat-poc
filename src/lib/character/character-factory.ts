import { v4 as uuidv4 } from 'uuid';
import { CHARACTER_TYPE_ID, characterData, CharacterInstance } from '@/lib/character';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, SpellInstance } from '@/lib/models';
import { getSpellInstance } from '@/lib/utils';

export const Character = (characterTypeId: CHARACTER_TYPE_ID) => {
	const characterConfig = cloneDeep(characterData[characterTypeId]);
	const characterSpellsBySpellId = getRecordOfSpellInstancesBySpellId(characterConfig.spellIds);
	const characterSpellIds = Object.keys(characterSpellsBySpellId);

	const character: CharacterInstance = {
		characterId: uuidv4(),
		characterTypeId: characterConfig.characterTypeId,
		title: characterConfig.title,
		health: characterConfig.maxHealth,
		maxHealth: characterConfig.maxHealth,
		mana: characterConfig.maxMana,
		maxMana: characterConfig.maxMana,
		spellIds: characterSpellIds,
		statusEffects: {},
		isCasting: false,
	};

	return { character, characterSpellsBySpellId };
};

const getRecordOfSpellInstancesBySpellId = (spellTypeIds: SPELL_TYPE_ID[]) => {
	return spellTypeIds.reduce((accumulator, currentValue) => {
		const spellInstance = getSpellInstance(currentValue);

		return {
			...accumulator,
			[spellInstance.spellId]: spellInstance,
		};
	}, {} as Record<string, SpellInstance>);
};
