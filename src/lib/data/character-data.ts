import { CHARACTER_TYPE_IDS, CharacterModel, SPELL_TYPE_ID } from '@/lib/models';

export const characterData: Record<CHARACTER_TYPE_IDS, CharacterModel> = {
	[CHARACTER_TYPE_IDS.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_IDS.PLAYER,
		title: 'Player',
		maxHealth: 100,
		maxMana: 100,
		spellIds: [SPELL_TYPE_ID.SCAR, SPELL_TYPE_ID.PUNCH, SPELL_TYPE_ID.FIREBALL, SPELL_TYPE_ID.HEAL],
	},
	[CHARACTER_TYPE_IDS.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_IDS.SKELETON,
		title: 'Skeleton',
		maxHealth: 100,
		maxMana: 100,
		spellIds: [],
	},
	[CHARACTER_TYPE_IDS.SPIDER]: {
		characterTypeId: CHARACTER_TYPE_IDS.SPIDER,
		title: 'Spider',
		maxHealth: 50,
		maxMana: 100,
		spellIds: [],
	},
};
