import { SPELL_IDS } from '@/lib/models';

export enum CHARACTER_TYPE_IDS {
	PLAYER = 'PLAYER',
	SKELETON = 'SKELETON',
	SPIDER = 'SPIDER',
}

export type CharacterModel = {
	characterTypeId: string;
	title: string;
	maxHealth: number;
	maxMana: number;
	spellIds: SPELL_IDS[];
};

export type CharacterComposite = CharacterModel & { id: string };
