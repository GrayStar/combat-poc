import { CharacterModel, SECONDARY_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export const characterData: Record<CHARACTER_TYPE_ID, CharacterModel> = {
	[CHARACTER_TYPE_ID.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_ID.PLAYER,
		title: 'Player',
		spellTypeIds: [
			SPELL_TYPE_ID.ROT_PUT,
			SPELL_TYPE_ID.SUMMON_MARROWHOUND,
			SPELL_TYPE_ID.SUMMON_OSSENTINEL,
			SPELL_TYPE_ID.HEALTH_POTION,
			SPELL_TYPE_ID.MANA_POTION,
		],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 10,
			[STAT_TYPE_ID.WISDOM]: 10,
			[STAT_TYPE_ID.STRENGTH]: 10,
			[STAT_TYPE_ID.DEXTERITY]: 10,
			[STAT_TYPE_ID.INTELLIGENCE]: 10,
		},
	},
	[CHARACTER_TYPE_ID.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_ID.SKELETON,
		title: 'Skeleton',
		spellTypeIds: [SPELL_TYPE_ID.PUNCH, SPELL_TYPE_ID.FIREBALL],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 12,
			[STAT_TYPE_ID.WISDOM]: 12,
			[STAT_TYPE_ID.STRENGTH]: 12,
			[STAT_TYPE_ID.DEXTERITY]: 12,
			[STAT_TYPE_ID.INTELLIGENCE]: 12,
		},
	},
	[CHARACTER_TYPE_ID.MARROWHOUND]: {
		characterTypeId: CHARACTER_TYPE_ID.MARROWHOUND,
		title: 'Marrowhound',
		spellTypeIds: [SPELL_TYPE_ID.BITE, SPELL_TYPE_ID.REND],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 2,
			[STAT_TYPE_ID.WISDOM]: 10,
			[STAT_TYPE_ID.STRENGTH]: 1,
			[STAT_TYPE_ID.DEXTERITY]: 2,
			[STAT_TYPE_ID.INTELLIGENCE]: 0,
		},
	},
	[CHARACTER_TYPE_ID.OSSENTINEL]: {
		characterTypeId: CHARACTER_TYPE_ID.OSSENTINEL,
		title: 'Ossentinel',
		spellTypeIds: [SPELL_TYPE_ID.PUNCH, SPELL_TYPE_ID.TAUNT],
		stats: {
			[STAT_TYPE_ID.VITALITY]: 15,
			[STAT_TYPE_ID.WISDOM]: 10,
			[STAT_TYPE_ID.STRENGTH]: 5,
			[STAT_TYPE_ID.DEXTERITY]: 2,
			[STAT_TYPE_ID.INTELLIGENCE]: 0,
		},
	},
};

export const defaultSecondaryStats = {
	[SECONDARY_STAT_TYPE_ID.HASTE]: 0,
};
