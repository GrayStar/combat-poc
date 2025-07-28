import { CHARACTER_TYPE_ID } from '@/lib/character';
import { SPELL_TYPE_ID } from '@/lib/spell';

export type CharacterModel = {
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	maxHealth: number;
	maxMana: number;
	spellTypeIds: SPELL_TYPE_ID[];
};

export type CharacterInstance = {
	title: string;
	characterId: string;
	characterTypeId: CHARACTER_TYPE_ID;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
	spellIds: string[];
	isCasting: boolean;
};
