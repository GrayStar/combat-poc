import { SPELL_TYPE_ID, SpellInstance } from '@/lib/models';

export enum CHARACTER_TYPE_IDS {
	PLAYER = 'PLAYER',
	SKELETON = 'SKELETON',
	SPIDER = 'SPIDER',
}

export type CharacterModel = {
	characterTypeId: CHARACTER_TYPE_IDS;
	title: string;
	maxHealth: number;
	maxMana: number;
	spellIds: SPELL_TYPE_ID[];
};

export type CharacterInstance = {
	characterId: string;
	characterTypeId: CHARACTER_TYPE_IDS;
	maxHealth: number;
	maxMana: number;
	spells: Record<string, SpellInstance>;
};
