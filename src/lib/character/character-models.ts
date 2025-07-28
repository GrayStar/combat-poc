import { CHARACTER_TYPE_ID } from '@/lib/character';
import { SPELL_TYPE_ID } from '@/lib/spell';

export type CharacterModel = {
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	maxHealth: number;
	maxMana: number;
	spellTypeIds: SPELL_TYPE_ID[];
};
