import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export type CharacterModel = {
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	stats: Record<STAT_TYPE_ID, number>;
	spellTypeIds: SPELL_TYPE_ID[];
};

export enum STAT_TYPE_ID {
	// governs HP
	VITALITY = 'VITALITY',
	// governs SP
	ENDURANCE = 'ENDURANCE',
	// governs MP
	WISDOM = 'WISDOM',

	// governs attack scalings
	STRENGTH = 'STRENGTH',
	DEXTERITY = 'DEXTERITY',
	INTELLIGENCE = 'INTELLIGENCE',
}
