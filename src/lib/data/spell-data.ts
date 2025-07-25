import { STATUS_EFFECT_IDS } from '../models';
import { SPELL_TYPE_ID, SpellModel } from '../models/spell-models';

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.FIREBALL]: {
		spellTypeId: SPELL_TYPE_ID.FIREBALL,
		title: 'Fireball',
		description: 'Throw a ball of fire.',
		castTimeDurationInMs: 0,
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
	[SPELL_TYPE_ID.BURN_TICK]: {
		spellTypeId: SPELL_TYPE_ID.BURN_TICK,
		title: 'Burn Tick',
		description: 'Burns the target',
		targetEffects: {
			resources: {
				health: -1,
			},
		},
		isStatusEffectDependeny: true,
	},
	[SPELL_TYPE_ID.HEAL]: {
		spellTypeId: SPELL_TYPE_ID.HEAL,
		title: 'Heal',
		description: 'Heal the target.',
		castTimeDurationInMs: 0,
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
	[SPELL_TYPE_ID.LIFE_TAP]: {
		spellTypeId: SPELL_TYPE_ID.LIFE_TAP,
		title: 'Life Tap',
		description: 'Convert targets health into mana.',
		castTimeDurationInMs: 0,
		casterEffects: {
			resources: {
				health: -1,
				mana: 0,
			},
		},
		targetEffects: {
			resources: {
				health: 0,
				mana: 2,
			},
		},
	},
};
