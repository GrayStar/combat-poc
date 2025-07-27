import { CharacterModel } from '@/lib/character';
import { SPELL_TYPE_ID } from '@/lib/spell';

export enum CHARACTER_TYPE_ID {
	PLAYER = 'PLAYER',
	SKELETON = 'SKELETON',
	SPIDER = 'SPIDER',
}

export const characterData: Record<CHARACTER_TYPE_ID, CharacterModel> = {
	[CHARACTER_TYPE_ID.PLAYER]: {
		characterTypeId: CHARACTER_TYPE_ID.PLAYER,
		title: 'Player',
		maxHealth: 100,
		maxMana: 100,
		spellIds: [SPELL_TYPE_ID.SCAR, SPELL_TYPE_ID.PUNCH, SPELL_TYPE_ID.FIREBALL, SPELL_TYPE_ID.HEAL],
	},
	[CHARACTER_TYPE_ID.SKELETON]: {
		characterTypeId: CHARACTER_TYPE_ID.SKELETON,
		title: 'Skeleton',
		maxHealth: 100,
		maxMana: 100,
		spellIds: [],
	},
	[CHARACTER_TYPE_ID.SPIDER]: {
		characterTypeId: CHARACTER_TYPE_ID.SPIDER,
		title: 'Spider',
		maxHealth: 50,
		maxMana: 100,
		spellIds: [],
	},
};
