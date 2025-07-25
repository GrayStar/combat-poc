import { SPELL_TYPE_ID, SpellInstance, StatusEffectInstance } from '@/lib/models';

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
	title: string;
	characterId: string;
	characterTypeId: CHARACTER_TYPE_IDS;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
	spells: Record<string, SpellInstance>;
	statusEffects: Record<string, StatusEffectInstance>;
	isCasting: boolean;
};
