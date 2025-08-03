import { CharacterModel, STAT_TYPE_ID } from '@/lib/character/character-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export enum CHARACTER_TYPE_ID {
	PLAYER = 'PLAYER',
	SKELETON = 'SKELETON',
}

export const characterData: Record<CHARACTER_TYPE_ID, CharacterModel> = {
	[CHARACTER_TYPE_ID.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_ID.PLAYER,
		title: 'Player',
		maxHealth: 100,
		maxMana: 100,
		spellTypeIds: [
			SPELL_TYPE_ID.PUNCH,
			SPELL_TYPE_ID.DMG_BOOST,
			SPELL_TYPE_ID.DMG_REDUCTION,
			SPELL_TYPE_ID.DMG_PERCENT_UP,
			SPELL_TYPE_ID.DMG_PERCENT_DOWN,
			SPELL_TYPE_ID.DMG_MULTIPLIED_UP,
			SPELL_TYPE_ID.DMG_MULTIPLIED_DOWN,
		],
		stats: {
			[STAT_TYPE_ID.ATTACK_POWER]: 100,
			[STAT_TYPE_ID.SPELL_POWER]: 100,
		},
	},
	[CHARACTER_TYPE_ID.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_ID.SKELETON,
		title: 'Skeleton',
		maxHealth: 100,
		maxMana: 100,
		spellTypeIds: [],
		stats: {
			[STAT_TYPE_ID.ATTACK_POWER]: 0,
			[STAT_TYPE_ID.SPELL_POWER]: 0,
		},
	},
};
