import { SPELL_IDS, SpellModel } from '../models/spell-models';

export const spellData: Record<SPELL_IDS, SpellModel> = {
	[SPELL_IDS.FIREBALL]: {
		spellId: SPELL_IDS.FIREBALL,
		title: 'Fireball',
		description: 'Throw a ball of fire.',
		castTimeDurationInMs: 1000,
		casterEffects: {
			resources: {
				mana: -1,
			},
		},
		targetEffects: {
			resources: {
				health: -5,
			},
		},
	},
};
