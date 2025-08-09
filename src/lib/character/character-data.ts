import { CharacterModel, SECONDARY_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';

export const characterData: Record<CHARACTER_TYPE_ID, CharacterModel> = {
	[CHARACTER_TYPE_ID.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_ID.PLAYER,
		title: 'Player',
		spellTypeIds: [
			SPELL_TYPE_ID.PUNCH,
			SPELL_TYPE_ID.DH_SP,
			SPELL_TYPE_ID.DISPEL_MAGIC,
			SPELL_TYPE_ID.DOT,
			SPELL_TYPE_ID.HOT,
			SPELL_TYPE_ID.VIT_UP,
			SPELL_TYPE_ID.HASTE_UP,
			SPELL_TYPE_ID.INTERRUPT,
			SPELL_TYPE_ID.SUMMON_SKELETON,
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
		spellTypeIds: [SPELL_TYPE_ID.PUNCH, SPELL_TYPE_ID.DOT],
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
