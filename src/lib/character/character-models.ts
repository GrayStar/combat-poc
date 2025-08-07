import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
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

export enum SECONDARY_STAT_TYPE_ID {
	HASTE = 'HASTE',
}

export const combinedStats = { ...STAT_TYPE_ID, ...SECONDARY_STAT_TYPE_ID };
export type ALL_STAT_TYPE_ID = keyof typeof combinedStats;
