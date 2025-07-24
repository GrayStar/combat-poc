import { SPELL_IDS } from '@/lib/models';

export interface PlayerModel {
	title: string;
	maxHealth: number;
	maxMana: number;
	spellIds: SPELL_IDS[];
}
