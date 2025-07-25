import { CHARACTER_TYPE_IDS, CharacterModel, SPELL_TYPE_ID } from '@/lib/models';

export const characterData: Record<CHARACTER_TYPE_IDS, CharacterModel> = {
	[CHARACTER_TYPE_IDS.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_IDS.PLAYER,
		title: 'Player',
		maxHealth: 10,
		maxMana: 100,
		spellIds: [SPELL_TYPE_ID.FIREBALL, SPELL_TYPE_ID.HEAL, SPELL_TYPE_ID.LIFE_TAP],
	},
	[CHARACTER_TYPE_IDS.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_IDS.SKELETON,
		title: 'Skeleton',
		maxHealth: 10,
		maxMana: 100,
		spellIds: [],
	},
	[CHARACTER_TYPE_IDS.SPIDER]: {
		characterTypeId: CHARACTER_TYPE_IDS.SPIDER,
		title: 'Spider',
		maxHealth: 5,
		maxMana: 100,
		spellIds: [],
	},
};
