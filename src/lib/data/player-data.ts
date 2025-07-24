import { PlayerModel, SPELL_IDS } from '@/lib/models';

export const playerData: PlayerModel = {
	title: 'Player',
	maxHealth: 10,
	maxMana: 100,
	spellIds: [SPELL_IDS.FIREBALL],
};
