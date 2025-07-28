import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { CHARACTER_TYPE_ID, characterData } from '@/lib/character';
import { healthAdjuster, manaAdjuster, spellCaster } from '@/lib/character/actions';

export type CharacterInstance = ReturnType<typeof Character>;

export const Character = (characterTypeId: CHARACTER_TYPE_ID) => {
	const { maxHealth, maxMana, spellTypeIds, title } = cloneDeep(characterData[characterTypeId]);
	const characterId = uuidv4();

	const health = healthAdjuster(maxHealth);
	const mana = manaAdjuster(maxMana);
	const spells = spellCaster();

	const character = {
		characterId,
		characterTypeId,
		title,
		spellTypeIds,
		...health,
		...mana,
		...spells,
	};

	return character;
};
