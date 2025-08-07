import { CharacterModel, SECONDARY_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export enum CHARACTER_TYPE_ID {
	PLAYER = 'PLAYER',
	SKELETON = 'SKELETON',
}

export const characterData: Record<CHARACTER_TYPE_ID, CharacterModel> = {
	[CHARACTER_TYPE_ID.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_ID.PLAYER,
		title: 'Player',
		spellTypeIds: [
			SPELL_TYPE_ID.DD_AP,
			SPELL_TYPE_ID.DH_SP,
			SPELL_TYPE_ID.DISPEL_MAGIC,
			SPELL_TYPE_ID.DOT,
			SPELL_TYPE_ID.HOT,
			SPELL_TYPE_ID.VIT_UP,
			SPELL_TYPE_ID.HASTE_UP,
		],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 10,
			[STAT_TYPE_ID.ENDURANCE]: 10,
			[STAT_TYPE_ID.WISDOM]: 10,
			[STAT_TYPE_ID.STRENGTH]: 10,
			[STAT_TYPE_ID.DEXTERITY]: 10,
			[STAT_TYPE_ID.INTELLIGENCE]: 10,
		},
	},
	[CHARACTER_TYPE_ID.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_ID.SKELETON,
		title: 'Skeleton',
		spellTypeIds: [],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 10,
			[STAT_TYPE_ID.ENDURANCE]: 10,
			[STAT_TYPE_ID.WISDOM]: 10,
			[STAT_TYPE_ID.STRENGTH]: 10,
			[STAT_TYPE_ID.DEXTERITY]: 10,
			[STAT_TYPE_ID.INTELLIGENCE]: 10,
		},
	},
};

export const defaultSecondaryStats = {
	[SECONDARY_STAT_TYPE_ID.HASTE]: 0,
};
