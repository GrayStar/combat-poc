import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export type CharacterModel = {
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	maxHealth: number;
	maxMana: number;
	spellTypeIds: SPELL_TYPE_ID[];
	stats: Record<STAT_TYPE_ID, number>;
};

export enum STAT_TYPE_ID {
	SPELL_POWER = 'SPELL_POWER',
	ATTACK_POWER = 'ATTACK_POWER',
}
