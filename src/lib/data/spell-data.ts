import { SPELL_TYPE_ID, SpellModel, STATUS_EFFECT_TYPE_ID } from '@/lib/models';

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.FIREBALL]: {
		spellTypeId: SPELL_TYPE_ID.FIREBALL,
		title: 'Fireball',
		description: 'Throw a ball of fire, dealing damage. Applies Burn',
		castTimeDurationInMs: 0,
		casterEffects: {
			resources: {
				mana: -5,
			},
		},
		targetEffects: {
			resources: {
				health: -10,
			},
			statusEffectsTypeIdsToAdd: [STATUS_EFFECT_TYPE_ID.BURN],
		},
	},
	[SPELL_TYPE_ID.BURN_TICK]: {
		spellTypeId: SPELL_TYPE_ID.BURN_TICK,
		title: 'Burn Tick',
		description: 'Burns the target.',
		targetEffects: {
			resources: {
				health: -1,
			},
		},
		isStatusEffectDependeny: true,
	},
	[SPELL_TYPE_ID.SCAR]: {
		spellTypeId: SPELL_TYPE_ID.SCAR,
		title: 'Scar',
		description: 'Scar the target, leaving behind a scar.',
		targetEffects: {
			statusEffectsTypeIdsToAdd: [STATUS_EFFECT_TYPE_ID.SCARRED],
		},
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
