import { STATUS_EFFECT_IDS } from '../models';
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
				health: -1,
			},
			statusEffectsToAdd: [STATUS_EFFECT_IDS.BURN],
		},
	},
	[SPELL_IDS.BURN_TICK]: {
		spellId: SPELL_IDS.BURN_TICK,
		title: 'Burn Tick',
		description: 'Burns the target',
		targetEffects: {
			resources: {
				health: -1,
			},
		},
		isStatusEffectDependeny: true,
	},
	[SPELL_IDS.HEAL]: {
		spellId: SPELL_IDS.HEAL,
		title: 'Heal',
		description: 'Heal the target.',
		castTimeDurationInMs: 1000,
		casterEffects: {
			resources: {
				mana: -1,
			},
		},
		targetEffects: {
			resources: {
				health: 5,
			},
		},
	},
	[SPELL_IDS.LIFE_TAP]: {
		spellId: SPELL_IDS.LIFE_TAP,
		title: 'Life Tap',
		description: 'Convert targets health into mana.',
		castTimeDurationInMs: 1000,
		casterEffects: {
			resources: {
				health: 0,
				mana: 0,
			},
		},
		targetEffects: {
			resources: {
				health: -1,
				mana: 2,
			},
		},
	},
};
