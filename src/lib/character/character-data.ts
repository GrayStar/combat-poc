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
			SPELL_TYPE_ID.DD_AP,
			SPELL_TYPE_ID.DH_SP,
			SPELL_TYPE_ID.DISPEL_MAGIC,
			SPELL_TYPE_ID.DOT,
			SPELL_TYPE_ID.HOT,
			SPELL_TYPE_ID.SP_UP,
			SPELL_TYPE_ID.SP_DOWN,
			SPELL_TYPE_ID.AP_UP,
			SPELL_TYPE_ID.AP_DOWN,
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
